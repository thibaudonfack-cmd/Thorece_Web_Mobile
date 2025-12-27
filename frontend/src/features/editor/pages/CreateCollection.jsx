import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';
import AppHeader from '../../../components/layout/AppHeader';
import BackButton from '../../../components/ui/BackButton';
import EmojiPicker from '../../../components/ui/EmojiPicker';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { editorService } from '../services/editor.service';

export default function PageCreationCollection() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        tags: '',
        icone: '🎮'
    });

    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!coverImage) {
            alert("Veuillez ajouter une image de couverture pour la collection.");
            return;
        }

        setIsSubmitting(true);

        try {
            const collectionPayload = {
                name: formData.nom,
                description: formData.description,
                tags: formData.tags,
                icon: formData.icone
            };

            const newCollection = await editorService.createCollection(collectionPayload);
            const collectionId = newCollection.id;

            if (collectionId) {
                await editorService.uploadCover(collectionId, coverImage);
            }

            console.log('Collection créée avec succès !');
            navigate('/editor');

        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            <AppHeader
                onLogoClick={() => navigate('/editor')}
                showUserInfo={true}
                onUserClick={() => navigate('/profile')}
            />

            <div className="px-6 md:px-8 lg:px-[175px] py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <BackButton onClick={() => navigate('/editor')} />
                <h2 className="font-poppins font-bold text-2xl md:text-[36px] text-blue-400 leading-[1.5]">
                    Créer une collection
                </h2>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-8">
                <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-[885px] p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ZONE UPLOAD COUVERTURE */}
                        <div>
                            <label className="block font-poppins font-bold text-lg text-black mb-2">
                                Couverture <span className="text-red-500">*</span>
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
                                    <p className="text-sm text-gray-500 font-medium group-hover:text-blue-500">Ajouter une image</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5Mo)</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden group border border-gray-200">
                                    <img src={coverPreview} alt="Aperçu" className="w-full h-full object-cover" />
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

                        <div className="space-y-4">
                            <label className="font-poppins text-lg md:text-xl font-bold text-black">
                                Nom de la collection
                            </label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Ex: Les Classiques"
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-4 text-black font-poppins text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="font-poppins text-lg md:text-xl font-bold text-black">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Décrivez votre collection..."
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-4 text-black font-poppins text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="font-poppins text-lg md:text-xl font-bold text-black">
                                    Tags (séparés par des virgules)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="Ex: #aventure, #nature"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-4 text-black font-poppins text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="font-poppins text-lg md:text-xl font-bold text-black">
                                    Icône (emoji)
                                </label>
                                <EmojiPicker
                                    value={formData.icone}
                                    onChange={(emoji) => setFormData({ ...formData, icone: emoji })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/editor')}
                                className="w-full md:w-[183px] bg-white border border-gray-200 rounded-[10px] px-4 py-4 font-poppins font-bold text-lg text-gray-500 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="w-full md:w-[183px] bg-blue-400 border border-gray-200 rounded-[10px] px-4 py-4 font-poppins font-bold text-lg text-white hover:bg-blue-500 transition-colors disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Création...' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}