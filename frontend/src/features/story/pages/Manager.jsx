import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import { useDeleteBook, useAuthorBooks, useUpdateBook, useUploadBookCover } from '../hooks/useBooks';

import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    Cog6ToothIcon,
    XMarkIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 8;

const StatItem = ({ label, value, className }) => (
    <div className="flex flex-col items-center">
        <span className="font-poppins text-[10px] uppercase text-gray-400 font-bold tracking-wider">{label}</span>
        <span className={`font-poppins font-bold text-sm ${className || 'text-blue-500'}`}>{value}</span>
    </div>
);

const ActionButton = ({ icon, onClick, colorClass, disabled, title }) => (
    <button
        onClick={(e) => { e.stopPropagation(); !disabled && onClick(); }}
        disabled={disabled}
        title={title}
        className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all shadow-sm ${disabled ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : colorClass}`}
    >
        {icon}
    </button>
);

export default function AuthorDashboard() {
    const navigate = useNavigate();

    const { data: books = [], isLoading } = useAuthorBooks();
    const deleteMutation = useDeleteBook();
    const updateBookMutation = useUpdateBook();
    const uploadCoverMutation = useUploadBookCover();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal d'édition
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const fileInputRef = useRef(null);

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => setCurrentPage(1), [searchQuery]);

    const handleCreate = () => {
        navigate('/author/story/new');
    };

    const handleEdit = (id) => navigate(`/author/visual-editor/${id}`);

    const handleSettings = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            description: book.description || ''
        });
        setCoverPreview(book.coverUrl);
        setCoverImage(null);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingBook(null);
        setFormData({ title: '', description: '' });
        setCoverImage(null);
        setCoverPreview(null);
    };

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
        setCoverPreview(editingBook?.coverUrl || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Le titre est obligatoire.');
            return;
        }

        try {
            // Mise à jour des métadonnées
            await updateBookMutation.mutateAsync({
                id: editingBook.id,
                data: {
                    title: formData.title,
                    description: formData.description
                }
            });

            // Upload de la nouvelle couverture si changée
            if (coverImage) {
                await uploadCoverMutation.mutateAsync({
                    id: editingBook.id,
                    file: coverImage
                });
            }

            handleCloseModal();
            alert('Livre mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur mise à jour:', error);
            alert('Erreur lors de la mise à jour : ' + error.message);
        }
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${title}" ?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader
                onLogoClick={() => navigate('/')}
                showUserInfo={true}
                onUserClick={() => navigate('/profile')}
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="w-full md:w-auto">
                        <h2 className="font-poppins font-bold text-3xl text-slate-800">Mes Histoires</h2>
                        <p className="text-slate-500 mt-1 text-sm">Créez et gérez vos livres interactifs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                        <div className="relative group w-full sm:w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleCreate}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl font-poppins font-bold text-sm shadow-md hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <PlusIcon className="w-5 h-5 stroke-[3]" />
                            <span>Créer</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12">
                {isLoading ? (
                    <LoadingState />
                ) : currentBooks.length === 0 ? (
                    <div className="py-20">
                        <EmptyState searchQuery={searchQuery} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {currentBooks.map((book) => {
                            // Détermination du statut publié
                            const isPublished = book.status === 'PUBLISHED';
                            // Vérification des signalements
                            const reportsCount = book.reportsCount || 0;

                            return (
                                <FlipResourceCard
                                    key={book.id}
                                    resource={{
                                        title: book.title,
                                        description: book.description,
                                        cover: book.coverUrl // Utilisation de coverUrl venant du backend
                                    }}

                                    statsComponent={
                                        <div className="flex flex-col gap-1 w-full px-2 pt-1">
                                            <h3 className="font-poppins font-bold text-lg text-slate-800 text-center line-clamp-1 mb-2" title={book.title}>
                                                {book.title}
                                            </h3>
                                            <div className="flex justify-around items-center w-full">
                                                <StatItem label="Pages" value={book.pages || 0} />
                                                <StatItem label="Vues" value={book.views || 0} />

                                                {/* Affichage conditionnel du compteur de signalements */}
                                                <StatItem
                                                    label="Signal."
                                                    value={reportsCount}
                                                    className={reportsCount > 0 ? "text-red-500" : "text-blue-500"}
                                                />
                                            </div>
                                        </div>
                                    }

                                    actionsFront={
                                        <div className="w-full flex flex-col items-center gap-2 mt-2">
                                            {/* Badge de Statut */}
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${
                                                isPublished
                                                ? 'bg-green-100 text-green-600 border-green-200'
                                                : 'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                                {isPublished ? 'Publié' : 'Brouillon'}
                                            </div>

                                            {/* Bouton paramètres */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSettings(book); }}
                                                className="flex items-center gap-2  px-5 py-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 hover:-translate-y-0.5 transition-all font-semibold text-sm"
                                                title="Modifier les paramètres du livre"
                                            >
                                                <Cog6ToothIcon className="w-4 h-4" />
                                                <span>Paramètres</span>
                                            </button>
                                        </div>
                                    }

                                    actionsBack={
                                        <div className="w-full flex justify-between items-center px-4">
                                            <ActionButton
                                                icon={isPublished ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                                                onClick={() => navigate(`/read/${book.id}`)}
                                                disabled={!isPublished}
                                                title={isPublished ? "Lire le livre" : "Livre non publié"}
                                                colorClass="border-green-100 text-green-500 bg-white hover:bg-green-50 hover:border-green-200 hover:text-green-600 "
                                            />
                                            <ActionButton
                                                icon={<PencilSquareIcon className="w-5 h-5" />}
                                                onClick={() => handleEdit(book.id)}
                                                colorClass="border-blue-100 text-blue-500 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                                            />
                                            <ActionButton
                                                icon={<TrashIcon className="w-5 h-5" />}
                                                onClick={() => handleDelete(book.id, book.title)}
                                                disabled={deleteMutation.isLoading}
                                                colorClass="border-red-100 text-red-500 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                            />
                                        </div>
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {filteredBooks.length > ITEMS_PER_PAGE && (
                <div className="px-6 md:px-8 py-6 mb-12">
                    <div className="bg-white rounded-2xl p-3 max-w-fit mx-auto flex flex-wrap items-center justify-center gap-2 shadow-sm border border-gray-100">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 font-poppins font-bold text-sm rounded-lg transition-colors ${
                                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 hover:bg-gray-100'
                            }`}
                        >
                            Précédent
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-lg font-poppins font-bold text-sm transition-colors flex items-center justify-center ${
                                        currentPage === page
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-gray-50 text-slate-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 font-poppins font-bold text-sm rounded-lg transition-colors ${
                                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-slate-600 hover:bg-gray-100'
                            }`}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {isEditModalOpen && editingBook && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-poppins font-bold text-2xl text-slate-800">
                                    Paramètres du livre
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                {/* Couverture */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                                        Couverture du livre
                                    </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleCoverChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    {coverPreview ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                                            <img
                                                src={coverPreview}
                                                alt="Aperçu"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                                                >
                                                    Changer
                                                </button>
                                                {coverImage && (
                                                    <button
                                                        type="button"
                                                        onClick={removeCover}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group"
                                        >
                                            <PhotoIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">
                                                Cliquez pour ajouter une image
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Titre */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Titre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-poppins font-medium"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="Ex: Le Voyage Fantastique"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-poppins resize-none"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        placeholder="Décrivez votre livre..."
                                        rows={4}
                                    />
                                </div>

                                {/* Boutons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateBookMutation.isPending || uploadCoverMutation.isPending}
                                        className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-70 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        {updateBookMutation.isPending || uploadCoverMutation.isPending
                                            ? 'Enregistrement...'
                                            : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}