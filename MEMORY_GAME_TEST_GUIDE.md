# 🧪 Guide de Test - Jeu Memory avec Logs Debug

## 🔍 Problèmes à Diagnostiquer

1. **Jeu ne s'affiche pas toujours**
2. **Cartes ne se retournent pas** (pas d'interaction)
3. **Écrans victoire/défaite**

## 📋 Procédure de Test

### Étape 1 : Ouvrir la Console Développeur

1. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
2. Allez dans l'onglet **Console**
3. Effacez les logs existants (clic droit → Clear console)

### Étape 2 : Charger le Jeu Memory

1. Naviguez vers la page contenant le jeu Memory
2. **OBSERVEZ LES LOGS** dans la console

#### Logs Attendus au Chargement :

```
🎮 Loading Memory game with ID: <id>
📦 Game data received: {type: "MEMORY", ...}
📋 Parsed config: {imagePairs: [...], gridSize: 4, ...}
✅ Full config: {...}
🖼️ Image pairs count: X
🎬 initializeGame called with config: {...}
🃏 Created X cards from Y pairs
✅ Game initialized! Status set to "playing" with X cards
🎮 Game status changed: playing
🃏 Cards in game: X, Status: playing
🎲 Rendering Memory game {gridSize: 4, cardsCount: X, status: "playing"}
```

### Étape 3 : Cliquer sur une Carte

1. **Cliquez sur n'importe quelle carte**
2. **OBSERVEZ LES LOGS** dans la console

#### Logs Attendus au Clic :

```
🖱️ Card clicked: 0-a {isLocked: false, isFlipped: false, isMatched: false}
✅ Flipping card: 0-a
🎯 handleCardClick called: 0-a Status: playing
🔄 Calling flipCard for: 0-a
🔄 flipCard called: 0-a {status: "playing", isLocked: false, flippedCardsCount: 0}
✅ Flipping card: 0-a New flipped cards: ["0-a"]
```

### Étape 4 : Cliquer sur une Deuxième Carte

1. **Cliquez sur une autre carte**
2. **OBSERVEZ LES LOGS**

#### Logs Attendus (2ème clic) :

```
🖱️ Card clicked: 1-a {isLocked: false, isFlipped: false, isMatched: false}
✅ Flipping card: 1-a
🎯 handleCardClick called: 1-a Status: playing
🔄 Calling flipCard for: 1-a
🔄 flipCard called: 1-a {status: "playing", isLocked: false, flippedCardsCount: 1}
✅ Flipping card: 1-a New flipped cards: ["0-a", "1-a"]
🎲 Two cards flipped, checking match...
```

## 🚨 Scénarios d'Erreur et Solutions

### Erreur 1 : Le Jeu Ne Se Charge Pas

**Symptôme** : Vous voyez uniquement :
```
🎮 Loading Memory game with ID: <id>
⏳ Waiting for config...
```

**Diagnostic** :
- Le backend n'a pas retourné de données
- La config JSON est invalide
- gameId est incorrect

**Solution** :
1. Vérifiez que le backend est démarré
2. Vérifiez que le jeu existe en BD :
   ```sql
   SELECT * FROM mini_games WHERE id = <id>;
   ```
3. Vérifiez le contentJson :
   ```sql
   SELECT content_json FROM mini_games WHERE id = <id>;
   ```

### Erreur 2 : "No Image Pairs in Config"

**Symptôme** :
```
❌ ERROR: No image pairs in config!
🖼️ Image pairs count: 0
❌ Showing error screen. Error: Aucune image configurée pour ce jeu
```

**Cause** : Le jeu a été créé sans images

**Solution** :
1. Éditez le jeu dans l'interface
2. Uploadez au moins 4 images (pour 4×4 = 8 paires)
3. Sauvegardez

### Erreur 3 : Status Reste "loading"

**Symptôme** :
```
🎮 Game status changed: loading
🃏 Cards in game: 0, Status: loading
```

**Cause** : `initializeGame()` n'a pas été appelé

**Diagnostic** :
- Vérifiez si vous voyez `🎬 initializeGame called`
- Si non → problème dans le useEffect de chargement

**Solution** : Regardez les logs de parsing de config

### Erreur 4 : Cartes Ne Se Retournent Pas

**Symptôme** : Aucun log quand vous cliquez sur une carte

**Causes Possibles** :

#### A) onClick Non Attaché
- Le div de la carte n'a pas de onClick

#### B) Status N'est Pas "playing"
```
🎯 handleCardClick called: 0-a Status: loading  ← PROBLÈME!
⏸️ Card flip blocked: status is not "playing", current status: loading
```

**Solution** : Le jeu n'a pas été initialisé correctement

#### C) Carte Déjà Flippée
```
🖱️ Card clicked: 0-a {isLocked: false, isFlipped: true, isMatched: false}
⏸️ Card click blocked: already flipped
```

**Normal** : C'est le comportement attendu

#### D) Jeu Verrouillé
```
🔄 flipCard called: 0-a {status: "playing", isLocked: true, flippedCardsCount: 2}
⏸️ flipCard blocked: game is locked
```

**Normal** : Attendez que l'animation se termine (800ms ou 1200ms)

### Erreur 5 : Victoire/Défaite Ne S'affiche Pas

**Symptôme** : Après avoir trouvé toutes les paires, rien ne se passe

**Logs Attendus** :
```
🎯 Paires trouvées: 8/8
🎉 Toutes les paires trouvées ! Victoire !
🎮 Game status changed: won
```

**Si Absents** :
1. Vérifiez le code de `checkMatch` dans useMemoryStore.js
2. Ligne 109-116 doit déclencher la victoire

## 📊 Checklist de Vérification Complète

### Avant de Tester

- [ ] Backend démarré (`./mvnw spring-boot:run`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Jeu Memory créé avec au moins 4 images
- [ ] Console F12 ouverte et nettoyée

### Logs de Chargement

- [ ] `🎮 Loading Memory game with ID:`
- [ ] `📦 Game data received:`
- [ ] `📋 Parsed config:`
- [ ] `✅ Full config:`
- [ ] `🖼️ Image pairs count: X` (X > 0)
- [ ] `🎬 initializeGame called`
- [ ] `🃏 Created X cards from Y pairs`
- [ ] `✅ Game initialized! Status set to "playing"`
- [ ] `🎮 Game status changed: playing`
- [ ] `🎲 Rendering Memory game`

### Logs d'Interaction (1er Clic)

- [ ] `🖱️ Card clicked:`
- [ ] `✅ Flipping card:`
- [ ] `🎯 handleCardClick called:`
- [ ] `🔄 Calling flipCard for:`
- [ ] `🔄 flipCard called:`
- [ ] `✅ Flipping card: ... New flipped cards:`

### Logs d'Interaction (2ème Clic)

- [ ] `🎲 Two cards flipped, checking match...`
- [ ] **Si match** : `🎯 Paires trouvées: X/Y`
- [ ] **Si toutes paires** : `🎉 Toutes les paires trouvées ! Victoire !`

### Logs de Victoire

- [ ] `🎮 Game status changed: won`
- [ ] Écran de victoire s'affiche avec confetti
- [ ] Bouton "Télécharger certificat" visible
- [ ] Bouton "Continuer la lecture" visible

### Logs de Défaite (Timer)

- [ ] `⏰ Temps écoulé ! Défaite déclenchée (Memory).`
- [ ] `🎮 Game status changed: lost`
- [ ] Écran de défaite s'affiche
- [ ] Compte à rebours 4s visible
- [ ] Redirection automatique après 4s

## 🎯 Actions à Prendre Selon les Résultats

### Si TOUT Fonctionne
✅ **Le jeu est opérationnel !**
- Supprimez les logs de production
- Committez et pushez

### Si Chargement Échoue
1. Copiez TOUS les logs de la console
2. Vérifiez l'onglet Network pour voir la requête `/api/minigames/<id>`
3. Envoyez-moi :
   - Les logs de console
   - Le status code de la requête
   - Le corps de la réponse

### Si Cartes Ne Se Retournent Pas
1. Copiez les logs depuis le chargement jusqu'au clic
2. Vérifiez si le status est bien `"playing"`
3. Vérifiez si `onClick` est attaché (Inspect element sur une carte)

### Si Victoire/Défaite Ne S'affiche Pas
1. Trouvez toutes les paires manuellement
2. Copiez les logs après le dernier match
3. Vérifiez si `status changed: won` apparaît

## 📸 Informations à Fournir

En cas de problème, fournissez :

1. **Logs de console complets** (copier/coller)
2. **Captures d'écran** :
   - L'écran du jeu
   - L'onglet Network (requête API)
   - L'onglet Console
3. **Étapes de reproduction** :
   - Quel navigateur
   - Quelle action a causé le problème
   - À quel moment ça s'est produit

## 🔧 Commandes Utiles

### Forcer Rechargement
```
Ctrl + Shift + R (ou Cmd + Shift + R sur Mac)
```

### Vider Cache
```
F12 → Application → Clear storage → Clear site data
```

### Voir État du Store Zustand (en console)
```javascript
// À taper dans la console
window.useMemoryStore.getState()
```

### Forcer Victoire (Debug)
```javascript
// À taper dans la console (DEV ONLY)
window.useMemoryStore.setState({ status: 'won', showVictoryScreen: true })
```

### Forcer Défaite (Debug)
```javascript
// À taper dans la console (DEV ONLY)
window.useMemoryStore.setState({ status: 'lost', showDefeatScreen: true })
```
