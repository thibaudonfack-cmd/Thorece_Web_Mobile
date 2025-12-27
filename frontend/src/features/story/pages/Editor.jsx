import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUploadBookCover, useCreateBook } from "../hooks/useBooks";
import AppHeader from "../../../components/layout/AppHeader";
import Footer from "../../../components/layout/Footer";
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function StoryEditor() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const isCreating = storyId === "new";

  const createBookMutation = useCreateBook();
  const uploadCoverMutation = useUploadBookCover();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ title: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 5Mo).");
        return;
      }
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert("La couverture est obligatoire !");
      return;
    }
    if (!formData.title.trim()) {
      alert("Le titre est obligatoire.");
      return;
    }

    setIsSaving(true);

    try {
      const bookPayload = {
        title: formData.title,
        description: "Description par défaut...",
        status: "DRAFT",
      };

      const createdBook = await createBookMutation.mutateAsync(bookPayload);
      const bookId = createdBook.id;

      await uploadCoverMutation.mutateAsync({ id: bookId, file: coverImage });

      navigate(`/author/visual-editor/${bookId}`, { replace: true });
    } catch (error) {
      console.error("Erreur critique :", error);
      alert("Une erreur est survenue : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Si on essaie d'accéder à /author/story/123, rediriger vers VisualEditor
  if (!isCreating && storyId) {
    navigate(`/author/visual-editor/${storyId}`, { replace: true });
    return (
      <div className="flex items-center justify-center h-screen">
        Redirection...
      </div>
    );
  }

  // Formulaire de création
  return (
    <div className="bg-brand-bg min-h-screen flex flex-col">
      <AppHeader showUserInfo={true} onLogoClick={() => navigate("/")} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">
          <button
            onClick={() => navigate("/author")}
            className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Annuler
          </button>
          <h1 className="font-poppins font-bold text-2xl text-slate-800 mb-2">
            Nouvelle Histoire
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Le début d'une grande aventure.
          </p>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Couverture du livre <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverChange}
                className="hidden"
                accept="image/*"
              />

              {!coverPreview ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <PhotoIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium group-hover:text-blue-500">
                    Cliquez pour ajouter une image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG (Max 5Mo)
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                  <img
                    src={coverPreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeCover}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Supprimer l'image"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Titre
              </label>
              <input
                type="text"
                required
                className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-poppins font-medium"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Le Voyage Fantastique"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-70 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isSaving ? "Création..." : "Commencer l'écriture"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
