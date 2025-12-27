import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import SearchBar from '../../../components/ui/SearchBar';
import Pagination from '../../../components/ui/Pagination';
import { usePublicBooks, useAddToBag, usePersonalBooks } from '../../story/hooks/useBooks';
import { useResourceFilter } from '../../../hooks/useResourceFilter';
import { PlusIcon, CheckIcon, ShoppingBagIcon, FlagIcon } from '@heroicons/react/24/outline';
import ReportModal from '../../report/components/ReportModal';
import { useState, useMemo } from 'react';

const ActionButton = ({ onClick, icon: Icon, label, disabled, success }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        disabled={disabled || success}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all active:scale-95 ${
            success
                ? 'bg-green-500 text-white cursor-default hover:bg-green-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${disabled && !success ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-bold uppercase">{label}</span>
    </button>
);

export default function Library() {
    const navigate = useNavigate();

    const { data: publicBooks = [], isLoading: loadingPublic } = usePublicBooks();

    const { data: personalBooks = [], isLoading: loadingPersonal } = usePersonalBooks();

    const addToBagMutation = useAddToBag();

    const [justAdded, setJustAdded] = useState({});

    const [reportModal, setReportModal] = useState({
        isOpen: false,
        bookId: null,
        bookTitle: ''
    });

    const {
        searchQuery,
        setSearchQuery,
        paginatedData,
        currentPage,
        setCurrentPage,
        totalPages,
        isEmpty
    } = useResourceFilter(publicBooks, { keys: ['title', 'authorName'], itemsPerPage: 8 });

    const ownedBookIds = useMemo(() => {
        return new Set(personalBooks.map(b => b.id));
    }, [personalBooks]);

    const handleAddToBag = (bookId) => {
        addToBagMutation.mutate(bookId, {
            onSuccess: () => {
                setJustAdded(prev => ({ ...prev, [bookId]: true }));
            }
        });
    };

    const handleOpenReport = (book) => {
        setReportModal({
            isOpen: true,
            bookId: book.id,
            bookTitle: book.title
        });
    };

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader
                showUserInfo={true}
                onLogoClick={() => navigate('/')}
                onUserClick={() => navigate('/profile')}
                rightContent={
                    <button
                        onClick={() => navigate('/child/bag')}
                        className="p-2.5 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors relative"
                        title="Mon Sac"
                    >
                        <ShoppingBagIcon className="w-6 h-6" />
                        {personalBooks.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                }
            />

            <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="w-full md:w-auto">
                        <h1 className="text-3xl font-poppins font-bold text-slate-800">Bibliothèque Publique</h1>
                        <p className="text-slate-500 mt-1 text-sm">Découvre les histoires validées par nos éditeurs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12">
                {loadingPublic || loadingPersonal ? (
                    <LoadingState message="Chargement de la bibliothèque..." />
                ) : isEmpty ? (
                    <div className="py-20"><EmptyState searchQuery={searchQuery} emptyMessage="Aucun livre n'est disponible pour le moment." /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {paginatedData.map((book) => {
                            const isOwned = ownedBookIds.has(book.id) || justAdded[book.id];

                            return (
                                <FlipResourceCard
                                    key={book.id}
                                    resource={{
                                        title: book.title,
                                        description: book.description,
                                        cover: book.coverUrl
                                    }}
                                    statsComponent={
                                        <div className="flex flex-col gap-1 w-full px-2 pt-1">
                                            <h3 className="font-poppins font-bold text-lg text-slate-800 text-center line-clamp-1" title={book.title}>
                                                {book.title}
                                            </h3>
                                            <div className="flex justify-around items-center w-full border-t border-gray-100 pt-2">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase text-gray-400 font-bold">Auteur</span>
                                                    <span className="font-bold text-blue-500 text-xs">{book.authorName}</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase text-gray-400 font-bold">Vues</span>
                                                    <span className="font-bold text-blue-500 text-xs">{book.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    actionsFront={
                                        <div className="w-full flex justify-center">
                                            <ActionButton
                                                onClick={() => !isOwned && handleAddToBag(book.id)}
                                                icon={isOwned ? CheckIcon : PlusIcon}
                                                label={isOwned ? "Dans le sac" : "Ajouter au sac"}
                                                success={isOwned}
                                                disabled={addToBagMutation.isPending && !isOwned}
                                            />
                                        </div>
                                    }
                                    actionsBack={
                                        <div className="w-full flex justify-between items-center px-4">
                                            <div className="w-8"></div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenReport(book); }}
                                                className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                                title="Signaler ce contenu"
                                            >
                                                <FlagIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

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