import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, companyCode?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      let companyId: string;

      // Vérifier si un code entreprise est fourni
      if (companyCode) {
        const { data: inviteData, error: inviteError } = await supabase
          .from('company_invite_codes')
          .select('company_id')
          .eq('code', companyCode.toUpperCase())
          .single();

        if (inviteError || !inviteData) {
          toast.error('Code entreprise invalide');
          return { error: new Error('Code entreprise invalide') };
        }
        companyId = inviteData.company_id;
      } else {
        // Créer automatiquement une entreprise personnelle
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: `Compte personnel - ${firstName} ${lastName}`,
            industry: 'Individual',
            employee_count: 1
          })
          .select('id')
          .single();

        if (companyError) {
          toast.error('Erreur lors de la création de votre espace');
          return { error: companyError };
        }
        companyId = company.id;
      }

      // Créer le compte utilisateur
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            company_id: companyId,
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Lier les données anonymes si elles existent
        await linkAnonymousData(data.user.id);
        
        toast.success('Compte créé avec succès !');
        navigate('/zena-chat');
      }
      
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return { error };
    }
  };

  const linkAnonymousData = async (userId: string) => {
    const sessionToken = localStorage.getItem('anonymous_session_token');
    if (!sessionToken) return;

    try {
      // Mettre à jour les sessions anonymes
      await supabase
        .from('conversation_sessions')
        .update({ user_id: userId })
        .eq('id', sessionToken)
        .is('user_id', null);

      // Supprimer le token
      localStorage.removeItem('anonymous_session_token');
    } catch (error) {
      console.error('Erreur lors de la liaison des données anonymes:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success('Connexion réussie !');
        navigate('/zena-chat');
      }
      
      return { error: null };
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error(error.message || 'Erreur lors de la connexion');
      }
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Déconnexion réussie');
      navigate('/auth');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la déconnexion');
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
