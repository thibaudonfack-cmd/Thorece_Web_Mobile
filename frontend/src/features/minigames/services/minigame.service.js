import { fetchWithAuth } from '../../auth/services/auth.service';

export const minigameService = {
    create: async (gameConfig) => {
        console.log('🎮 Creating minigame:', gameConfig);

        const response = await fetchWithAuth('/api/minigames/create', {
            method: 'POST',
            body: JSON.stringify(gameConfig),
        });

        if (!response.ok) {
            console.error('❌ Failed to create minigame. Status:', response.status);
            let errorMessage = `Failed to create minigame (${response.status})`;

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } else {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
            } catch (parseError) {
                console.error('❌ Could not parse error response:', parseError);
            }

            throw new Error(errorMessage);
        }

        try {
            const data = await response.json();
            console.log('✅ Minigame created:', data);
            return data;
        } catch (parseError) {
            console.error('❌ Failed to parse response:', parseError);
            throw new Error('Invalid response from server');
        }
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
        console.log('🔄 Updating minigame:', id, gameConfig);

        const response = await fetchWithAuth(`/api/minigames/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gameConfig),
        });

        if (!response.ok) {
            console.error('❌ Failed to update minigame. Status:', response.status);
            let errorMessage = `Failed to update minigame (${response.status})`;

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } else {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }
            } catch (parseError) {
                console.error('❌ Could not parse error response:', parseError);
            }

            throw new Error(errorMessage);
        }

        try {
            const data = await response.json();
            console.log('✅ Minigame updated:', data);
            return data;
        } catch (parseError) {
            console.error('❌ Failed to parse response:', parseError);
            throw new Error('Invalid response from server');
        }
    },

    uploadPuzzleImage: async (file) => {
        console.log('📤 Uploading puzzle image:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Validation côté client
        if (!file) {
            throw new Error('Aucun fichier sélectionné');
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('Le fichier doit être une image (PNG, JPG, GIF, etc.)');
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB max
            throw new Error('L\'image ne doit pas dépasser 10 MB');
        }

        const formData = new FormData();
        formData.append('file', file);

        let response;
        try {
            response = await fetchWithAuth('/api/minigames/upload-puzzle-image', {
                method: 'POST',
                body: formData
            });
        } catch (networkError) {
            console.error('❌ Network error during upload:', networkError);
            throw new Error('Erreur réseau : Impossible de contacter le serveur. Vérifiez votre connexion internet.');
        }

        if (!response.ok) {
            console.error('❌ Failed to upload image. Status:', response.status);
            let errorMessage = `Échec de l'upload (Erreur ${response.status})`;

            // Messages spécifiques par code d'erreur
            if (response.status === 400) {
                errorMessage = 'Format de fichier invalide ou fichier corrompu';
            } else if (response.status === 401 || response.status === 403) {
                errorMessage = 'Non autorisé : Veuillez vous reconnecter';
            } else if (response.status === 413) {
                errorMessage = 'Fichier trop volumineux (max 10 MB)';
            } else if (response.status === 500) {
                errorMessage = 'Erreur serveur : Le serveur ne peut pas traiter l\'image';
            } else if (response.status === 503) {
                errorMessage = 'Service temporairement indisponible : Réessayez dans quelques instants';
            }

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const error = await response.json();
                    if (error.message) {
                        errorMessage = error.message;
                    }
                } else {
                    const text = await response.text();
                    if (text && text.length > 0 && text.length < 200) {
                        errorMessage = text;
                    }
                }
            } catch (parseError) {
                console.error('❌ Could not parse error response:', parseError);
                // Keep the default error message
            }

            throw new Error(errorMessage);
        }

        try {
            const data = await response.json();
            console.log('✅ Image uploaded successfully:', data);

            // Vérifier que l'URL est présente
            if (!data.url && !data.imageUrl) {
                console.error('❌ Response missing URL:', data);
                throw new Error('Le serveur n\'a pas retourné l\'URL de l\'image');
            }

            // Retourner l'URL (supporter différents formats de réponse)
            const imageUrl = data.url || data.imageUrl;
            console.log('✅ Image URL:', imageUrl);
            return imageUrl;

        } catch (parseError) {
            console.error('❌ Failed to parse upload response:', parseError);
            throw new Error('Réponse serveur invalide : Impossible de récupérer l\'URL de l\'image');
        }
    }
};
