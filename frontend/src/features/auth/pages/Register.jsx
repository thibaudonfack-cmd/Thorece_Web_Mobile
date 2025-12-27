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
import { registerSchema } from '../utils/schemas';
import LegalNoticeModal from '../../../components/ui/LegalNoticeModal';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: undefined
    }
  });

  const selectedRole = watch('role');

  const roles = [
    { id: 'editeur', label: 'Editeur', value: 'EDITEUR', image: IMAGES.roleEditor },
    { id: 'enfant', label: 'Enfant', value: 'ENFANT', image: IMAGES.roleChild },
    { id: 'auteur', label: 'Auteur', value: 'AUTEUR', image: IMAGES.roleAuthor }
  ];

  const onSubmit = async (data) => {
    setServerError('');
    
    try {
      await authService.register({
        nom: data.nom,
        email: data.email,
        password: data.password,
        role: data.role
      });
      
      navigate('/otp/validate', {
        state: {
          userEmail: data.email,
          userRole: data.role
        }
      });

    } catch (err) {
      console.error(err);
      setServerError(err.message || "Une erreur inconnue est survenue.");
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
          
          <div className="w-full lg:max-w-2xl bg-brand-bg p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <h2 className="font-poppins font-semibold text-xl md:text-2xl text-black mb-6 mt-8">
              Choisissez votre rôle :
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-4 md:gap-8 lg:gap-20 mb-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setValue('role', role.value, { shouldValidate: true })}
                      type="button"
                      className={`relative group rounded-xl w-20 h-20 md:w-[100px] md:h-[100px] transition-all duration-300 hover:scale-110 ${
                        selectedRole === role.value
                          ? 'border-4 border-blue-400 shadow-lg'
                          : 'border-2 border-transparent hover:border-blue-400'
                      }`}
                      aria-label={`Sélectionner le rôle de ${role.label.toLowerCase()}`}
                      disabled={isSubmitting}
                    >
                      <img
                        alt={role.label}
                        className="w-full h-full object-cover rounded-xl"
                        src={role.image}
                      />

                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm font-poppins rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                        {role.label}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-red-500 text-sm font-medium">{errors.role.message}</p>}
              </div>

              <Input
                label="Nom complet :"
                type="text"
                placeholder="Robert Langster"
                disabled={isSubmitting}
                error={errors.nom?.message}
                {...register('nom')}
              />

              <Input
                label="Adresse mail :"
                type="email"
                placeholder="exemple@email.com"
                disabled={isSubmitting}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Mot de passe :"
                type={showPassword ? "text" : "password"}
                showPasswordToggle={true}
                onIconClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirmer le mot de passe :"
                type={showConfirmPassword ? "text" : "password"}
                showPasswordToggle={true}
                onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="consentement"
                    required
                    {...register('consentement')}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="consentement" className="text-xs text-slate-600 leading-tight cursor-pointer">
                    En cochant cette case, je certifie avoir atteint l'âge de 13 ans (majorité numérique en Belgique) 
                    ou, à défaut, utiliser cette plateforme sous la supervision directe et avec le consentement de mes parents. 
                    J'ai pris connaissance des{' '}
                    <button
                      type="button"
                      onClick={() => setIsLegalModalOpen(true)}
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      risques et responsabilités associés.
                    </button>
                  </label>
                </div>
                {errors.consentement && (
                  <p className="text-red-500 text-xs font-medium ml-1">
                    {errors.consentement.message}
                  </p>
                )}
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold">
                  Erreur: {serverError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-poppins text-sm md:text-base text-black">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="underline hover:text-blue-400 transition-colors"
                  disabled={isSubmitting}
                >
                  Déjà inscrit ? Connectez vous
                </button>
              </div>

              <Button variant="submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Inscription en cours...' : 'Inscription'}
              </Button>
            </form>
          </div>

          <div className="hidden lg:flex relative w-[732px] bg-blue-400 items-center justify-center animate-slide-in-right">
            <div className="w-full max-w-[597px] p-8">
              <img
                alt="Super-héros fille"
                className="w-full h-auto object-contain animate-float"
                src={IMAGES.heroGirlStickerAlt1}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <LegalNoticeModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
      />
    </div>
  );
}