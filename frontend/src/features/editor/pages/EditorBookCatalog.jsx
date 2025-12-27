import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import { useEditorPoolBooks, useAddToCollection } from '../../story/hooks/useBooks';
import { useCollections } from '../hooks/useEditorData';
import { PlusIcon, XMarkIcon, FlagIcon, EyeIcon } from '@heroicons/react/24/outline';
import ReportModal from '../../report/components/ReportModal';

const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center">
        <span className="font-poppins text-[10px] uppercase text-gray-400 font-bold tracking-wider">{label}</span>
        <span className="font-poppins font-bold text-blue-500 text-sm">{value}</span>
    </div>
);

const CollectionSelectorModal = ({ isOpen, onClose, onSelect, collections }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-poppins font-bold text-slate-800">Choisir une collection</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {collections.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Vous n'avez pas encore de collection.</p>
                    ) : (
                        <div className="space-y-2">
                            {collections.map(col => (
                                <button
                                    key={col.id}
                                    onClick={() => onSelect(col.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                                >
                                    <span className="text-2xl">{col.icon || '📁'}</span>
                                    <div>
                                        <p className="font-poppins font-semibold text-slate-700 group-hover:text-blue-700">{col.name}</p>
                                        <p className="text-xs text-slate-400">{col.booksCount || 0} livres</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function EditorBookCatalog() {
    const navigate = useNavigate();

    const { data: books = [], isLoading: loadingBooks } = useEditorPoolBooks();
    const { data: collections = [] } = useCollections();

    const addToCollectionMutation = useAddToCollection();

    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [reportModal, setReportModal] = useState({ isOpen: false, bookId: null, bookTitle: '' });

    const handleOpenModal = (bookId) => {
        setSelectedBookId(bookId);
        setIsModalOpen(true);
    };

    const handleOpenReport = (book) => {
        setReportModal({ isOpen: true, bookId: book.id, bookTitle: book.title });
    };

    const handleCollectionSelect = (collectionId) => {
        if (selectedBookId && collectionId) {
            addToCollectionMutation.mutate(
                { bookId: selectedBookId, collectionId },
                {
                    onSuccess: () => {
                        alert("Livre ajouté avec succès !");
                        setIsModalOpen(false);
                        setSelectedBookId(null);
                    },
                    onError: (err) => {
                        alert("Erreur : " + err.message);
                    }
                }
            );
        }
    };

    if (loadingBooks) return <LoadingState message="Chargement du catalogue..." />;

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader
                showUserInfo={true}
                onLogoClick={() => navigate('/')}
                onUserClick={() => navigate('/profile')}
                showDashboardButton={true}
                onDashboardClick={() => navigate('/editor')}
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6">
                <h1 className="text-3xl font-poppins font-bold text-slate-800">Catalogue Général</h1>
                <p className="text-slate-500 mt-1 text-sm">Sélectionnez des livres pour enrichir vos collections.</p>
            </div>

            <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12">
                {books.length === 0 ? (
                    <EmptyState message="Aucun livre disponible dans le catalogue." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {books.map((book) => (
                            <FlipResourceCard
                                key={book.id}
                                resource={{
                                    title: book.title,
                                    description: book.description || "Aucune description fournie.",
                                    cover: book.coverUrl
                                }}
                                statsComponent={
                                    <div className="flex flex-col gap-1 w-full px-2 pt-1">
                                        <h3 className="font-poppins font-bold text-lg text-slate-800 text-center line-clamp-1 mb-1" title={book.title}>
                                            {book.title}
                                        </h3>
                                        <div className="flex justify-around items-center w-full border-t border-gray-100 pt-2">
                                            <StatItem label="Pages" value={book.pages?.length || 0} />
                                            <StatItem label="Auteur" value={book.authorName || "Inconnu"} />
                                            <StatItem label="Vues" value={book.views || 0} />
                                        </div>
                                    </div>
                                }
                                actionsFront={
                                    <div className="w-full flex justify-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/read/${book.id}`); }}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md transition-all hover:scale-110"
                                            title="Lire ce livre"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(book.id); }}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-all active:scale-95"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                            <span className="text-xs font-bold uppercase">Ajouter</span>
                                        </button>
                                    </div>
                                }
                                actionsBack={
                                    <div className="w-full flex justify-between items-center px-4">
                                        <div className="w-8"></div> {/* Spacer */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenReport(book); }}
                                            className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                            title="Signaler ce livre"
                                        >
                                            <FlagIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            <CollectionSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleCollectionSelect}
                collections={collections}
            />

            {/* AJOUT MODALE */}
            <ReportModal
                isOpen={reportModal.isOpen}
                onClose={() => setReportModal({ ...reportModal, isOpen: false })}
                bookId={reportModal.bookId}
                bookTitle={reportModal.bookTitle}
            />

            <Footer />
        </div>
    );
}