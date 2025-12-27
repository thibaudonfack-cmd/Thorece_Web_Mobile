import { z } from 'zod';
import { PASSWORD_POLICY_REGEX, PASSWORD_POLICY_MESSAGE } from './validators';

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().regex(PASSWORD_POLICY_REGEX, PASSWORD_POLICY_MESSAGE),
  confirmPassword: z.string(),
  role: z.enum(['EDITEUR', 'ENFANT', 'AUTEUR'], {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" })
  }),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Vous devez confirmer avoir plus de 13 ans pour vous inscrire." }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword.length > 0) {
        if (!data.currentPassword || data.currentPassword.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Le mot de passe actuel est requis pour changer de mot de passe",
                path: ["currentPassword"],
            });
        }
        
        if (!PASSWORD_POLICY_REGEX.test(data.newPassword)) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: PASSWORD_POLICY_MESSAGE,
                path: ["newPassword"],
            });
        }

        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Les mots de passe ne correspondent pas",
                path: ["confirmPassword"],
            });
        }
    }
});