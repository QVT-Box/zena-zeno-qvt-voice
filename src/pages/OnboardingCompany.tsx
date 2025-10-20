import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Building2, Users, Briefcase, Copy } from 'lucide-react';

export default function OnboardingCompany() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('companyName') as string;
    const industry = formData.get('industry') as string;
    const employeeCount = parseInt(formData.get('employeeCount') as string);

    try {
      // Créer l'entreprise
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          industry,
          employee_count: employeeCount
        })
        .select('id')
        .single();

      if (companyError) throw companyError;

      // Générer un code d'accès
      const code = `QVTBOX-${companyName.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      
      const { error: inviteError } = await (supabase as any)
        .from('company_invite_codes')
        .insert({
          company_id: company.id,
          code: code,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
          max_uses: null,
          is_active: true
        });

      if (inviteError) throw inviteError;

      // Assigner le rôle company_admin à l'utilisateur
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          company_id: company.id,
          role: 'company_admin'
        });

      if (roleError) throw roleError;

      // Mettre à jour l'employé avec la nouvelle entreprise
      const { error: employeeError } = await supabase
        .from('employees')
        .update({ company_id: company.id })
        .eq('id', user.id);

      if (employeeError) throw employeeError;

      setInviteCode(code);
      toast.success('Votre espace QVT Box a été créé !');
    } catch (error: any) {
      console.error('Erreur création entreprise:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success('Code copié !');
    }
  };

  if (inviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">🎉 Votre espace est créé !</CardTitle>
            <CardDescription className="text-center">
              Partagez ce code avec vos employés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Code d'accès entreprise</p>
              <div className="flex items-center gap-2 justify-center">
                <code className="text-2xl font-bold">{inviteCode}</code>
                <Button size="icon" variant="ghost" onClick={copyInviteCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Vos employés peuvent utiliser ce code lors de leur inscription pour rejoindre votre espace QVT Box.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => navigate('/dashboard-rh')} className="flex-1">
                Accéder au Dashboard RH
              </Button>
              <Button onClick={() => navigate('/zena-chat')} variant="outline" className="flex-1">
                Tester ZÉNA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Créez votre espace QVT Box</CardTitle>
          <CardDescription className="text-center">
            Configurez votre entreprise en quelques étapes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Nom de l'entreprise
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Ex: QVT Box"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Secteur d'activité
              </Label>
              <Input
                id="industry"
                name="industry"
                type="text"
                placeholder="Ex: Technologie, Santé, Commerce..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Nombre d'employés
              </Label>
              <Input
                id="employeeCount"
                name="employeeCount"
                type="number"
                min="1"
                placeholder="Ex: 50"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer mon espace'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
              >
                ← Retour
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}