import { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import FilterButton from '../../../components/ui/FilterButton';
import LoadingState from '../../../components/ui/LoadingState';
import { IMAGES } from '../../../constants/images';
import { useAdminBooks } from '../hooks/useAdminData';

export default function PageAdminLivres({ onNavigate }) {
  const { user } = useAuth();
  const { data: books = [], isLoading } = useAdminBooks();
  const [hasUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'title'
  });

  const handleDeleteBook = (bookId) => {
    // Supprimer le livre de la liste
    // Note: Avec React Query, cela devrait être une mutation.
    // Pour l'instant on ne peut pas modifier le cache localement sans mutation.
    console.log("Delete book", bookId);
  };

  const handleBookAction = (bookId) => {
    // Rediriger vers la page logs de la ressource livre
    onNavigate('logs-ressource', {
      resourceType: 'book',
      resourceId: bookId
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrer et trier les livres
  const getFilteredAndSortedBooks = () => {
    let result = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tri
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'reads':
          return parseInt(b.reads.replace('K', '000')) - parseInt(a.reads.replace('K', '000'));
        case 'reports':
          return b.reports - a.reports;
        default:
          return 0;
      }
    });

    return result;
  };

  const filteredBooks = getFilteredAndSortedBooks();

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activeItem="livres" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-neutral-100 min-h-[98px] px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="lg:ml-0 ml-16">
            <h1 className="font-poppins font-bold text-2xl md:text-[36px] text-black leading-tight">
              Livres
            </h1>
            <p className="font-poppins text-sm md:text-base text-gray-600">
              Bienvenue, {user?.nom || "Administrateur"}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Notifications */}
            <button className="relative">
              <img
                src={IMAGES.notificationIcon}
                alt="Notifications"
                className={`w-5 h-5 md:w-6 md:h-6 ${hasUnreadNotifications ? 'filter-red' : ''}`}
                style={hasUnreadNotifications ? {
                  filter: 'invert(18%) sepia(98%) saturate(7493%) hue-rotate(357deg) brightness(95%) contrast(118%)'
                } : {}}
              />
              {hasUnreadNotifications && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full" />
              )}
            </button>

            {/* User Profile */}
            <button
              onClick={() => onNavigate('profil')}
              className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity"
            >
              <img
                src={user?.avatar || IMAGES.userAvatar}
                alt="Profil"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="font-poppins font-bold text-lg md:text-2xl text-black">
                  {user?.nom || "Administrateur"}
                </p>
                <p className="font-poppins text-sm md:text-xl text-gray-600 truncate max-w-[200px]">
                  {user?.email || "email@inconnu.com"}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[34px] px-4 border border-gray-300 rounded-lg font-poppins text-base focus:outline-none focus:border-blue-400"
              />
            </div>
            <FilterButton onFilterChange={handleFilterChange} filterType="books" />
          </div>
        </div>

        {/* Books Grid */}
        <div className="px-4 md:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-[20px] overflow-hidden shadow-md"
                >
                  {/* Book Cover */}
                  <div className="relative h-[160px] w-full">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="p-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="font-poppins text-xs sm:text-base text-gray-700 mb-1 leading-tight">
                          Pages
                        </p>
                        <p className="font-poppins text-base sm:text-lg font-medium text-black">
                          {book.pages}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-poppins text-xs sm:text-base text-gray-700 mb-1 leading-tight">
                          Auteur
                        </p>
                        <p className="font-poppins text-base sm:text-lg font-medium text-black truncate">
                          {book.author}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-poppins text-xs sm:text-base text-gray-700 mb-1 leading-tight">
                          Lectures
                        </p>
                        <div className="flex items-center gap-1">
                          <p className="font-poppins text-base sm:text-lg font-medium text-black">
                            {book.reads}
                          </p>
                          <img src={IMAGES.eyeIcon} alt="Vues" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-poppins text-xs sm:text-base text-gray-700 mb-1 leading-tight truncate">
                          Signalements
                        </p>
                        <p className="font-poppins text-base sm:text-lg font-medium text-black">
                          {book.reports}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity"
                      >
                        <img src={IMAGES.trashIconRed} alt="Supprimer" className="w-8 h-8" />
                      </button>

                      {/* Menu Action */}
                      <button
                        onClick={() => handleBookAction(book.id)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <img src={IMAGES.menuActionIcon} alt="Actions" className="w-10 h-10 rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
