import { User, UserRound } from 'lucide-react';

interface AvatarGenderSelectorProps {
  gender: 'female' | 'male';
  onGenderChange: (gender: 'female' | 'male') => void;
}

const AvatarGenderSelector = ({ gender, onGenderChange }: AvatarGenderSelectorProps) => {
  return (
    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full p-1 border border-border">
      <button
        onClick={() => onGenderChange('female')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-smooth ${
          gender === 'female'
            ? 'bg-primary text-primary-foreground shadow-glow'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="ZENA - Féminin"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">ZENA</span>
      </button>
      <button
        onClick={() => onGenderChange('male')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-smooth ${
          gender === 'male'
            ? 'bg-secondary text-secondary-foreground shadow-glow'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="ZENO - Masculin"
      >
        <UserRound className="w-4 h-4" />
        <span className="text-sm font-medium">ZENO</span>
      </button>
    </div>
  );
};

export default AvatarGenderSelector;
