import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const ROLE_HOME_PAGES = {
    ENFANT: '/child/library',
    AUTEUR: '/author',
    EDITEUR: '/editor',
    ADMIN: '/admin',
};

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="font-poppins text-lg text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    const isPendingEditor = user.role === 'EDITEUR' && !user.isVerified;
    const isAtWaitingRoom = location.pathname === '/editor/validation';

    if (isPendingEditor && !isAtWaitingRoom) {
        return <Navigate to="/editor/validation" replace />;
    }
    if (!isPendingEditor && isAtWaitingRoom) {
        return <Navigate to="/editor" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const userHomePage = ROLE_HOME_PAGES[user.role] || '/';
        return <Navigate to={userHomePage} replace />;
    }

    return children || <Outlet />;
}