export const PASSWORD_POLICY_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,50}$/;
export const PASSWORD_POLICY_MESSAGE = "Le mot de passe doit contenir entre 8 et 50 caractères, inclure au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!).";

/**
 * Valide si le mot de passe respecte la politique de sécurité.
 * @param {string} password 
 * @returns {string|null} Message d'erreur ou null si valide.
 */
export const validatePassword = (password) => {
    if (!password) return null; // La validation 'requis' est gérée ailleurs si nécessaire
    if (PASSWORD_POLICY_REGEX.test(password)) return null;
    return PASSWORD_POLICY_MESSAGE;
};

/**
 * Vérifie si les deux mots de passe correspondent.
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {string|null} Message d'erreur ou null si valide.
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return "Les deux mots de passe ne correspondent pas.";
    }
    return null;
};
