import { IMAGES } from '../../constants/images';
import UserInfo from '../../features/auth/components/UserInfo';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function AppHeader({
  onLogoClick,
  rightContent,
  showUserInfo = false,
  showDashboardButton = false,
  onDashboardClick,
  onUserClick,
  variant = 'app'
}) {
  const isAuthVariant = variant === 'auth';
  const headerPadding = isAuthVariant ? 'px-6 md:px-16 pt-6 md:pt-8' : 'px-6 md:px-8 py-6';
  const headerLayout = isAuthVariant ? 'flex gap-4 md:gap-6 items-center' : 'flex items-center justify-between';
  const logoSize = isAuthVariant ? 'w-12 h-12 md:w-[79px] md:h-[79px]' : 'w-12 h-12 md:w-[51px] md:h-[51px]';
  const titleFont = isAuthVariant ? 'font-poppins font-bold text-xl md:text-2xl' : 'font-inter font-semibold text-2xl md:text-[32px]';
  const animation = isAuthVariant ? 'animate-fade-in' : '';

  return (
    <header className={`${headerPadding} ${headerLayout} ${animation}`}>
      <button
        onClick={onLogoClick}
        className="flex gap-4 items-center hover:opacity-80 transition-opacity"
        aria-label={isAuthVariant ? "Retour à l'accueil" : undefined}
      >
        {isAuthVariant && (
          <div className="flex items-center justify-center shrink-0">
            <div className="rotate-180 scale-y-[-100%]">
              <div className={logoSize}>
                <img
                  alt="Cipe Studio Logo"
                  className="w-full h-full object-cover"
                  src={IMAGES.logo}
                />
              </div>
            </div>
          </div>
        )}
        {!isAuthVariant && (
          <img
            src={IMAGES.logo}
            alt="Logo"
            className={`${logoSize} rotate-180 scale-y-[-1]`}
          />
        )}
        <h1 className={`${titleFont} text-black`}>
          Cipe Studio
        </h1>
      </button>

      {!isAuthVariant && (
        <div className="flex items-center gap-4">

          {showDashboardButton && (
            <button
              onClick={onDashboardClick}
              className="p-2.5 rounded-full text-slate-500 hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
              title="Retour au tableau de bord"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
          )}

          {rightContent}

          {showUserInfo && <UserInfo onClick={onUserClick} />}
        </div>
      )}
    </header>
  );
}