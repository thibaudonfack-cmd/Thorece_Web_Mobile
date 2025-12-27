import { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import FilterButton from '../../../components/ui/FilterButton';
import { IMAGES } from '../../../constants/images';


// Données factices pour les collections
const INITIAL_COLLECTIONS = [
  {
    id: 1,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  },
  {
    id: 2,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  },
  {
    id: 3,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  },
  {
    id: 4,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  },
  {
    id: 5,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  },
  {
    id: 6,
    title: "Best-sellers",
    description: "Les histoires les plus aimées des enfants cette année.",
    cover: IMAGES.collection1,
    booksCount: 3,
    tags: ["#jeunesse", "#aventures"],
    editorAvatar: IMAGES.userAvatar
  }
];

export default function PageAdminCollections({ onNavigate }) {
  const { user } = useAuth();
  const [hasUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [filters, setFilters] = useState({
    sortBy: 'title'
  });

  const handleCollectionAction = (collectionId) => {
    // Rediriger vers la page logs de la ressource collection
    onNavigate('logs-ressource', {
      resourceType: 'collection',
      resourceId: collectionId
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrer et trier les collections
  const getFilteredAndSortedCollections = () => {
    let result = collections.filter(collection =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Tri
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'books':
          return b.booksCount - a.booksCount;
        default:
          return 0;
      }
    });

    return result;
  };

  const filteredCollections = getFilteredAndSortedCollections();

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activeItem="collections" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-neutral-100 min-h-[98px] px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="lg:ml-0 ml-16">
            <h1 className="font-poppins font-bold text-2xl md:text-[36px] text-black leading-tight">
              Collections
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
            <FilterButton onFilterChange={handleFilterChange} filterType="collections" />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="px-4 md:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-[20px] overflow-hidden shadow-md"
              >
                {/* Collection Cover */}
                <div className="relative h-[146px] w-full">
                  <img
                    src={collection.cover}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Collection Info */}
                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Left: Title and Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins font-bold text-2xl text-black mb-2 truncate">
                        {collection.title}
                      </h3>
                      <p className="font-poppins text-base text-gray-700 line-clamp-3 mb-4">
                        {collection.description}
                      </p>
                    </div>

                    {/* Right: Books count and tags */}
                    <div className="flex flex-col items-center gap-2 min-w-[124px]">
                      <div className="bg-gray-100 rounded-lg px-4 py-2 w-full text-center">
                        <p className="font-poppins text-lg text-black">
                          {collection.booksCount} Livres
                        </p>
                      </div>
                      {collection.tags.map((tag, index) => (
                        <p key={index} className="font-poppins text-base text-gray-700">
                          {tag}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Editor avatar and Logs button */}
                  <div className="flex items-center justify-between mt-4">
                    <img
                      src={collection.editorAvatar}
                      alt="Éditeur"
                      className="w-[60px] h-[60px] rounded-full object-cover"
                    />
                    <button
                      onClick={() => handleCollectionAction(collection.id)}
                      className="bg-blue-400 hover:bg-blue-500 text-white font-poppins text-2xl font-medium px-6 py-2 rounded-lg transition-colors"
                    >
                      Logs
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
