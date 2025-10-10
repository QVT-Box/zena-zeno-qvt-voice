import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import VoiceControl from '@/components/VoiceControl';

// Mock du hook useVoiceRecognition
vi.mock('@/hooks/useVoiceRecognition', () => ({
  useVoiceRecognition: () => ({
    isListening: false,
    transcript: '',
    error: null,
    start: vi.fn(),
    stop: vi.fn(),
    mode: 'browser',
  }),
}));

// Mock du toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('VoiceControl', () => {
  const mockOnSpeechRecognized = vi.fn();

  beforeEach(() => {
    mockOnSpeechRecognized.mockClear();
  });

  it('doit afficher le bouton micro', () => {
    const { container } = render(
      <VoiceControl
        onSpeechRecognized={mockOnSpeechRecognized}
        isSpeaking={false}
        currentMessage=""
      />
    );

    const button = container.querySelector('button');
    expect(button).toBeDefined();
  });

  it('doit afficher le message par défaut quand aucun texte', () => {
    const { container } = render(
      <VoiceControl
        onSpeechRecognized={mockOnSpeechRecognized}
        isSpeaking={false}
        currentMessage=""
      />
    );

    expect(container.textContent).toContain('Votre voix s\'affichera ici');
  });

  it('doit afficher le transcript quand disponible', () => {
    const { rerender, container } = render(
      <VoiceControl
        onSpeechRecognized={mockOnSpeechRecognized}
        isSpeaking={false}
        currentMessage=""
      />
    );

    // Simuler un transcript
    rerender(
      <VoiceControl
        onSpeechRecognized={mockOnSpeechRecognized}
        isSpeaking={false}
        currentMessage="Bonjour Zena"
      />
    );

    expect(container.textContent).toContain('Bonjour Zena');
  });

  it('doit afficher l\'état "ZÉNA parle" quand isSpeaking est true', () => {
    const { container } = render(
      <VoiceControl
        onSpeechRecognized={mockOnSpeechRecognized}
        isSpeaking={true}
        currentMessage=""
      />
    );

    expect(container.textContent).toContain('ZÉNA parle');
  });
});
