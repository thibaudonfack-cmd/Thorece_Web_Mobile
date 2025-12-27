import { fetchWithAuth } from '../../auth/services/auth.service';

export const minigameService = {
    create: async (gameConfig) => {
        const response = await fetchWithAuth('/api/minigames/create', {
            method: 'POST',
            body: JSON.stringify(gameConfig),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create minigame');
        }
        
        return await response.json();
    },

    getById: async (id) => {
        const response = await fetchWithAuth(`/api/minigames/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch minigame');
        }

        return await response.json();
    },

    update: async (id, gameConfig) => {
        const response = await fetchWithAuth(`/api/minigames/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gameConfig),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update minigame');
        }

        return await response.json();
    }
};
