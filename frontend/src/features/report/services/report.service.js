import { fetchWithAuth } from '../../auth/services/auth.service';

export const reportService = {
    createReport: async (reportData) => {
        const response = await fetchWithAuth('/reports', {
            method: 'POST',
            body: JSON.stringify(reportData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Impossible d'envoyer le signalement");
        }
        return true;
    }
};