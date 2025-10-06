import { Button } from '@/components/ui/button';
import { Briefcase, Heart, Scale, Users } from 'lucide-react';

export type RoleType = 'coach' | 'manager' | 'parent' | 'legal';

interface RoleSelectorProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
}

const roles = [
  { id: 'coach' as RoleType, label: 'Coach Bien-être', icon: Heart, description: 'Gérer le stress et l\'énergie' },
  { id: 'manager' as RoleType, label: 'Manager QVT', icon: Briefcase, description: 'Performance et équilibre' },
  { id: 'parent' as RoleType, label: 'Parent Mentor', icon: Users, description: 'Soutien émotionnel' },
  { id: 'legal' as RoleType, label: 'Conseiller', icon: Scale, description: 'Informer et protéger' },
];

const RoleSelector = ({ currentRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center animate-slide-up">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = currentRole === role.id;
        
        return (
          <Button
            key={role.id}
            variant={isActive ? 'default' : 'outline'}
            onClick={() => onRoleChange(role.id)}
            className={`flex flex-col items-center gap-2 h-auto py-4 px-6 transition-smooth ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-glow' 
                : 'bg-card hover:bg-muted border-border'
            }`}
          >
            <Icon className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold text-sm">{role.label}</div>
              <div className="text-xs opacity-80">{role.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
