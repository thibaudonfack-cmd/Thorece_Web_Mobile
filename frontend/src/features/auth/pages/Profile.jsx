import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Footer from '../../../components/layout/Footer';
import AppHeader from '../../../components/layout/AppHeader';
import LoadingState from '../../../components/ui/LoadingState';
import PasswordInput from '../../../components/ui/PasswordInput';
import Input from '../../../components/ui/Input';
import { CameraIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { profileSchema } from '../utils/schemas';

export default function Profile() {
    const navigate = useNavigate();
    const { user, reloadUser, logout, loading: contextLoading } = useAuth();
    const fileInputRef = useRef(null);

    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nom: '',
            email: '',
            role: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                nom: user.nom || '',
                email: user.email || '',
                role: user.role || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user, reset]);

    const getAvatarSrc = () => {
        if (user?.avatar) return user.avatar;
        const name = user?.nom || 'Invité';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256&bold=true`;
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        if(!file.type.startsWith('image/')) {
            alert('Veuillez uploader une image (JPEG, PNG).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("L'image est trop volumineuse (max 5Mo).");
            return;
        }

        try {
            setIsAvatarUploading(true);
            await authService.uploadAvatar(file);
            await reloadUser();
            setSuccessMessage('Photo de profil mise à jour.');
        } catch {
            setServerError("Erreur lors de l'upload de l'image.");
        } finally {
            setIsAvatarUploading(false);
        }
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const onSubmit = async (data) => {
        setServerError('');
        setSuccessMessage('');

        try {
            const updateData = {
                nom: data.nom,
                email: data.email,
            };

            if (showPasswordSection && data.newPassword) {
                updateData.currentPassword = data.currentPassword;
                updateData.newPassword = data.newPassword;
            }

            await authService.updateProfile(updateData);
            await reloadUser();

            setSuccessMessage("Profil mis à jour avec succès.");

            if (data.newPassword) {
                setShowPasswordSection(false);
                reset({
                    ...data,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }

            setTimeout(() => {
                navigate(-1);
            }, 1500);

        } catch(err) {
            setServerError(err.message || "Erreur lors de la sauvegarde.");
        }
    };

    if (contextLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-bg"><LoadingState /></div>;

    return (
        <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
            <AppHeader onLogoClick={() => navigate('/')} showUserInfo={true} onUserClick={() => {}} />

            <div className="max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-poppins font-bold text-3xl text-blue-500">Mon Profil</h1>
                    <button
                        onClick={handleLogout}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md hover:shadow-lg transition-all hover:scale-110"
                        title="Se déconnecter"
                    >
                        <ArrowRightOnRectangleIcon className="w-8 h-8" />
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium animate-fade-in">
                            {successMessage}
                        </div>
                    )}
                    {serverError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="relative group cursor-pointer w-32 h-32"
                                onClick={() => fileInputRef.current.click()}
                                title="Modifier la photo"
                            >
                                <img
                                    key={user?.avatar || 'default'}
                                    src={getAvatarSrc()}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nom || '')}&background=random&color=fff&size=256&bold=true`;
                                    }}
                                    alt="Avatar"
                                    className={`w-full h-full rounded-full border-4 border-blue-100 object-cover shadow-sm bg-gray-100 ${isAvatarUploading ? 'opacity-50' : ''}`}
                                />
                                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-8 h-8 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                />
                            </div>
                            <p className="text-sm text-gray-400">Cliquez sur l'image pour modifier</p>
                        </div>

                        <div className="grid gap-6">
                            <Input
                                label="Nom complet"
                                error={errors.nom?.message}
                                disabled={isSubmitting}
                                {...register('nom')}
                            />
                            <Input
                                label="Email"
                                type="email"
                                error={errors.email?.message}
                                disabled={isSubmitting}
                                {...register('email')}
                            />
                            <Input
                                label="Rôle"
                                disabled
                                {...register('role')}
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="text-blue-500 font-bold hover:text-blue-600 transition-colors mb-6 flex items-center gap-2"
                            >
                                {showPasswordSection ? '− Annuler le changement de mot de passe' : '+ Changer mon mot de passe'}
                            </button>

                            {showPasswordSection && (
                                <div className="grid gap-6 animate-fade-in-down bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                        <p className="text-sm text-yellow-700">
                                            Le mot de passe actuel est requis <strong>uniquement</strong> pour valider un nouveau mot de passe.
                                        </p>
                                    </div>

                                    <PasswordInput
                                        label="Nouveau mot de passe"
                                        error={errors.newPassword?.message}
                                        placeholder="8 caractères min."
                                        disabled={isSubmitting}
                                        {...register('newPassword')}
                                    />
                                    <PasswordInput
                                        label="Confirmer nouveau mot de passe"
                                        error={errors.confirmPassword?.message}
                                        placeholder="••••••••"
                                        disabled={isSubmitting}
                                        {...register('confirmPassword')}
                                    />
                                    <hr className="border-slate-200 my-2" />
                                    <PasswordInput
                                        label="Mot de passe actuel (Validation)"
                                        error={errors.currentPassword?.message}
                                        placeholder="Requis si nouveau mot de passe saisi"
                                        disabled={isSubmitting}
                                        {...register('currentPassword')}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-3 rounded-xl border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}