import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import { MINI_GAME_TYPES, MINI_GAMES_IMAGES, DIFFICULTY_LEVELS } from '../../../constants/images';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FormField = ({ label, error, required, children, subtitle }) => (
  <div className="mb-6">
    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {subtitle && <p className="mt-1 text-xs text-slate-400 italic">{subtitle}</p>}
    {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const GameTypeSelector = ({ selectedType, onChange }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {MINI_GAME_TYPES.map((type) => {
      const isSelected = selectedType === type.id;
      return (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          className={`
            relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 group
            ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-blue-200'}
          `}
        >
          {isSelected && (
            <div className="absolute top-2 right-2 text-blue-500">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
          )}
          <img
            src={MINI_GAMES_IMAGES[type.id]}
            alt={type.label}
            className="w-14 h-14 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className={`text-xs font-bold text-center ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
            {type.label}
          </span>
        </button>
      );
    })}
  </div>
);

const DifficultySelector = ({ selectedDifficulty, onChange }) => (
  <div className="flex gap-3">
    {DIFFICULTY_LEVELS.map((level) => (
      <button
        key={level.id}
        type="button"
        onClick={() => onChange(level.id)}
        className={`
          flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all
          ${selectedDifficulty === level.id
            ? 'border-blue-500 bg-blue-500 text-white shadow-md'
            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'}
        `}
      >
        {level.label}
      </button>
    ))}
  </div>
);


export default function MiniGameCreator() {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameType: 'digital-lock',
    difficulty: 'easy',
    introductionText: '',
    successPage: '',
    failPage: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Nettoyer l'erreur à la saisie
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.introductionText.trim()) newErrors.introductionText = "L'introduction est requise";
    if (!formData.successPage) newErrors.successPage = 'Page requise';
    if (!formData.failPage) newErrors.failPage = 'Page requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newMiniGame = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    console.log("Saving MiniGame:", newMiniGame);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/author/minigames');
    }, 800);
  };

  const currentTypeInfo = MINI_GAME_TYPES.find(t => t.id === formData.gameType);

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
      <AppHeader
        showUserInfo={true}
        onLogoClick={() => navigate('/')}
        onUserClick={() => navigate('/profile')}
      />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          
          {/* En-tête de page */}
          <button 
            onClick={() => navigate('/author/minigames')} 
            className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Retour aux jeux
          </button>

          <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-2">
            Nouveau Mini-Jeu
          </h1>
          <p className="text-slate-500 mb-8">
            Configurez une épreuve interactive à intégrer dans vos histoires.
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            
            {/* SECTION 1 : TYPE DE JEU */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 uppercase mb-3">Type d'épreuve</label>
              <GameTypeSelector 
                selectedType={formData.gameType} 
                onChange={(val) => handleSelectChange('gameType', val)} 
              />
              {currentTypeInfo && (
                <div className="mt-3 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 flex gap-2">
                  <span className="font-bold">ℹ️ Info :</span>
                  {currentTypeInfo.description}
                </div>
              )}
            </div>

            <div className="w-full h-px bg-slate-100 my-8"></div>

            {/* SECTION 2 : INFORMATIONS GÉNÉRALES */}
            <div className="grid grid-cols-1 gap-6">
              <FormField label="Nom de l'épreuve" required error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Le Cadenas du Coffre"
                  className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                />
              </FormField>

              <FormField label="Description (Interne)" required error={errors.description} subtitle="Visible uniquement par vous pour identifier le jeu.">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez l'objectif..."
                  rows="2"
                  className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white resize-none transition-all"
                />
              </FormField>

              <FormField label="Texte d'introduction (Pour le joueur)" required error={errors.introductionText}>
                <textarea
                  name="introductionText"
                  value={formData.introductionText}
                  onChange={handleChange}
                  placeholder="Ce texte s'affichera avant que le jeu commence..."
                  rows="3"
                  className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white resize-none transition-all"
                />
              </FormField>
            </div>

            <div className="w-full h-px bg-slate-100 my-8"></div>

            {/* SECTION 3 : CONFIGURATION */}
            <div className="space-y-6">
              <FormField label="Difficulté">
                <DifficultySelector 
                  selectedDifficulty={formData.difficulty} 
                  onChange={(val) => handleSelectChange('difficulty', val)} 
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Page Succès (ID)" required error={errors.successPage}>
                  <input
                    type="number"
                    name="successPage"
                    value={formData.successPage}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                  />
                </FormField>
                <FormField label="Page Échec (ID)" required error={errors.failPage}>
                  <input
                    type="number"
                    name="failPage"
                    value={formData.failPage}
                    onChange={handleChange}
                    className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                  />
                </FormField>
              </div>

              <FormField label="Notes additionnelles">
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Notes personnelles..."
                  rows="2"
                  className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 resize-none"
                />
              </FormField>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/author/minigames')}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'Création...' : 'Créer le jeu'}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}