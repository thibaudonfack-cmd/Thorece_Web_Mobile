import { fetchWithAuth } from '../../auth/services/auth.service';

export const storyService = {
    getBookById: async (id) => {
        const response = await fetchWithAuth(`/books/${id}`);
        if (!response.ok) throw new Error("Erreur chargement du livre");
        return await response.json();
    },

    getBookContent: async (id, type = 'published') => {
        const response = await fetchWithAuth(`/page/${id}/${type}/content`);
        if (!response.ok) throw new Error("Erreur chargement du contenu");
        return await response.json();
    },

    getAuthorBooks: async () => {
        const response = await fetchWithAuth('/books/author');
        if (!response.ok) throw new Error('Erreur lors du chargement de vos livres');
        return await response.json();
    },

    createBook: async (bookData) => {
        const response = await fetchWithAuth('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Erreur lors de la création du livre");
        }
        return await response.json();
    },

    updateBook: async (id, bookData) => {
        const response = await fetchWithAuth(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde du livre");
        }
        return await response.json();
    },

    uploadCover: async (bookId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetchWithAuth(`/books/${bookId}/cover`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'upload de la couverture");
        }
        return await response.json();
    },

    deleteBook: async (id) => {
        const response = await fetchWithAuth(`/books/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Impossible de supprimer le livre");
        return id;
    },

    getPublishedBooksPool: async () => {
        const response = await fetchWithAuth('/books/published');
        if (!response.ok) throw new Error('Erreur chargement catalogue éditeur');
        return await response.json();
    },

    addBookToCollection: async (bookId, collectionId) => {
        const response = await fetchWithAuth(`/collections/${collectionId}/books`, {
            method: 'POST',
            body: JSON.stringify({ bookId })
        });
        if (!response.ok) throw new Error("Erreur ajout collection");
        return true;
    },

    getPublicCollectionsBooks: async () => {
        const response = await fetchWithAuth('/books/public');
        if (!response.ok) throw new Error('Erreur chargement bibliothèque');
        return await response.json();
    },

    getPersonalBagBooks: async () => {
        const response = await fetchWithAuth('/books/bag');
        if (!response.ok) throw new Error('Erreur chargement du sac');
        return await response.json();
    },

    addToBag: async (bookId) => {
        const response = await fetchWithAuth(`/users/me/bag/${bookId}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error("Erreur ajout au sac");
        return true;
    },
    removeFromBag: async (bookId) => {
        const response = await fetchWithAuth(`/users/me/bag/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Erreur lors du retrait du livre");
        return true;
    },
    saveStoryContent: async (id, content, status) => {
        const response = await fetchWithAuth(`/page/${id}/content`, {
            method: 'PUT',
            body: JSON.stringify({
                bookContent: content,
                bookStatus: status
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde du contenu");
        }
        return await response.json();
    },
};