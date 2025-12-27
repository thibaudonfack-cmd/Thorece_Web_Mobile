import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { IMAGES } from '../../../constants/images';

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, userRole } = location.state || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate('/register');
    }
  }, [userEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      navigate('/otp/validate', { 
        state: { 
          userEmail: userEmail, 
          userRole: userRole 
        } 
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
          
          <div className="w-full lg:w-[868px] bg-neutral-100 p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <div className="mt-12 lg:mt-24 max-w-[367px] mx-auto lg:mx-0 lg:ml-24">
              <h2 className="font-poppins font-bold text-2xl md:text-[22px] text-[#323232] mb-4">
                Vérification du code OTP
              </h2>

              <p className="font-poppins text-[#b6b6b6] text-base md:text-[18px] mb-12">
                Un code OTP va être envoyé à l'adresse email suivante
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="font-poppins font-semibold text-sm text-[#323232]">
                    Adresse mail :
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-poppins text-base text-gray-700">
                    {userEmail || 'Chargement...'}
                  </div>
                </div>

                <Button variant="submit" type="submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le code OTP'}
                </Button>
              </form>
            </div>
          </div>

          <div className="hidden lg:flex relative w-[574px] bg-blue-400 items-center justify-center animate-slide-in-right">
            <div className="w-full max-w-[400px] p-8">
              <img
                alt="Vérification de sécurité"
                className="w-full h-auto object-contain animate-float"
                src={IMAGES.otpSecurityShield}
              />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}