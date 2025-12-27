import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { IMAGES } from '../../../constants/images';
import { authService } from '../services/auth.service';
import { loginSchema } from '../utils/schemas';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const userData = await authService.login({ 
        email: data.email, 
        password: data.password 
      });
      
      navigate('/otp/validate', {
        state: {
          userEmail: userData.email,
          userRole: userData.role,
          rememberMe: data.rememberMe
        }
      });

    } catch (err) {
      setServerError(err.message || 'Identifiants incorrects');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
          
          <div className="w-full lg:max-w-2xl bg-brand-bg p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <div className="mt-8 lg:mt-12 max-w-[422px]">
              <h2 className="font-inter font-semibold text-2xl md:text-[24px] text-blue-400 mb-4 leading-[1.5]">
                Les livres dont vous êtes les héros
              </h2>

              <p className="font-poppins text-[#a6a6a6] text-base md:text-[18px] mb-8">
                De retour, entrez vos identifiants de connexion
              </p>

              {serverError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Adresse mail"
                  type="email"
                  placeholder="exemple@email.com"
                  disabled={isSubmitting}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  showPasswordToggle={true}
                  onIconClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-inter text-base text-black">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-400 cursor-pointer"
                      disabled={isSubmitting}
                      {...register('rememberMe')}
                    />
                    <span>Rester connecté</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="underline hover:text-blue-400 transition-colors"
                    disabled={isSubmitting}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Connexion...' : 'Connexion'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate('/register')}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Inscription
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