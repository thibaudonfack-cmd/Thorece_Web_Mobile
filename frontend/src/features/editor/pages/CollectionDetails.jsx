import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRemoveBookFromCollection, useCollection } from '../hooks/useEditorData';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import BackButton from '../../../components/ui/BackButton';
import LoadingState from '../../../components/ui/LoadingState';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import { TrashIcon, FlagIcon, EyeIcon } from '@heroicons/react/24/outline';
import ReportModal from '../../report/components/ReportModal';

const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center">
        <span className="font-poppins text-[10px] uppercase text-gray-400 font-bold tracking-wider">{label}</span>
        <span className="font-poppins font-bold text-blue-500 text-sm">{value}</span>
    </div>
);

export default function CollectionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: collection, isLoading, isError } = useCollection(id);
    const removeBookMutation = useRemoveBookFromCollection();

    const [reportModal, setReportModal] = useState({ isOpen: false, bookId: null, bookTitle: '' });

    const handleRemoveBook = async (bookId) => {
        if (!window.confirm("Retirer ce livre de la collection ?")) return;

        try {
            await removeBookMutation.mutateAsync({ collectionId: id, bookId });
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    };

    const handleOpenReport = (book) => {
        setReportModal({ isOpen: true, bookId: book.id, bookTitle: book.title });
    };

    if (isLoading) return (
        <div className="min-h-screen bg-neutral-100 flex flex-col">
            <AppHeader showUserInfo={true} onLogoClick={() => navigate('/')} />
            <div className="flex-1 flex items-center justify-center">
                <LoadingState message="Chargement de la collection..." />
            </div>
        </div>
    );

    if (isError || !collection) return (
        <div className="min-h-screen bg-neutral-100 flex flex-col">
            <AppHeader showUserInfo={true} onLogoClick={() => navigate('/')} />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Collection introuvable</h2>
                <BackButton onClick={() => navigate('/editor')} label="Retour au tableau de bord" />
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col font-inter">
            <AppHeader
                showUserInfo={true}
                onLogoClick={() => navigate('/')}
                onUserClick={() => navigate('/profile')}
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-8">
                {/* En-tête avec détails */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                    <BackButton onClick={() => navigate('/editor')} />

                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 animate-fade-in-up">
                        {collection.coverUrl && (
                            <img
                                src={collection.coverUrl}
                                alt={collection.name}
                                className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl shadow-md bg-gray-100"
                            />
                        )}
                        <div>
                            <h1 className="text-3xl font-poppins font-bold text-slate-800 flex items-center gap-3">
                                <span className="text-4xl">{collection.icon || '📁'}</span>
                                {collection.name}
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg">{collection.description}</p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {collection.tags && typeof collection.tags === 'string' && collection.tags.split(',').map((tag, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-100">
                                        {tag.trim().replace('#', '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Titre Section Livres */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-2xl font-poppins font-bold text-slate-800">
                        Livres inclus <span className="text-slate-400 font-normal text-lg ml-2">({collection.books ? collection.books.length : 0})</span>
                    </h2>
                    <button
                        onClick={() => navigate('/editor/catalog')}
                        className="text-blue-500 font-bold hover:underline text-sm"
                    >
                        + Ajouter des livres
                    </button>
                </div>

                {/* Grille des livres */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center pb-20">
                    {collection.books && collection.books.map((book) => (
                        <FlipResourceCard
                            key={book.id}
                            resource={{
                                title: book.title,
                                description: book.description,
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
                                <div className="w-full flex justify-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/read/${book.id}`); }}
                                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md transition-all hover:scale-110"
                                        title="Lire ce livre"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            }
                            actionsBack={
                                <div className="w-full flex justify-between items-center px-4">
                                    {/* MODIFICATION : Ajout du bouton signalement */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenReport(book); }}
                                        className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                        title="Signaler ce livre"
                                    >
                                        <FlagIcon className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemoveBook(book.id); }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all bg-white shadow-sm"
                                        title="Retirer de la collection"
                                        disabled={removeBookMutation.isLoading}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase">Retirer</span>
                                    </button>
                                </div>
                            }
                        />
                    ))}

                    {(!collection.books || collection.books.length === 0) && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 w-full">
                            <p className="text-gray-400 font-poppins mb-4">Cette collection est vide pour le moment.</p>
                            <button
                                onClick={() => navigate('/editor/catalog')}
                                className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                            >
                                Aller au catalogue
                            </button>
                        </div>
                    )}
                </div>
            </div>

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