import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../../../constants/images';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            {/* UTILISATION DE LA VARIANTE AUTH POUR AVOIR LE LOGO CENTRÉ */}
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-8 md:py-12 gap-8">
                <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 animate-slide-in-left">
                    <h2 className="font-poppins font-bold text-3xl md:text-5xl lg:text-[48px] leading-tight text-black">
                        Bienvenue sur Cipe Studio !
                    </h2>

                    <p className="font-poppins font-medium text-lg md:text-2xl text-black">
                        Découvre des livres interactifs et amusants !
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="primary" onClick={() => navigate('/login')}>
                            Connecte toi
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/register')}>
                            S'inscrire gratuitement
                        </Button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center animate-slide-in-right">
                    <div className="relative w-full max-w-md lg:max-w-lg">
                        <img
                            alt="Enfant lisant un livre"
                            className="w-full h-auto object-contain animate-float"
                            src={IMAGES.childrenIllustration}
                        />
                    </div>
                </div>
            </main>

            <section className="px-6 md:px-16 py-8 md:py-12 animate-fade-in-up">
                <h3 className="font-poppins font-bold text-2xl md:text-4xl text-center text-black mb-8">
                    Lire devient un jeu d'enfant !
                </h3>
                <div className="flex justify-center">
                    <img
                        alt="Caractéristiques"
                        className="w-full max-w-3xl h-auto object-contain"
                        src={IMAGES.dadaIllustration}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}