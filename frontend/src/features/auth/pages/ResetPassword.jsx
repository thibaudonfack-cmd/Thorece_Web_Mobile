import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { IMAGES } from '../../../constants/images';
import { authService } from '../services/auth.service';
import { validatePassword, validatePasswordMatch } from '../utils/validators';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.userEmail;

  const [formData, setFormData] = useState({
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      navigate('/forgot-password');
    }
  }, [userEmail, navigate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const matchError = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
    if (matchError) {
      setError(matchError);
      return;
    }

    const policyError = validatePassword(formData.newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: userEmail,
        otpCode: formData.otpCode,
        newPassword: formData.newPassword
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Code OTP invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendStatus('loading');
    setError('');
    try {
      await authService.forgotPassword({ email: userEmail });
      setResendStatus('success');
    } catch (err) {
      setResendStatus('error');
      setError("Impossible de renvoyer le code.");
    }
  };

  if (success) {
    return (
      <div className="bg-neutral-100 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl text-center space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="font-inter font-bold text-2xl text-blue-500">
              Mot de passe modifié !
            </h2>
            
            <p className="font-poppins text-gray-500">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
            </p>
            
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
              Retour à la connexion
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto shadow-2xl rounded-3xl overflow-hidden my-4 lg:my-8 flex-1">
          
          <div className="w-full lg:max-w-2xl bg-neutral-100 p-6 md:p-12 lg:p-16 animate-slide-in-left overflow-y-auto">
            <AppHeader variant="auth" onLogoClick={() => navigate('/')} />

            <div className="mt-8 lg:mt-12 max-w-[422px]">
              <h2 className="font-inter font-semibold text-2xl md:text-[24px] text-blue-400 mb-4 leading-[1.5]">
                Réinitialisation
              </h2>
              <p className="font-poppins text-[#a6a6a6] text-base md:text-[18px] mb-8">
                Saisissez le code reçu par mail et votre nouveau mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Adresse mail</label>
                   <div className="p-3 bg-gray-200 rounded-lg text-gray-600 font-medium">
                     {userEmail}
                   </div>
                </div>

                <Input 
                  label="Code OTP (6 chiffres)" 
                  type="text" 
                  name="otpCode" 
                  value={formData.otpCode} 
                  onChange={(e) => handleChange('otpCode', e.target.value)} 
                  required 
                  maxLength={6}
                  disabled={loading}
                />

                <Input
                  label="Nouveau mot de passe"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  required
                  showPasswordToggle={true}
                  onIconClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                />

                <Input 
                  label="Confirmer le mot de passe" 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                  required 
                  disabled={loading}
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                  <Button variant="primary" type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Validation...' : 'Valider'}
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => navigate('/login')} className="flex-1" disabled={loading}>
                    Annuler
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={handleResendCode} 
                    disabled={resendStatus === 'loading' || loading} 
                    className="text-sm font-poppins text-blue-400 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {resendStatus === 'loading' ? 'Envoi...' : 'Renvoyer le code'}
                  </button>
                  
                  {resendStatus === 'success' && (
                    <p className="text-green-600 text-xs mt-2 font-medium">Nouveau code envoyé !</p>
                  )}
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