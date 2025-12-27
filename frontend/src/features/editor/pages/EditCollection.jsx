import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import AppHeader from "../../../components/layout/AppHeader";
import BackButton from "../../../components/ui/BackButton";
import EmojiPicker from "../../../components/ui/EmojiPicker";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUpdateCollection, useUploadCover } from "../hooks/useEditorData";

export default function EditCollection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const collection = location.state?.collection;
  const fileInputRef = useRef(null);

  const updateMutation = useUpdateCollection();
  const uploadCoverMutation = useUploadCover();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    icon: "🎮",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState(null);

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || "",
        description: collection.description || "",
        tags: collection.tags || "",
        icon: collection.icon || "🎮",
      });
      setCurrentCoverUrl(collection.coverUrl || null);
    }
  }, [collection]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: parseInt(id),
        data: formData,
      });

      if (coverImage) {
        await uploadCoverMutation.mutateAsync({
          collectionId: parseInt(id),
          file: coverImage,
        });
      }

      navigate("/editor");
    } catch (error) {
      alert(
        "Erreur lors de la modification : " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const isSubmitting =
    updateMutation.isPending || uploadCoverMutation.isPending;

  const handleCancel = () => {
    navigate("/editor");
  };

  if (!collection) {
    return (
      <div className="bg-neutral-100 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl">📭</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 text-xl font-poppins font-semibold">
              Collection introuvable
            </p>
            <p className="text-gray-500 text-sm">
              Cette collection n'existe pas ou a été supprimée
            </p>
          </div>
          <button
            onClick={() => navigate("/editor")}
            className="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-400/40 transition-all hover:scale-105 font-poppins font-semibold shadow-lg"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <AppHeader
        onLogoClick={() => navigate("/editor")}
        showUserInfo={true}
        onUserClick={() => navigate("/profile")}
      />

      {/* Section titre et bouton retour */}
      <div className="px-6 md:px-8 lg:px-[175px] py-6">
        <div className="flex items-center gap-6">
          <BackButton onClick={() => navigate("/editor")} />
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
            Modifier la collection
          </h2>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 px-6 md:px-8 lg:px-[175px] py-8">
        <div className="bg-white border-2 border-gray-200 rounded-3xl w-full max-w-4xl mx-auto p-8 md:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Zone de modification de couverture */}
            <div className="space-y-3">
              <label className="font-poppins font-semibold text-lg text-gray-800 block">
                Couverture de la collection
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverChange}
                className="hidden"
                accept="image/*"
              />

              {coverPreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden group border-2 border-gray-200">
                  <img
                    src={coverPreview}
                    alt="Nouvelle couverture"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-poppins font-medium text-sm"
                    >
                      Changer
                    </button>
                    <button
                      type="button"
                      onClick={removeCover}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Annuler le changement"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Nouvelle image
                  </div>
                </div>
              ) : currentCoverUrl ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden group border-2 border-gray-200">
                  <img
                    src={currentCoverUrl}
                    alt="Couverture actuelle"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-poppins font-medium flex items-center gap-2"
                    >
                      <PhotoIcon className="w-5 h-5" />
                      Modifier la couverture
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <PhotoIcon className="w-7 h-7 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600 font-poppins font-medium group-hover:text-blue-500 transition-colors">
                    Ajouter une couverture
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG (Max 5Mo)
                  </p>
                </div>
              )}
            </div>

            {/* Nom de la collection */}
            <div className="space-y-3 group">
              <label className="font-poppins font-semibold text-lg text-gray-800 block">
                Nom de la collection
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Les Classiques"
                className="w-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3.5 text-gray-700 font-poppins text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3 group">
              <div className="flex items-center justify-between">
                <label className="font-poppins font-semibold text-lg text-gray-800">
                  Description
                </label>
                <span
                  className={`text-sm font-medium transition-colors ${
                    formData.description.length > 450
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.description.length} / 500
                </span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Décrivez votre collection en quelques mots..."
                maxLength="500"
                className="w-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3.5 text-gray-700 font-poppins text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all min-h-[120px] resize-none placeholder:text-gray-400"
                required
              />
            </div>

            {/* Tags et Icône - Grid aligné */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div className="space-y-3">
                <label className="font-poppins font-semibold text-lg text-gray-800 block">
                  Tags
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="Ex: best-seller, jeunesse"
                    className="w-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-5 py-3.5 text-gray-700 font-poppins text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 px-1">
                    Séparés par des virgules
                  </p>
                </div>
              </div>

              {/* Icône */}
              <div className="space-y-3">
                <label className="font-poppins font-semibold text-lg text-gray-800 block">
                  Icône (emoji)
                </label>
                <EmojiPicker
                  value={formData.icon}
                  onChange={(emoji) =>
                    setFormData({ ...formData, icon: emoji })
                  }
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-gray-300 rounded-xl font-poppins font-semibold text-base text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-poppins font-bold text-base shadow-lg shadow-blue-400/40 hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Modification...</span>
                  </>
                ) : (
                  <>
                    <span>Enregistrer les modifications</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
