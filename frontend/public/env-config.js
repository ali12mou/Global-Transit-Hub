/**
 * Configuration après déploiement SANS recompiler le frontend.
 * Décommentez et adaptez apiBaseUrl si l’API n’est pas sur le même hôte que cette page
 * (sinon laissez tel quel : requêtes relatives /api et /uploads derrière un reverse-proxy).
 *
 * Exemple même domaine (Nginx proxy vers Node) : souvent inutile de toucher ce fichier.
 * Exemple sous-domaine API : apiBaseUrl: "https://api.votredomaine.com/api"
 */
window.__GTT_CONFIG__ = window.__GTT_CONFIG__ || {};
// window.__GTT_CONFIG__.apiBaseUrl = "https://globaltransit-transportservice.com/api";
