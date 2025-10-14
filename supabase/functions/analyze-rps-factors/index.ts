import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RPSDimension {
  score: number;
  keywords: string[];
  alerts: string[];
}

interface RPSAnalysis {
  globalRiskLevel: "faible" | "modéré" | "élevé" | "critique";
  dimensions: {
    intensityWork: RPSDimension;
    emotionalDemands: RPSDimension;
    autonomy: RPSDimension;
    socialRelations: RPSDimension;
    valueConflicts: RPSDimension;
    jobInsecurity: RPSDimension;
  };
  burnoutRiskScore: number;
  motivationIndex: number;
  detectedPatterns: string[];
  recommendedActions: string[];
}

// Keywords pour chaque dimension RPS
const RPS_KEYWORDS = {
  intensityWork: {
    high: ['surcharge', 'débordé', 'urgence', 'deadline', 'heures sup', 'trop de travail', 'pas le temps', 'speed', 'rush', 'interruptions', 'multitâche'],
    medium: ['beaucoup', 'chargé', 'intense', 'rapide', 'pression'],
    low: ['gérable', 'équilibré', 'rythme']
  },
  emotionalDemands: {
    high: ['clients difficiles', 'tension', 'conflit', 'agressivité', 'colère', 'frustration', 'souffrance', 'émotions', 'pleurs', 'crise'],
    medium: ['stressant', 'compliqué', 'tendu', 'difficile'],
    low: ['calme', 'serein', 'paisible']
  },
  autonomy: {
    high: ['contrôle', 'micromanagement', 'imposé', 'pas de marge', 'surveillance', 'dicté', 'pas mon mot', 'pas décider'],
    medium: ['suivi', 'encadré', 'peu de liberté'],
    low: ['autonome', 'libre', 'décisions', 'initiative']
  },
  socialRelations: {
    high: ['manager toxique', 'collègues', 'harcèlement', 'isolé', 'seul', 'pas de soutien', 'conflits', 'mauvaise ambiance', 'ignoré'],
    medium: ['tensions', 'difficultés relationnelles', 'incompréhension'],
    low: ['équipe', 'soutien', 'reconnaissance', 'bien avec', 'bonne entente']
  },
  valueConflicts: {
    high: ['inutile', 'absurde', 'sens', 'qualité impossible', 'contre mes valeurs', 'compromis', 'mal à l\'aise', 'éthique'],
    medium: ['questionnement', 'doute', 'pertinence'],
    low: ['sens', 'utile', 'fier', 'contribue']
  },
  jobInsecurity: {
    high: ['licenciement', 'précarité', 'réorganisation', 'incertitude', 'peur de perdre', 'instabilité', 'avenir flou'],
    medium: ['changements', 'inquiétude', 'évolutions'],
    low: ['sécurisé', 'stable', 'confiance']
  }
};

// Keywords burnout (3 dimensions Maslach)
const BURNOUT_KEYWORDS = {
  emotionalExhaustion: ['fatigué', 'épuisé', 'vidé', 'à bout', 'plus d\'énergie', 'sommeil', 'insomnie', 'réveils', 'maux de tête', 'tensions'],
  depersonalization: ['démotivé', 'cynique', 'détaché', 'plus envie', 'me fous', 'plus important', 'désengagé'],
  reducedAccomplishment: ['inefficace', 'nul', 'incapable', 'échec', 'perte de sens', 'pas bon', 'doute']
};

function calculateDimensionScore(text: string, dimension: keyof typeof RPS_KEYWORDS): RPSDimension {
  const lowerText = text.toLowerCase();
  const keywords = RPS_KEYWORDS[dimension];
  
  let score = 50; // Neutre par défaut
  const foundKeywords: string[] = [];
  const alerts: string[] = [];

  // Analyser les keywords high (augmentent le score de risque)
  for (const kw of keywords.high) {
    if (lowerText.includes(kw)) {
      score += 8;
      foundKeywords.push(kw);
    }
  }

  // Analyser les keywords medium
  for (const kw of keywords.medium) {
    if (lowerText.includes(kw)) {
      score += 4;
      foundKeywords.push(kw);
    }
  }

  // Analyser les keywords low (diminuent le score de risque)
  for (const kw of keywords.low) {
    if (lowerText.includes(kw)) {
      score -= 5;
      foundKeywords.push(kw);
    }
  }

  // Limiter le score entre 0 et 100
  score = Math.max(0, Math.min(100, score));

  // Générer des alertes selon le score
  if (score >= 70) {
    alerts.push(`Risque élevé détecté sur la dimension "${dimension}"`);
  } else if (score >= 50) {
    alerts.push(`Attention: surveillance recommandée sur "${dimension}"`);
  }

  return { score: Math.round(score), keywords: foundKeywords, alerts };
}

function calculateBurnoutScore(text: string): number {
  const lowerText = text.toLowerCase();
  let totalScore = 0;

  // Épuisement émotionnel (40 points max)
  let exhaustionScore = 0;
  for (const kw of BURNOUT_KEYWORDS.emotionalExhaustion) {
    if (lowerText.includes(kw)) exhaustionScore += 4;
  }
  totalScore += Math.min(40, exhaustionScore);

  // Dépersonnalisation (30 points max)
  let depersonScore = 0;
  for (const kw of BURNOUT_KEYWORDS.depersonalization) {
    if (lowerText.includes(kw)) depersonScore += 5;
  }
  totalScore += Math.min(30, depersonScore);

  // Réduction accomplissement (30 points max)
  let accomplishmentScore = 0;
  for (const kw of BURNOUT_KEYWORDS.reducedAccomplishment) {
    if (lowerText.includes(kw)) accomplishmentScore += 5;
  }
  totalScore += Math.min(30, accomplishmentScore);

  return Math.min(100, totalScore);
}

