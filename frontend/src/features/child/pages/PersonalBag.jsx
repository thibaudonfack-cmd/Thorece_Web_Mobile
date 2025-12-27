import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import SearchBar from '../../../components/ui/SearchBar';
import Pagination from '../../../components/ui/Pagination';
import { usePersonalBooks, useRemoveFromBag } from '../../story/hooks/useBooks';
import { useResourceFilter } from '../../../hooks/useResourceFilter';
import { EyeIcon, TrashIcon, FlagIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import ReportModal from '../../report/components/ReportModal';

export default function PersonalBag() {
    const navigate = useNavigate();
    const { data: books = [], isLoading } = usePersonalBooks();
    const removeFromBagMutation = useRemoveFromBag();
    const [reportModal, setReportModal] = useState({ isOpen: false, bookId: null, bookTitle: '' });

    const {
        searchQuery,
        setSearchQuery,
        paginatedData,
        currentPage,
        setCurrentPage,
        totalPages,
        isEmpty
    } = useResourceFilter(books, { keys: ['title', 'authorName'], itemsPerPage: 8 });

    const handleRead = (bookId) => {
        navigate(`/read/${bookId}`);
    };

    const handleRemove = (bookId, title) => {
        if (window.confirm(`Retirer "${title}" de ton sac ?`)) {
            removeFromBagMutation.mutate(bookId);
        }
    };
    const handleOpenReport = (book) => {
        setReportModal({ isOpen: true, bookId: book.id, bookTitle: book.title });
    };

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader
                showUserInfo={true}
                onLogoClick={() => navigate('/')}
                onUserClick={() => navigate('/profile')}
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="w-full md:w-auto">
                        <h1 className="text-3xl font-poppins font-bold text-slate-800">Mon Sac à Dos</h1>
                        <p className="text-slate-500 mt-1 text-sm">Retrouve ici toutes tes histoires préférées.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />

                        <button
                            onClick={() => navigate('/child/library')}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl font-poppins font-bold text-sm shadow-md hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <BookOpenIcon className="w-5 h-5 stroke-[2]" />
                            <span>Bibliothèque</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12">
                {isLoading ? (
                    <LoadingState message="Ouverture du sac..." />
                ) : isEmpty ? (
                    <div className="py-20"><EmptyState searchQuery={searchQuery} emptyMessage="Ton sac est vide ! Va à la bibliothèque pour ajouter des livres." /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {paginatedData.map((book) => (
                            <FlipResourceCard
                                key={book.id}
                                resource={{
                                    title: book.title,
                                    description: book.description,
                                    cover: book.coverUrl
                                }}
                                statsComponent={
                                    <div className="flex flex-col gap-1 w-full px-2 pt-1">
                                        <h3 className="font-poppins font-bold text-lg text-slate-800 text-center line-clamp-1">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-center text-slate-500">
                                            Par {book.authorName || "Auteur inconnu"}
                                        </p>
                                    </div>
                                }
                                actionsFront={
                                    <div className="w-full flex justify-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRead(book.id); }}
                                            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full font-bold shadow-md hover:bg-green-600 transition-all hover:scale-105"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                            <span>LIRE</span>
                                        </button>
                                    </div>
                                }
                                actionsBack={
                                    <div className="w-full flex justify-between items-center px-4">
                                        {/* MODIFICATION : On ajoute le bouton signalement à gauche */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenReport(book); }}
                                            className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                            title="Signaler ce livre"
                                        >
                                            <FlagIcon className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemove(book.id, book.title); }}
                                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 bg-white rounded-full font-bold hover:bg-red-50 transition-colors"
                                            disabled={removeFromBagMutation.isPending}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                            <span className="text-xs uppercase">Retirer</span>
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