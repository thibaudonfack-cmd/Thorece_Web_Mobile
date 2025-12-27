import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from "../../../components/layout/AppHeader";
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { IMAGES } from '../../../constants/images';
import { authService } from '../services/auth.service';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    try {
      await authService.forgotPassword({ email }); 
      navigate('/reset-password', { 
        state: { userEmail: email } 
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
          
          <div className="w-full lg:max-w-2xl bg-neutral-100 p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <div className="mt-8 lg:mt-12 max-w-[422px]">
              <h2 className="font-inter font-semibold text-2xl md:text-[24px] text-blue-400 mb-4 leading-[1.5]">
                Mot de passe oublié ?
              </h2>

              <p className="font-poppins text-[#a6a6a6] text-base md:text-[18px] mb-8">
                Entrez votre adresse email et nous vous enverrons un code pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Adresse mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  required
                  disabled={loading}
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Envoi...' : 'Envoyer le code'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex-1"
                    disabled={loading}
                  >
                    Retour
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden lg:flex relative w-[742px] bg-blue-400 items-center justify-center animate-slide-in-right">
            <div className="w-full max-w-[581px] p-8">
              <img
                alt="Super-héros"
                className="w-full h-auto object-contain animate-float"
                src={IMAGES.heroSuperman}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}