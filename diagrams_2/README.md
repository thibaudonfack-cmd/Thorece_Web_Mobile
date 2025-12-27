# Diagrammes UML - Partie 2 : Aspects Techniques

Ce dossier contient les diagrammes PlantUML de la deuxième partie du rapport, couvrant les aspects techniques, l'architecture logicielle, les stratégies de déploiement et les outils DevOps du projet Cipe Studio.

## Liste des diagrammes

### 1. **monolith_vs_microservices.puml** - Comparaison Architecture Monolithique vs Microservices
   - Architecture monolithique actuelle de Cipe Studio
   - Architecture microservices (évolution future possible)
   - Avantages et inconvénients de chaque approche
   - Justification du choix monolithique pour le projet

### 2. **backend_layers.puml** - Architecture en Couches du Backend
   - Presentation Layer (Controllers)
   - Security Layer (JWT, Authorization)
   - Business Layer (Services)
   - Data Access Layer (Repositories)
   - Relations avec les services externes (MySQL, SeaweedFS, SMTP)
   - Principe de séparation des responsabilités

### 3. **frontend_architecture.puml** - Architecture Feature-Based du Frontend
   - Organisation par features (auth, story, child, editor, admin)
   - Structure de chaque feature (pages, components, services, hooks)
   - Composants partagés (shared/)
   - Gestion d'état avec TanStack Query
   - Flux de données (Page → Hook → Service → Backend)

### 4. **architecture_simple_vs_scalable.puml** - Évolution de l'Architecture
   - Architecture Simple (actuelle) : serveur unique
   - Architecture Intermédiaire (1000-5000 utilisateurs) : load balancing basique
   - Architecture Scalable (> 10 000 utilisateurs) : clusters, cache distribué, monitoring
   - Coûts estimés et stratégie de montée en charge progressive

### 5. **testing_pyramid.puml** - Pyramide de Tests
   - Tests Unitaires (60-70%) : JUnit 5, Vitest
   - Tests d'Intégration (20-30%) : Bruno CLI, Spring Boot Test
   - Tests E2E (5-10%) : Tests manuels critiques
   - Comparaison avec l'anti-pattern (pyramide inversée)
   - Stratégie de tests pour Cipe Studio (backend et frontend)

### 6. **cicd_pipeline.puml** - Pipeline CI/CD GitLab
   - Stage 1 : Test (tests unitaires backend avec JUnit)
   - Stage 2 : Package (build JAR avec Maven)
   - Stage 3 : Integration Tests (tests API avec Bruno CLI)
   - Stage 4 : Build Images (Docker build backend + frontend)
   - Stage 5 : Deploy (déploiement dev automatique, prod manuel)
   - Durée totale : 10-15 minutes

