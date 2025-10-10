import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ZenaAvatar from '@/components/ZenaAvatar';

describe('ZenaAvatar', () => {
  it('doit afficher l\'avatar', () => {
    const { container } = render(
      <ZenaAvatar isSpeaking={false} emotion="neutral" />
    );

    expect(container).toBeDefined();
  });

  it('doit accepter différentes émotions', () => {
    const emotions: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
    
    emotions.forEach(emotion => {
      const { container } = render(
        <ZenaAvatar isSpeaking={false} emotion={emotion} />
      );
      expect(container).toBeDefined();
    });
  });

  it('doit gérer l\'état speaking', () => {
    const { container } = render(
      <ZenaAvatar isSpeaking={true} emotion="positive" />
    );

    expect(container).toBeDefined();
  });
});
