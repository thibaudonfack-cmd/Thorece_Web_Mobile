import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { IMAGES } from '../../../constants/images';

export default function PendingValidation() {
    const navigate = useNavigate();
    const { reloadUser } = useAuth(); // Utilisation de ta fonction du contexte
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCheckStatus = async () => {
        setLoading(true);
        setMessage('');

        try {
            const updatedUser = await reloadUser();

            if (updatedUser && updatedUser.isVerified) {
                navigate('/editor');
            } else {
                setMessage("Votre compte est toujours en attente de validation.");
            }

        } catch (error) {
            console.error("Erreur vérification", error);
            setMessage("Impossible de vérifier le statut pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
                    
                    {/* Colonne Gauche : Info & Actions */}
                    <div className="w-full lg:w-[861px] bg-neutral-100 p-6 md:p-12 lg:p-16 flex items-center justify-center animate-slide-in-left">
                        <div className="max-w-[367px] flex flex-col items-center gap-7">
                            
                            <div className="w-32 h-32 md:w-[147px] md:h-[139px]">
                                <img src={IMAGES.hourglassWaiting} alt="En attente" className="w-full h-full object-contain" />
                            </div>

                            <h2 className="font-inter font-bold text-xl md:text-2xl text-black text-center">
                                En attente de validation
                            </h2>

                            <div className="font-poppins text-base md:text-[18px] text-black text-center space-y-4">
                                <p>Votre compte éditeur est en cours de validation par l'administrateur.</p>
                                <p className="text-sm text-gray-500">Cliquez ci-dessous une fois l'email de confirmation reçu.</p>
                            </div>

                            <div className="w-full pt-4 space-y-4">
                                <Button
                                    variant="submit"
                                    onClick={handleCheckStatus}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? 'Vérification...' : 'Vérifier mon statut'}
                                </Button>

                                {message && (
                                    <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
                                        <p className="text-sm font-poppins font-medium text-orange-600">{message}</p>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 underline"
                                >
                                    Retour à la connexion
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite : Image décorative */}
                    <div className="hidden lg:flex relative w-[579px] bg-blue-400 items-center justify-center animate-slide-in-right">
                        <div className="w-full max-w-[317px] p-8">
                            <img src={IMAGES.childReadingBook} alt="Illustration" className="w-full h-auto object-contain animate-float" />
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}