import { useState } from 'react';
import { IMAGES } from '../../constants/images';
import LogoutButton from '../../features/auth/components/LogoutButton';

export default function Sidebar({ activeItem = 'dashboard', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IMAGES.dashboardIcon },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: IMAGES.usersIcon },
    { id: 'livres', label: 'Livres', icon: IMAGES.booksIcon },
    { id: 'collections', label: 'Collections', icon: IMAGES.collectionsIcon },
    { id: 'signalements', label: 'Signalements', icon: IMAGES.reportsIcon }
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsOpen(false); // Fermer le menu après navigation
  };

  return (
    <>
      {/* Mobile: Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-blue-400 rounded-lg flex flex-col items-center justify-center gap-1.5 shadow-lg"
      >
        <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile: Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-blue-400
        fixed lg:sticky lg:top-0
        top-0 left-0
        h-screen
        w-[280px]
        flex flex-col
        lg:rounded-tr-[48px] lg:rounded-br-[48px]
        transition-transform duration-300
        z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-[14px] py-[29px] flex items-center gap-4">
          <img
            src={IMAGES.logo}
            alt="Logo"
            className="w-[51px] h-[51px] rotate-180 scale-y-[-1]"
          />
          <h1 className="font-poppins font-bold text-[32px] text-[#fef9f9] leading-none">
            Cipe Studio
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 pt-[101px] flex flex-col">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(`admin-${item.id}`)}
              className={`w-full h-[72px] flex items-center gap-4 px-[69px] transition-colors relative ${
                activeItem === item.id
                  ? 'bg-[#d9d9d9] bg-opacity-0'
                  : 'hover:bg-[#d9d9d9] hover:bg-opacity-10'
              }`}
            >
              {activeItem === item.id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-neutral-100 rounded-br-[16px] rounded-tr-[16px]" />
              )}
              <img src={item.icon} alt={item.label} className="w-[51px] h-[51px]" />
              <span className="font-poppins font-medium text-[14px] text-white leading-none">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Déconnexion */}
        <LogoutButton
          onNavigate={onNavigate}
          className="h-[72px] flex items-center gap-4 px-[69px] hover:bg-[#d9d9d9] hover:bg-opacity-10 transition-colors"
        >
          <img src={IMAGES.logoutIcon} alt="Déconnexion" className="w-[51px] h-[51px]" />
          <span className="font-poppins font-medium text-[14px] text-white leading-none">
            Déconnexion
          </span>
        </LogoutButton>
      </aside>
    </>
  );
}
