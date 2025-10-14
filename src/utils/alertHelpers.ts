export function getAlertLevelColor(level: string): 'destructive' | 'default' | 'secondary' | 'outline' {
  switch (level) {
    case 'critique': return 'destructive';
    case 'élevé': return 'default';
    case 'modéré': return 'secondary';
    default: return 'outline';
  }
}

export function getAlertTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    burnout: '🔥 Burnout',
    démotivation: '😔 Démotivation',
    isolement_social: '🤐 Isolement',
    surcharge: '⚡ Surcharge',
    conflits_valeurs: '⚖️ Conflits de valeurs'
  };
  return labels[type] || type;
}
