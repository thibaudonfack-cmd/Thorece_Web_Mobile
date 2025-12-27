import { fetchWithAuth } from "../../auth/services/auth.service";

export const editorService = {
  getCollections: async () => {
    const response = await fetchWithAuth("/collections");
    if (!response.ok) throw new Error("Impossible de charger les collections");
    return await response.json();
  },

  getCollectionById: async (id) => {
    const response = await fetchWithAuth(`/collections/${id}`);
    if (!response.ok) throw new Error("Impossible de charger la collection");
    return await response.json();
  },

  createCollection: async (data) => {
    const response = await fetchWithAuth("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur création collection");
    return await response.json();
  },

  uploadCover: async (collectionId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchWithAuth(`/collections/${collectionId}/cover`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur upload couverture");
    return await response.json();
  },

  removeBookFromCollection: async (collectionId, bookId) => {
    const response = await fetchWithAuth(
      `/collections/${collectionId}/books/${bookId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Erreur lors de la suppression du livre");
    return true;
  },

  deleteCollection: async (id) => {
    const response = await fetchWithAuth(`/collections/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Impossible de supprimer la collection");
    return true;
  },

updateCollection: async (id, data) => {
  const response = await fetchWithAuth(`/collections/${id}`, {
    method: "PUT", 
    body: JSON.stringify(data), 
  });
  if (!response.ok) throw new Error("Erreur lors de la modification");
  return await response.json();
},

};
