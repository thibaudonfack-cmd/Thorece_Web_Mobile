# 🐛 Guide de Débogage - Jeu Memory

## Problème d'Upload d'Images

### ✅ Corrections Appliquées

1. **Amélioration de la gestion d'erreurs** dans `minigame.service.js`
   - Messages d'erreur plus clairs et spécifiques
   - Validation côté client (format, taille)
   - Gestion des erreurs réseau
   - Support de différents formats de réponse backend

2. **Bug critique corrigé** dans `useMemoryStore.js`
   - Correction de la détection de victoire (ligne 109)
   - Avant : `if (get().matchedPairs.length + 1 === cards.length / 2)`
   - Après : `if (newMatchedPairs.length === totalPairs)`

### 🔍 Diagnostic de l'Erreur Upload

L'erreur "No message available" peut avoir plusieurs causes :

#### 1. Backend Non Démarré
**Symptôme** : `Erreur réseau : Impossible de contacter le serveur`

**Solution** :
```bash
cd backend
./mvnw spring-boot:run
# ou
java -jar target/cipestudio-*.jar
```

**Vérification** : Ouvrir http://localhost:8080/actuator/health

#### 2. SeaweedFS Non Configuré
**Symptôme** : `Erreur serveur : Le serveur ne peut pas traiter l'image`

**Solution** :
1. Vérifier que SeaweedFS est installé et démarré
2. Vérifier la configuration dans `application.properties` :
   ```properties
   seaweedfs.url=http://localhost:9333
   ```

**Test SeaweedFS** :
```bash
curl http://localhost:9333/dir/status
```

#### 3. Fichier Invalide
**Symptôme** : `Format de fichier invalide ou fichier corrompu`

**Solution** :
- Utilisez des formats d'image standard (PNG, JPG, GIF, WebP)
- Taille max : 10 MB
- Évitez les images corrompues ou les PDF renommés en .jpg

#### 4. Problème de Permissions
**Symptôme** : `Non autorisé : Veuillez vous reconnecter`

**Solution** :
1. Vérifier que vous êtes connecté
2. Vérifier que le token JWT est valide
3. Se reconnecter si nécessaire

### 📊 Logs de Debug

Les messages de debug sont maintenant dans la console :

```javascript
// Lors de l'upload
📤 Uploading puzzle image: example.jpg Size: 234567 Type: image/jpeg

// En cas de succès
✅ Image uploaded successfully: {url: "http://..."}
✅ Image URL: http://...

// En cas d'erreur
❌ Failed to upload image. Status: 500
❌ Network error during upload: TypeError: Failed to fetch
```

### 🧪 Test Manuel

1. **Ouvrir la Console Développeur** (F12)
2. **Aller dans l'onglet Network**
3. **Essayer d'uploader une image**
4. **Vérifier la requête** :
   - Endpoint : `/api/minigames/upload-puzzle-image`
   - Method : POST
   - Type : multipart/form-data
   - Status : 200 (succès) ou 4xx/5xx (erreur)

### 🔧 Solutions Rapides

#### Problème : "Erreur réseau"
```bash
# 1. Vérifier que le backend tourne
curl http://localhost:8080/api/minigames/upload-puzzle-image

# 2. Vérifier les variables d'environnement
echo $VITE_API_URL  # Doit être http://localhost:8080
```

#### Problème : "Le serveur n'a pas retourné l'URL de l'image"
```bash
# Vérifier les logs backend
tail -f backend/logs/spring.log

# Vérifier SeaweedFS
curl -X POST http://localhost:9333/submit \
  -F "file=@test-image.jpg"
```

#### Problème : Images pas assez grandes
✅ **Déjà corrigé** dans le code :
- Grilles agrandies : 600px/700px/850px
- `object-contain` pour voir toute l'image
- Padding de 2 (8px) pour espacer l'image

### 📝 Checklist de Vérification

- [ ] Backend Spring Boot démarré
- [ ] SeaweedFS démarré et accessible
- [ ] VITE_API_URL configuré correctement
- [ ] Utilisateur connecté avec token valide
- [ ] Image valide (PNG/JPG, <10MB)
- [ ] Console browser ouverte pour voir les logs

### 🎮 Test du Jeu Memory

#### Créer un Jeu Test

1. Aller dans Tuesday.js editor
2. Créer une nouvelle épreuve "Memory"
3. Uploader 4 images minimum
4. Choisir grille 4x4 (8 paires)
5. Temps limite : 120 secondes
6. Sauvegarder et tester

#### Vérifier les Fonctionnalités

- [ ] Upload d'images fonctionne
- [ ] Images visibles dans la grille
- [ ] Flip 3D des cartes
- [ ] Sons activés/désactivés
- [ ] Détection des paires
- [ ] Confetti sur paires trouvées
- [ ] Timer fonctionne
- [ ] Victoire détectée
- [ ] Défaite détectée (timeout)
- [ ] Redirection après victoire/défaite

### 🆘 Support

Si le problème persiste :

1. **Copier les logs de la console** (F12 → Console)
2. **Copier les logs du backend** (terminal où tourne Spring Boot)
3. **Prendre une capture d'écran** de l'erreur
4. **Noter** :
   - Taille du fichier uploadé
   - Format du fichier
   - Navigateur utilisé
   - Système d'exploitation

### 🔗 Endpoints Backend

```
POST /api/minigames/upload-puzzle-image
→ Upload une image pour le puzzle/memory
→ Body: multipart/form-data avec champ "file"
→ Response: {url: "http://seaweedfs/..."}

POST /api/minigames/create
→ Crée un nouveau mini-jeu
→ Body: JSON avec config du jeu

GET /api/minigames/{id}
→ Récupère un mini-jeu par ID

PUT /api/minigames/update/{id}
→ Met à jour un mini-jeu
```

## 🎉 Améliorations Apportées

### Images Plus Visibles
- Grilles 3× plus grandes
- object-contain au lieu de object-cover
- Padding pour cadrer les images

### Interactivité Sonore
- Sons de flip, match, erreur, victoire
- Bouton mute/unmute
- Tick d'urgence sous 10 secondes

### Responsive Design
- Breakpoints md: pour mobile/desktop
- Textes, icônes, padding adaptifs
- Max-width intelligent par grille

### Gestion d'Erreurs
- Messages clairs et spécifiques
- Validation côté client
- Logs détaillés
- Support multi-format backend
