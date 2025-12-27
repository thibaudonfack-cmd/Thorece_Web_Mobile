import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import SearchBar from '../../../components/ui/SearchBar';
import Pagination from '../../../components/ui/Pagination';
import { useCollections, useDeleteCollection , useUpdateCollection } from '../hooks/useEditorData'; // Import du hook de suppression
import { useResourceFilter } from '../../../hooks/useResourceFilter';
import {
    PlusIcon,
    PencilSquareIcon,
    ClipboardDocumentListIcon,
    BookOpenIcon,
    EyeIcon,
    TrashIcon // Import de l'icône poubelle
} from '@heroicons/react/24/outline';

const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center">
        <span className="font-poppins text-[10px] uppercase text-gray-400 font-bold tracking-wider">{label}</span>
        <span className="font-poppins font-bold text-blue-500 text-sm">{value}</span>
    </div>
);

export default function EditorDashboard() {
    const navigate = useNavigate();
    const { data: collections = [], isLoading } = useCollections();
    const deleteMutation = useDeleteCollection(); // Initialisation de la mutation

    const {
        searchQuery,
        setSearchQuery,
        paginatedData,
        currentPage,
        setCurrentPage,
        totalPages,
        isEmpty
    } = useResourceFilter(collections, { keys: ['name', 'tags'], itemsPerPage: 8 });

    const handleCreate = () => navigate('/editor/collections/create');
    const  handleEdit = (collection)=>{
        navigate(`/editor/collections/edit/${collection.id}`, { 
            state : {collection}
            })
    }

    const handleView = (id) => navigate(`/editor/collections/${id}`);
    const handleLogs = (id) => navigate('/editor/logs', { state: { collectionId: id } });

    // Fonction de gestion de la suppression
    const handleDelete = async (id, name) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${name || 'Sans nom'}" ?`)) {
            try {
                await deleteMutation.mutateAsync(id);
                // Pas besoin de recharger, React Query le fait pour nous grâce au hook
            } catch (error) {
                alert("Erreur lors de la suppression : " + error.message);
            }
        }
    };

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader
                onLogoClick={() => navigate('/')}
                showUserInfo={true}
                onUserClick={() => navigate('/profile')}
                rightContent={
                    <button
                        onClick={() => navigate('/editor/catalog')}
                        className="p-2.5 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Catalogue Général"
                    >
                        <BookOpenIcon className="w-6 h-6" />
                    </button>
                }
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6 mb-5">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="w-full md:w-auto">
                        <h2 className="font-poppins font-bold text-3xl text-slate-800">Vos collections</h2>
                        <p className="text-slate-500 mt-1 text-sm">Gérez les regroupements de livres pour vos lecteurs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
                ) : isEmpty ? (
                    <div className="py-20"><EmptyState searchQuery={searchQuery} /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {paginatedData.map((collection) => (
                            <FlipResourceCard
                                key={collection.id}
                                resource={{
                                    title: collection.name || "Sans nom",
                                    description: collection.description,
                                    cover: collection.coverUrl
                                }}
                                statsComponent={
                                    <div className="flex flex-col gap-1 w-full px-2 pt-1">
                                        <h3 className="font-poppins font-bold text-lg text-slate-800 text-center line-clamp-1" title={collection.name}>
                                            {collection.name || "Sans nom"}
                                        </h3>
                                        <div className="flex justify-center">
                                            <StatItem label="Livres" value={collection.booksCount || 0} />
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-1.5 mt-1 mb-2">
                                            {(typeof collection.tags === 'string' ? collection.tags.split(',') : [])
                                                .slice(0, 3)
                                                .map((tag, index) => (
                                                    <span key={index} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-500 text-[10px] font-bold font-poppins border border-blue-100 whitespace-nowrap">
                          {tag.trim().replace('#', '')}
                        </span>
                                                ))}
                                            {(typeof collection.tags === 'string' ? collection.tags.split(',') : []).length > 3 && (
                                                <span className="px-1.5 py-0.5 text-[10px] text-gray-400 font-bold">
                          +{(typeof collection.tags === 'string' ? collection.tags.split(',') : []).length - 3}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                }
                                actionsFront={
                                    <div className="w-full flex justify-center items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleView(collection.id); }}
                                            className="p-2 rounded-full border border-blue-100 text-blue-500 hover:bg-blue-50 transition-colors"
                                            title="Voir le contenu"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(collection); }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-blue-500 transition-colors"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                            <span>Modifier</span>
                                        </button>
                                    </div>
                                }
                                actionsBack={
                                    <div className="w-full flex justify-between items-center px-4">
                                        {/* Bouton Logs à gauche */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleLogs(collection.id); }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 hover:text-blue-500 transition-colors"
                                        >
                                            <ClipboardDocumentListIcon className="w-4 h-4" />
                                            <span>Logs</span>
                                        </button>

                                        {/* Bouton Supprimer à droite (Rouge) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(collection.id, collection.name); }}
                                            className="p-2 rounded-full border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                                            title="Supprimer la collection"
                                            disabled={deleteMutation.isLoading}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <Footer />
        </div>
    );
}