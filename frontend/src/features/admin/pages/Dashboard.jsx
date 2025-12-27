import { useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import CircularProgress from '../../../components/ui/CircularProgress';
import { IMAGES } from '../../../constants/images';

const MOCK_SIGNALEMENTS = [
  {
    id: 1,
    user: {
      name: "Soham",
      avatar: IMAGES.userAvatar
    },
    book: "The Count of Monte Cristo",
    type: "Violence",
    description: "Ratou Maui kia haere ngatahi ai ko ona tuakana ki te hii ika. I te hokinga mai o ona tuakana Kivi...",
    date: "November 28, 2025",
    status: "Lu"
  },
  {
    id: 2,
    user: {
      name: "Colleen",
      avatar: IMAGES.userAvatar
    },
    book: "The Girl with the Dragon Tattoo",
    type: "Violence",
    description: "Whakamanahia Maui ki te hii-ika, kii Katia Matu...",
    date: "October 25, 2025",
    status: "Lu"
  },
  {
    id: 3,
    user: {
      name: "Ronald",
      avatar: IMAGES.userAvatar
    },
    book: "The Little Prince",
    type: "Violence",
    description: "ka puta mai a Maui, aue te ohorere o ona tuakana.!",
    date: "December 19, 2025",
    status: "Lu"
  }
];

export default function PageAdminAccueil({ onNavigate }) {
  const { user } = useAuth();
  const [hasUnreadNotifications] = useState(true); // true = rouge, false = normal
  const [stats] = useState({
    demandes: { total: 300, processed: 225 },
    signalements: { total: 4000, processed: 3200 }
  });

  const handleActionClick = (signalementId) => {
    console.log('Action pour signalement:', signalementId);
    // TODO: Ouvrir menu d'actions
  };

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar activeItem="dashboard" onNavigate={onNavigate} />

            <div className="flex-1 flex flex-col w-full lg:w-auto">
                <header className="...">
                    <div className="lg:ml-0 ml-16">
                        <h1 className="...">Dashboard</h1>
                        <p className="font-poppins text-sm md:text-base text-gray-600">
                            Bienvenue, {user?.nom || "Administrateur"}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* ... Notifications ... */}

                        <button onClick={() => onNavigate('profil')} className="...">
                            <img
                                src={user?.avatar || IMAGES.userAvatar}
                                alt="Profil"
                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                            />
                            <div className="text-left hidden sm:block">
                                <p className="font-poppins font-bold text-lg md:text-2xl text-black">
                                    {user?.nom || "Utilisateur"}
                                </p>
                                <p className="font-poppins text-sm md:text-xl text-gray-600 truncate max-w-[200px]">
                                    {user?.email || "email@inconnu.com"}
                                </p>
                            </div>
                        </button>
                    </div>
                </header>

        {/* Stats Cards */}
        <div className="px-4 md:px-8 py-4 md:py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          <CircularProgress
            total={stats.demandes.total}
            processed={stats.demandes.processed}
            label="Demandes"
            icon={IMAGES.demandesIcon}
            onClick={() => console.log('Voir détails demandes')}
          />

          <CircularProgress
            total={stats.signalements.total}
            processed={stats.signalements.processed}
            label="Signalements"
            icon={IMAGES.signalementsIcon}
            onClick={() => onNavigate('admin-signalements')}
          />
        </div>

        {/* Recent Signalements */}
        <div className="px-4 md:px-8 pb-4 md:pb-8 overflow-hidden">
          <h2 className="font-poppins font-bold text-xl md:text-2xl text-black mb-4 md:mb-6">
            Recent signalements
          </h2>

          {/* Desktop view */}
          <div className="hidden md:block bg-white rounded-[20px] p-6 shadow-md overflow-x-auto">
            <div className="space-y-4">
              {MOCK_SIGNALEMENTS.map((signalement) => (
                <div
                  key={signalement.id}
                  className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={signalement.user.avatar}
                    alt={signalement.user.name}
                    className="w-[51px] h-[51px] rounded-full object-cover flex-shrink-0"
                  />
                  <div className="w-[60px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {signalement.user.name}
                    </p>
                  </div>
                  <div className="w-[140px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black line-clamp-2">
                      {signalement.book}
                    </p>
                  </div>
                  <div className="w-[80px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {signalement.type}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-poppins text-base text-gray-700 line-clamp-2">
                      {signalement.description}
                    </p>
                  </div>
                  <div className="w-[140px] flex-shrink-0">
                    <p className="font-poppins text-lg text-gray-600">
                      {signalement.date}
                    </p>
                  </div>
                  <div className="w-[40px] flex-shrink-0">
                    <p className="font-poppins text-lg text-black">
                      {signalement.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleActionClick(signalement.id)}
                    className="w-[51px] h-[51px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <span className="text-2xl">⋮</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view - cards */}
          <div className="md:hidden space-y-4">
            {MOCK_SIGNALEMENTS.map((signalement) => (
              <div
                key={signalement.id}
                className="bg-white rounded-[20px] p-4 shadow-md"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={signalement.user.avatar}
                    alt={signalement.user.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-bold text-base text-black">
                      {signalement.user.name}
                    </p>
                    <p className="font-poppins text-sm text-gray-600">
                      {signalement.book}
                    </p>
                  </div>
                  <button
                    onClick={() => handleActionClick(signalement.id)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <span className="text-xl">⋮</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins text-sm font-medium text-gray-700">Type:</span>
                    <span className="font-poppins text-sm text-black">{signalement.type}</span>
                  </div>
                  <div>
                    <p className="font-poppins text-sm text-gray-700 line-clamp-3">
                      {signalement.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-poppins text-xs text-gray-600">{signalement.date}</span>
                    <span className="font-poppins text-sm font-medium text-black">{signalement.status}</span>
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