### 7. **git_workflow.puml** - Workflow Git et Stratégie de Branching
   - GitLab Flow adapté (main, develop, feature/*, bugfix/*, hotfix/*)
   - Processus de Merge Request avec code review
   - Conventional Commits (feat, fix, refactor, docs, test, chore)
   - Protections de branches
   - Workflow complet avec exemples de commandes

### 8. **deployment_strategies.puml** - Stratégies de Déploiement
   - Blue-Green Deployment (recommandé pour Cipe Studio)
   - Rolling Deployment (alternative progressive)
   - Canary Deployment (avancé, pour le futur)
   - Implémentation Blue-Green avec Docker Compose
   - Scripts de déploiement et rollback

### 9. **logging_monitoring.puml** - Logging et Monitoring
   - Architecture de logging actuelle (Logback + fichiers)
   - Architecture recommandée (ELK Stack : Elasticsearch, Logstash, Kibana)
   - Monitoring avec Prometheus + Grafana
   - Métriques clés à surveiller (latence, mémoire, CPU, DB connections)
   - Implémentation progressive (4 phases)

### 10. **technology_stack.puml** - Stack Technique Complet
   - Frontend Stack (React 19, Vite 7, TanStack Query, Tailwind CSS, TuesdayJS)
   - Backend Stack (Spring Boot 3.5.9, Java 21, Spring Security, JPA, Hibernate)
   - Database & Storage (MySQL 8.0, HikariCP, SeaweedFS)
   - DevOps & Tools (Docker, GitLab CI/CD, Nginx, Maven, npm)
   - Testing Tools (JUnit 5, Mockito, Bruno CLI, Vitest)
   - Justification des choix technologiques

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
   java -jar plantuml.jar monolith_vs_microservices.puml
   ```

4. Pour générer tous les diagrammes :
   ```bash
   java -jar plantuml.jar *.puml
   ```

5. Pour générer en SVG :
   ```bash
   java -jar plantuml.jar -tsvg monolith_vs_microservices.puml
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
### 7.1 Comparaison Monolithique vs Microservices

![Architecture Monolithique vs Microservices](diagrams_2/monolith_vs_microservices.png)

*Figure 1 - Comparaison entre architecture monolithique (actuelle) et microservices (future)*
```

Ou pour un rapport LaTeX :

```latex
\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{diagrams_2/monolith_vs_microservices.png}
\caption{Comparaison entre architecture monolithique et microservices}
\label{fig:monolith-vs-microservices}
\end{figure}
```

## Thématiques couvertes

Ces diagrammes illustrent les concepts suivants de la deuxième partie du rapport :

- **Section 7 (Technologies)** : technology_stack.puml, monolith_vs_microservices.puml
- **Section 8 (Base de données)** : Référence aux diagrammes de la partie 1 (database_er.puml)
- **Section 9 (Tests)** : testing_pyramid.puml
- **Section 10 (Monitoring)** : logging_monitoring.puml
- **Section 11 (CI/CD)** : cicd_pipeline.puml
- **Section 12 (Docker)** : Référence aux diagrammes de la partie 1 (deployment_diagram.puml)
- **Section 13 (Packages)** : technology_stack.puml
- **Section 14 (Git)** : git_workflow.puml
- **Section 15 (Sécurité)** : backend_layers.puml (Security Layer)
- **Section 16 (Performance)** : architecture_simple_vs_scalable.puml

## Cohérence avec le code source

Tous les diagrammes sont basés sur :
- L'analyse complète du code source (backend et frontend)
- Les fichiers de configuration (`pom.xml`, `package.json`, `.gitlab-ci.yml`, `docker-compose.yml`)
- Les bonnes pratiques de l'industrie (12-factor app, pyramide de tests, GitLab Flow)
- Les recommandations d'amélioration pour le futur

## Notes

- Les diagrammes respectent les **notations UML standard** et les conventions PlantUML
- Tous les diagrammes sont **générés à partir de fichiers texte** (`.puml`), ce qui permet :
  - **Versionning facile** avec Git (diff lisibles)
  - **Collaboration** : modifications faciles à merger
  - **Génération automatique** dans le pipeline CI/CD
  - **Pas de dépendance** à un logiciel propriétaire (Visio, Lucidchart, etc.)
- Les couleurs utilisées facilitent la distinction entre les différentes couches et composants
- Les notes et légendes fournissent des explications détaillées et des exemples concrets

## Ressources

- [PlantUML Official Documentation](https://plantuml.com/)
- [PlantUML Cheat Sheet](https://ogom.github.io/draw_uml/plantuml/)
- [PlantUML Real World Examples](https://real-world-plantuml.com/)
- [UML Diagrams Guide](https://www.uml-diagrams.org/)

## Différence avec diagrams/

Le dossier `diagrams/` contient les diagrammes de la **première partie** du rapport (aspects fonctionnels et architecture globale) :
- Diagrammes de cas d'utilisation
- Diagrammes de séquence (login, OTP, publication)
- Diagramme d'activité (création de livre)
- Diagramme de classes (entités JPA)
- Diagramme ER (base de données)
- Diagramme de composants
- Diagramme de déploiement physique

Le dossier `diagrams_2/` contient les diagrammes de la **deuxième partie** du rapport (aspects techniques et DevOps) :
- Comparaison d'architectures
- Stratégies de tests et déploiement
- Pipeline CI/CD
- Workflow Git
- Stack technique complet
- Logging et monitoring
