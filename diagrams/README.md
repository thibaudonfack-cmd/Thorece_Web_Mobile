# Diagrammes UML - Cipe Studio

Ce dossier contient tous les diagrammes UML du projet Cipe Studio au format PlantUML (`.puml`).

## Liste des diagrammes

### Diagrammes fonctionnels

1. **usecase.puml** - Diagramme de cas d'utilisation
   - Vue d'ensemble des fonctionnalités et des acteurs
   - Relations entre les rôles (Enfant, Auteur, Éditeur, Admin)
   - Cas d'utilisation principaux de chaque acteur

2. **sequence_register.puml** - Diagramme de séquence : Inscription
   - Processus d'inscription d'un nouvel utilisateur
   - Validation multi-niveaux (frontend, backend, DB)
   - Hashing bcrypt du mot de passe
   - Génération et envoi du code OTP par email
   - Interactions Frontend ↔ Backend ↔ Base de données ↔ SMTP

3. **activity_register.puml** - Diagramme d'activité : Inscription d'un utilisateur
   - Flux complet d'inscription (création de compte)
   - Validation des données (frontend et backend)
   - Hashing du mot de passe avec bcrypt
   - Génération et envoi du code OTP par email
   - Redirection vers la page de vérification OTP

4. **sequence_login.puml** - Diagramme de séquence : Connexion
   - Processus d'authentification avec email/mot de passe
   - Génération et envoi du code OTP par email
   - Interactions Frontend ↔ Backend ↔ Base de données

5. **sequence_verify_otp.puml** - Diagramme de séquence : Vérification OTP
   - Validation du code OTP à 6 chiffres
   - Génération des tokens JWT (access + refresh)
   - Configuration des cookies httpOnly sécurisés

6. **sequence_refresh.puml** - Diagramme de séquence : Refresh Token
   - Processus de renouvellement de l'access token
   - Validation complète du refresh token (signature, expiration, révocation)
   - Vérification de l'utilisateur et de son statut
   - Génération d'un nouveau access token
   - Retry automatique de la requête initiale

7. **activity_refresh.puml** - Diagramme d'activité : Revalidation de session
   - Processus de refresh du token d'accès
   - Vérification du refresh token (signature, expiration, révocation)
   - Génération d'un nouveau access token
   - Mécanisme de refresh automatique (intercepteur frontend)
   - Gestion des erreurs et redirection vers login

8. **sequence_publish_book.puml** - Diagramme de séquence : Publication de livre
   - Sauvegarde du contenu draft (pendant l'édition)
   - Publication du contenu avec structure S3
   - Mise à jour du statut du livre (DRAFT → PUBLISHED)

9. **activity_create_book.puml** - Diagramme d'activité : Création de livre
   - Flux complet de création d'un livre par un auteur
   - Validation des données et upload de couverture
   - Traitement de l'image et déduplication (hash SHA-512)

### Diagrammes techniques

10. **class_diagram.puml** - Diagramme de classes (Modèle de données)
   - Toutes les entités JPA du backend
   - Relations entre les entités (One-to-One, One-to-Many, Many-to-Many)
   - Énumérations (Role, BookStatus, GameType, etc.)
   - Contraintes et indexes

11. **database_er.puml** - Diagramme Entité-Relation (Base de données)
   - Schéma de la base de données MySQL
   - Tables, colonnes, types de données
   - Clés primaires, clés étrangères, contraintes UNIQUE
   - Indexes pour l'optimisation des requêtes

12. **component_diagram.puml** - Diagramme de composants
   - Architecture logicielle Frontend et Backend
   - Packages et modules principaux
   - Relations entre les composants
   - Services externes (SeaweedFS, SMTP)

13. **deployment_diagram.puml** - Diagramme de déploiement
   - Architecture physique du système
   - Serveurs et leurs rôles
   - Protocoles de communication
   - Configuration Docker

## Comment générer les diagrammes

### Méthode 1 : En ligne (PlantUML Web Server)

1. Aller sur http://www.plantuml.com/plantuml/uml/
2. Copier-coller le contenu d'un fichier `.puml`
3. Le diagramme s'affiche automatiquement
4. Télécharger en PNG/SVG/PDF via le bouton "Download"

### Méthode 2 : Extension VS Code

1. Installer l'extension **PlantUML** dans VS Code
   ```
   ext install jebbs.plantuml
   ```

2. Installer **Graphviz** (requis pour le rendu)
   - **Windows** : `choco install graphviz` ou télécharger depuis https://graphviz.org/download/
   - **Mac** : `brew install graphviz`
   - **Linux** : `sudo apt install graphviz`

3. Ouvrir un fichier `.puml` dans VS Code

4. Appuyer sur `Alt+D` (ou `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram")

5. Exporter via `Ctrl+Shift+P` → "PlantUML: Export Current Diagram"

### Méthode 3 : Ligne de commande

1. Télécharger **plantuml.jar** depuis https://plantuml.com/download

2. Installer **Graphviz** (voir méthode 2)

3. Générer un diagramme :
   ```bash
   java -jar plantuml.jar usecase.puml
   ```

4. Pour générer tous les diagrammes :
   ```bash
   java -jar plantuml.jar *.puml
   ```

5. Pour générer en SVG :
   ```bash
   java -jar plantuml.jar -tsvg usecase.puml
   ```

### Méthode 4 : Docker (si Java n'est pas installé)

```bash
docker run --rm -v $(pwd):/data plantuml/plantuml:latest -tpng *.puml
```

## Formats de sortie supportés

- **PNG** : Images raster (par défaut)
- **SVG** : Images vectorielles (recommandé pour le rapport)
- **PDF** : Document PDF
- **EPS** : Encapsulated PostScript
- **LATEX** : Code LaTeX

## Intégration dans le rapport

Pour intégrer les diagrammes dans le rapport Markdown :

```markdown
### 4.1 Diagramme de cas d'utilisation

![Diagramme de cas d'utilisation](diagrams/usecase.png)

*Figure 1 - Diagramme de cas d'utilisation de Cipe Studio*
```

Ou pour un rapport LaTeX :

```latex
\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{diagrams/usecase.png}
\caption{Diagramme de cas d'utilisation de Cipe Studio}
\label{fig:usecase}
\end{figure}
```

## Conventions de nommage

- **usecase** : Diagrammes de cas d'utilisation
- **sequence** : Diagrammes de séquence
- **activity** : Diagrammes d'activité
- **class** : Diagrammes de classes
- **component** : Diagrammes de composants
- **deployment** : Diagrammes de déploiement
- **database_er** : Diagramme Entité-Relation

## Ressources

- [PlantUML Official Documentation](https://plantuml.com/)
- [PlantUML Cheat Sheet](https://ogom.github.io/draw_uml/plantuml/)
- [PlantUML Real World Examples](https://real-world-plantuml.com/)

## Notes

- Tous les diagrammes sont générés à partir de fichiers texte `.puml`, ce qui permet :
  - **Versionning facile** avec Git (diff lisibles)
  - **Collaboration** : modifications faciles à merger
  - **Génération automatique** dans le pipeline CI/CD
  - **Pas de dépendance** à un logiciel propriétaire (Visio, Lucidchart, etc.)

- Les diagrammes sont **cohérents** avec le code source analysé

- Les diagrammes respectent les **notations UML standard**
