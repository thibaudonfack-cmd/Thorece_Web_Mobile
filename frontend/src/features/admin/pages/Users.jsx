import { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import FilterButton from '../../../components/ui/FilterButton';
import LoadingState from '../../../components/ui/LoadingState';
import { IMAGES } from '../../../constants/images';
import { useUsers } from '../hooks/useAdminData';

export default function PageAdminUtilisateurs({ onNavigate }) {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const [hasUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    sortBy: 'name'
  });

  const handleBlockUser = (userId) => {
    setBlockedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleUserAction = (userId) => {
    // Rediriger vers la page logs de la ressource utilisateur
    onNavigate('logs-ressource', {
      resourceType: 'user',
      resourceId: userId
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrer et trier les utilisateurs
  const getFilteredAndSortedUsers = () => {
    let result = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtre par rôle
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      result = result.filter(user => {
        if (filters.status === 'blocked') return blockedUsers.has(user.id);
        if (filters.status === 'active') return !blockedUsers.has(user.id);
        if (filters.status === 'verified') return user.isVerified;
        if (filters.status === 'pending') return user.isPending;
        return true;
      });
    }

    // Tri
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return a.joinDateSort - b.joinDateSort;
        case 'date-desc':
          return b.joinDateSort - a.joinDateSort;
        case 'reports':
          return b.stats.reportsCount - a.stats.reportsCount;
        default:
          return 0;
      }
    });

    return result;
  };

  const filteredUsers = getFilteredAndSortedUsers();

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activeItem="utilisateurs" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-neutral-100 min-h-[98px] px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="lg:ml-0 ml-16">
            <h1 className="font-poppins font-bold text-2xl md:text-[36px] text-black leading-tight">
              Utilisateurs
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
            <FilterButton onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="px-4 md:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const isBlocked = blockedUsers.has(user.id);
              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-[20px] p-5 shadow-md relative transition-all ${
                    isBlocked ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  {/* Menu Action Button */}
                  <button
                    onClick={() => handleUserAction(user.id)}
                    className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img src={IMAGES.menuActionIcon} alt="Actions" className="w-10 h-10 rotate-90" />
                  </button>

                  {/* Badge for Éditeur */}
                  {user.role === 'Éditeur' && (
                    <div className="absolute top-5 right-16">
                      {user.isVerified ? (
                        <img src={IMAGES.verifiedBadge} alt="Vérifié" className="w-7 h-7" />
                      ) : user.isPending ? (
                        <img src={IMAGES.pendingBadge} alt="En attente" className="w-7 h-7" />
                      ) : null}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins font-bold text-base text-black mb-1">
                        {user.name}
                      </h3>
                      <p className="font-poppins text-lg text-gray-700 mb-1">
                        {user.role}
                      </p>
                      <p className="font-poppins text-base text-gray-600 break-words">
                        {user.email}
                      </p>
                      <p className="font-poppins text-base text-gray-600 mt-1">
                        Inscrit le {user.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-start gap-4 mb-5 border-t border-gray-100 pt-4">
                    <div className="flex-1">
                      <p className="font-poppins text-base text-gray-700 mb-1 leading-tight">
                        {user.role === 'Enfant' && 'Livres Lus'}
                        {user.role === 'Auteur' && 'Livres Publié'}
                        {user.role === 'Éditeur' && 'Collections Publiés'}
                      </p>
                      <p className="font-poppins text-lg font-medium text-black">
                        {user.stats.booksRead || user.stats.booksPublished || user.stats.collectionsPublished}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins text-base text-gray-700 mb-1 leading-tight">
                        Livres signalés
                      </p>
                      <p className="font-poppins text-lg font-medium text-black">
                        {user.stats.reportsCount}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins text-base text-gray-700 mb-1 leading-tight">
                        Ancienneté
                      </p>
                      <p className="font-poppins text-lg font-medium text-black">
                        {user.stats.seniority}
                      </p>
                    </div>
                  </div>

                  {/* Block/Unblock Button */}
                  <button
                    onClick={() => handleBlockUser(user.id)}
                    className={`w-full max-w-[120px] mx-auto h-[29px] font-poppins text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${
                      isBlocked
                        ? 'bg-green-100 hover:bg-green-200 text-green-600'
                        : 'bg-red-100 hover:bg-red-200 text-red-600'
                    }`}
                  >
                    {isBlocked ? 'Débloquer' : 'Bloquer'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
