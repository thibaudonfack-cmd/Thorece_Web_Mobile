import { useAuth } from '../context/AuthContext';

export default function UserInfo({ onClick }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center gap-3 animate-pulse p-2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.nom || "Invité";

    const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128&bold=true`;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer focus:outline-none text-left"
        >
            {/* 3. Image avec Fallback automatique */}
            <img
                src={user.avatar || generatedAvatar}
                alt="Profil"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200 shadow-sm bg-white"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = generatedAvatar;
                }}
            />

            <div className="flex flex-col">
                <p className="font-inter font-semibold text-gray-800 text-sm md:text-base capitalize line-clamp-1">
                    {displayName}
                </p>
                <div className="flex flex-col leading-none gap-0.5">
          <span className="font-poppins text-violet-600 text-[10px] md:text-xs font-bold uppercase tracking-wider">
            {user.role || "GUEST"}
          </span>
                    <span className="font-poppins text-gray-400 text-[10px] md:text-xs truncate max-w-[150px]">
            {user.email}
          </span>
                </div>
            </div>
        </button>
    );
}