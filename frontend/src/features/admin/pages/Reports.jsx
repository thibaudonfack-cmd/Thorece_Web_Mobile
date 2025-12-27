import { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import FilterButton from '../../../components/ui/FilterButton';
import LoadingState from '../../../components/ui/LoadingState';
import { IMAGES } from '../../../constants/images';
import { useReports } from '../hooks/useAdminData';

export default function PageAdminSignalements({ onNavigate }) {
  const { user } = useAuth();
  const { data: reports = [], isLoading } = useReports();
  const [hasUnreadNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    sortBy: 'date-desc'
  });


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtrer et trier les signalements
  const getFilteredAndSortedReports = () => {
    let result = reports.filter(report =>
      report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtre par type
    if (filters.type !== 'all') {
      result = result.filter(report => report.type === filters.type);
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      result = result.filter(report => report.status === filters.status);
    }

    // Tri
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'user':
          return a.user.name.localeCompare(b.user.name);
        case 'book':
          return a.book.localeCompare(b.book);
        default:
          return 0;
      }
    });

    return result;
  };

  const filteredReports = getFilteredAndSortedReports();

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar activeItem="signalements" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-neutral-100 min-h-[98px] px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="lg:ml-0 ml-16">
            <h1 className="font-poppins font-bold text-2xl md:text-[36px] text-black leading-tight">
              Signalements
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
            <FilterButton onFilterChange={handleFilterChange} filterType="reports" />
          </div>
        </div>

        {/* Reports Table - Desktop */}
        <div className="hidden md:block px-4 md:px-8 pb-8">
          <div className="bg-white rounded-[20px] p-6 shadow-md overflow-x-auto">
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Avatar */}
                  <img
                    src={report.user.avatar}
                    alt={report.user.name}
                    className="w-[51px] h-[51px] rounded-full object-cover flex-shrink-0"
                  />

                  {/* Name */}
                  <div className="w-[80px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {report.user.name}
                    </p>
                  </div>

                  {/* Book Title */}
                  <div className="w-[180px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black line-clamp-2">
                      {report.book}
                    </p>
                  </div>

                  {/* Type */}
                  <div className="w-[120px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {report.type}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-poppins text-base text-gray-700 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="w-[140px] flex-shrink-0">
                    <p className="font-poppins text-lg text-gray-600">
                      {report.date}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="w-[100px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {report.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Cards - Mobile */}
        <div className="md:hidden px-4 pb-8 space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-[20px] p-4 shadow-md"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={report.user.avatar}
                  alt={report.user.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-poppins font-bold text-base text-black">
                    {report.user.name}
                  </p>
                  <p className="font-poppins text-sm text-gray-600">
                    {report.book}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-poppins text-sm font-medium text-gray-700">Type:</span>
                  <span className="font-poppins text-sm text-black">{report.type}</span>
                </div>
                <div>
                  <p className="font-poppins text-sm text-gray-700 line-clamp-3">
                    {report.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-poppins text-xs text-gray-600">{report.date}</span>
                  <span className="font-poppins text-sm font-medium text-black">{report.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
