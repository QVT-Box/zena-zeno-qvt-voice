# ⚠️ Scripts à ajouter manuellement au package.json

## Scripts de test à ajouter

Ouvrez votre `package.json` et ajoutez ces scripts dans la section `"scripts"` :

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"test:ui": "vitest --ui"
```

## Exemple complet

Votre section `"scripts"` devrait ressembler à ça :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Utilisation

Une fois les scripts ajoutés, vous pourrez :

```bash
# Lancer tous les tests
npm run test

# Mode watch (développement)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage

# Interface visuelle
npm run test:ui
```

## ✅ Tests créés

- ✅ VoiceControl.test.tsx
- ✅ ZenaAvatar.test.tsx  
- ✅ useVoiceRecognition.test.ts
- ✅ useZenaZenoBrain.test.ts
- ✅ VoiceRecognitionService.test.ts
- ✅ integration/VoiceChat.test.tsx

## 🐛 Corrections apportées

1. **Logs de debug ajoutés** dans le service de reconnaissance vocale
2. **Demande de permission microphone explicite** avant de démarrer
3. **Gestion d'erreurs améliorée** avec messages plus clairs
4. **Tests complets** pour tous les composants principaux

Consultez `README-TESTS.md` pour plus de détails !