function calculateMotivationIndex(text: string): number {
  const lowerText = text.toLowerCase();
  let motivationScore = 50; // Neutre par défaut

  const positiveKeywords = ['motivé', 'envie', 'objectif', 'projet', 'fier', 'réussite', 'progression', 'apprendre'];
  const negativeKeywords = ['démotivé', 'plus envie', 'lassitude', 'routine', 'ennui', 'stagnation'];

  for (const kw of positiveKeywords) {
    if (lowerText.includes(kw)) motivationScore += 8;
  }

  for (const kw of negativeKeywords) {
    if (lowerText.includes(kw)) motivationScore -= 10;
  }

  return Math.max(0, Math.min(100, motivationScore));
}

function detectPatterns(analysis: RPSAnalysis): string[] {
  const patterns: string[] = [];

  // Surcharge chronique
  if (analysis.dimensions.intensityWork.score >= 70) {
    patterns.push('surcharge_chronique');
  }

  // Isolement social
  if (analysis.dimensions.socialRelations.score >= 60) {
    patterns.push('isolement_social');
  }

  // Perte de sens
  if (analysis.dimensions.valueConflicts.score >= 65) {
    patterns.push('perte_de_sens');
  }

  // Risque burnout global
  if (analysis.burnoutRiskScore >= 51) {
    patterns.push('risque_burnout_élevé');
  }

  // Démotivation profonde
  if (analysis.motivationIndex < 30) {
    patterns.push('démotivation_profonde');
  }

  // Manque d'autonomie
  if (analysis.dimensions.autonomy.score >= 65) {
    patterns.push('manque_autonomie');
  }

  return patterns;
}

function generateRecommendations(analysis: RPSAnalysis): string[] {
  const recommendations: string[] = [];

  if (analysis.burnoutRiskScore >= 71) {
    recommendations.push("Consulter immédiatement le médecin du travail");
    recommendations.push("Prendre contact avec la ligne d'écoute psychologique");
  } else if (analysis.burnoutRiskScore >= 51) {
    recommendations.push("Planifier un entretien avec le manager pour réévaluer la charge");
    recommendations.push("Envisager un test burnout complet avec un professionnel");
  }

  if (analysis.dimensions.intensityWork.score >= 65) {
    recommendations.push("Revoir la répartition des tâches et prioriser");
    recommendations.push("Mettre en place des limites (horaires, interruptions)");
  }

  if (analysis.dimensions.socialRelations.score >= 60) {
    recommendations.push("Organiser des moments d'équipe informels");
    recommendations.push("Demander un coaching ou médiation si conflits");
  }

  if (analysis.motivationIndex < 40) {
    recommendations.push("Identifier un projet motivant ou formation");
    recommendations.push("Discuter d'évolution de carrière avec RH");
  }

  return recommendations;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, userId, sessionId } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculer les 6 dimensions RPS
    const intensityWork = calculateDimensionScore(text, 'intensityWork');
    const emotionalDemands = calculateDimensionScore(text, 'emotionalDemands');
    const autonomy = calculateDimensionScore(text, 'autonomy');
    const socialRelations = calculateDimensionScore(text, 'socialRelations');
    const valueConflicts = calculateDimensionScore(text, 'valueConflicts');
    const jobInsecurity = calculateDimensionScore(text, 'jobInsecurity');

    // Calculer score burnout et motivation
    const burnoutRiskScore = calculateBurnoutScore(text);
    const motivationIndex = calculateMotivationIndex(text);

    // Calculer le niveau de risque global
    const avgScore = (
      intensityWork.score +
      emotionalDemands.score +
      autonomy.score +
      socialRelations.score +
      valueConflicts.score +
      jobInsecurity.score
    ) / 6;

    let globalRiskLevel: "faible" | "modéré" | "élevé" | "critique";
    if (burnoutRiskScore >= 71 || avgScore >= 75) {
      globalRiskLevel = "critique";
    } else if (burnoutRiskScore >= 51 || avgScore >= 60) {
      globalRiskLevel = "élevé";
    } else if (burnoutRiskScore >= 26 || avgScore >= 45) {
      globalRiskLevel = "modéré";
    } else {
      globalRiskLevel = "faible";
    }

    const analysis: RPSAnalysis = {
      globalRiskLevel,
      dimensions: {
        intensityWork,
        emotionalDemands,
        autonomy,
        socialRelations,
        valueConflicts,
        jobInsecurity,
      },
      burnoutRiskScore,
      motivationIndex,
      detectedPatterns: [],
      recommendedActions: []
    };

    // Détecter les patterns
    analysis.detectedPatterns = detectPatterns(analysis);
    analysis.recommendedActions = generateRecommendations(analysis);

    // Sauvegarder dans rps_tracking si on a un userId
    if (userId && sessionId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('rps_tracking').insert({
        user_id: userId,
        session_id: sessionId,
        intensity_work_score: intensityWork.score,
        emotional_demands_score: emotionalDemands.score,
        autonomy_score: autonomy.score,
        social_relations_score: socialRelations.score,
        value_conflicts_score: valueConflicts.score,
        job_insecurity_score: jobInsecurity.score,
        burnout_risk_score: burnoutRiskScore,
        motivation_index: motivationIndex,
        global_risk_level: globalRiskLevel,
        detected_patterns: analysis.detectedPatterns,
        keywords_detected: [
          ...intensityWork.keywords,
          ...emotionalDemands.keywords,
          ...autonomy.keywords,
          ...socialRelations.keywords,
          ...valueConflicts.keywords,
          ...jobInsecurity.keywords
        ],
        recommended_actions: analysis.recommendedActions
      });
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-rps-factors] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
