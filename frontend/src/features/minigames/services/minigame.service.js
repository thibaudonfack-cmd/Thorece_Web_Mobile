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
        console.log('🔍 Fetching minigame with ID:', id);

        if (!id) {
            console.error('❌ No ID provided to getById');
            throw new Error('Minigame ID is required');
        }

        const response = await fetchWithAuth(`/api/minigames/${id}`, {
            method: 'GET'
        });

        console.log('📡 Response status:', response.status, 'OK:', response.ok);

        if (!response.ok) {
            console.error('❌ Failed to fetch minigame. Status:', response.status);
            let errorMessage = `Failed to fetch minigame (${response.status})`;

            // Try to parse error body, but don't fail if we can't
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } else {
                    const text = await response.text();
                    console.error('❌ Non-JSON error response:', text);
                    errorMessage = text || errorMessage;
                }
            } catch (parseError) {
                console.error('❌ Could not parse error response:', parseError);
            }

            throw new Error(errorMessage);
        }

        // Parse successful response
        try {
            const data = await response.json();
            console.log('✅ Minigame data received:', data);
            return data;
        } catch (parseError) {
            console.error('❌ Failed to parse minigame data:', parseError);
            throw new Error('Invalid response from server - could not parse JSON');
        }
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
