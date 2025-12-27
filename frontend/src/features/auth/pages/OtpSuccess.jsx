import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { IMAGES } from '../../../constants/images';
import { useAuth } from '../context/AuthContext';

export default function OtpSuccess() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Redirection automatique de sécurité si on arrive ici sans être connecté
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleContinue = () => {
        if (!user) return;

        // Sécurisation : On met tout en majuscule pour éviter les bugs de casse (Auteur vs AUTEUR)
        const role = user.role ? user.role.toUpperCase() : '';

        switch (role) {
            case 'AUTEUR':
                navigate('/author');
                break;
            case 'ENFANT':
                navigate('/child/library');
                break;
            case 'EDITEUR':
                if (user.isVerified) {
                    navigate('/editor');
                }else {
                    navigate('/editor/validation');
                }
                break;
            case 'ADMIN':
                navigate('/admin');
                break;
            default:
                console.warn("Rôle inconnu ou manquant :", role);
                navigate('/'); // Redirection par défaut (Accueil public)
                break;
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">

                    <div className="w-full lg:w-[861px] bg-neutral-100 p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto flex items-center justify-center">
                        <div className="max-w-[367px] flex flex-col items-center gap-12">
                            <div className="w-[106px] h-[106px]">
                                <img
                                    src={IMAGES.successCheckmark}
                                    alt="Succès"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h2 className="font-inter font-bold text-2xl md:text-[22px] text-[#323232] text-center">
                                Succès !
                            </h2>

                            <p className="font-poppins text-[#b6b6b6] text-base md:text-[18px] text-center">
                                Félicitations, vous êtes authentifié en tant que <span className="text-blue-500 font-bold">{user?.role}</span>.
                            </p>

                            <Button
                                variant="submit"
                                onClick={handleContinue}
                                className="w-full"
                                disabled={loading || !user}
                            >
                                {loading ? 'Chargement...' : 'Continuer'}
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:flex relative w-[579px] bg-blue-400 items-center justify-center animate-slide-in-right">
                        <div className="w-full max-w-[550px] p-8">
                            <img
                                alt="Super-héros fille"
                                className="w-full h-auto object-contain animate-float"
                                src={IMAGES.heroGirlSticker}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}