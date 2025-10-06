import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export interface QVTBox {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  color: string;
}

interface BoxRecommendationProps {
  boxes: QVTBox[];
  onSelectBox?: (box: QVTBox) => void;
}

const BoxRecommendation = ({ boxes, onSelectBox }: BoxRecommendationProps) => {
  if (boxes.length === 0) return null;

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2 text-foreground">
        <Sparkles className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold">Recommandations QVT Box</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <Card
            key={box.id}
            className="p-6 border-2 border-border hover:border-secondary transition-smooth cursor-pointer shadow-soft hover:shadow-glow"
            onClick={() => onSelectBox?.(box)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{box.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{box.name}</h4>
                  <span className="text-xs text-muted-foreground">{box.category}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{box.description}</p>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full transition-smooth hover:bg-secondary hover:text-secondary-foreground"
              >
                En savoir plus
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxRecommendation;
