import { useState, useEffect } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import Footer from '../../../components/layout/Footer';
import AppHeader from '../../../components/layout/AppHeader';



// Options pour la personnalisation de l'avatar
const AVATAR_OPTIONS = {
  sex: ['man', 'woman'],
  faceColor: ['#F9C9B6', '#A16854', '#EDB98A', '#FEE5C7'],
  earSize: ['small', 'big'],
  hairColor: ['#000', '#4A312C', '#D2B48C', '#F59797', '#5C4033', '#E55B13'],
  hairStyle: {
    man: ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'],
    woman: ['womanLong', 'womanShort', 'normal', 'thick']
  },
  hatStyle: ['none', 'beanie', 'turban'],
  hatColor: ['#5a67d8', '#000', '#D2691E', '#FF6347'],
  eyeStyle: ['circle', 'oval', 'smile'],
  glassesStyle: ['none', 'round', 'square'],
  noseStyle: ['short', 'long', 'round'],
  mouthStyle: ['laugh', 'smile', 'peace'],
  shirtStyle: ['hoody', 'short', 'polo'],
  shirtColor: ['#F5D061', '#c0b6f2', '#77311D', '#6BD9E9', '#FC909F'],
  bgColor: [
    'linear-gradient(45deg, #5a67d8 0%, #9333ea 100%)',
    'linear-gradient(45deg, #7c3aed 0%, #ec4899 100%)',
    'linear-gradient(45deg, #f97316 0%, #facc15 100%)',
    'linear-gradient(45deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(45deg, #10b981 0%, #84cc16 100%)'
  ],
  eyeBrowStyle: ['up', 'upWoman']
};

export default function PageEditeurPersonnage({ onNavigate, characterId }) {
  // State pour le personnage
  const [character, setCharacter] = useState({
    id: characterId || null,
    name: '',
    role: '',
    avatarConfig: genConfig() // Génère une config aléatoire par défaut
  });

  const [isNewCharacter, setIsNewCharacter] = useState(!characterId);

  // Charger le personnage existant si characterId est fourni
  useEffect(() => {
    if (characterId) {
      // TODO: Remplacer par un appel API
      // fetch(`/api/characters/${characterId}`)
      //   .then(res => res.json())
      //   .then(data => setCharacter(data))

      // Pour l'instant, on simule avec des données locales
      // Vous pourrez facilement remplacer ceci par un appel API
      console.log('Loading character:', characterId);
      setIsNewCharacter(false);
    } else {
      // Nouveau personnage - générer un avatar aléatoire
      setCharacter({
        id: null,
        name: '',
        role: '',
        avatarConfig: genConfig()
      });
      setIsNewCharacter(true);
    }
  }, [characterId]);

  // Mettre à jour une propriété de l'avatar
  const updateAvatarConfig = (property, value) => {
    setCharacter(prev => ({
      ...prev,
      avatarConfig: {
        ...prev.avatarConfig,
        [property]: value
      }
    }));
  };

  // Sauvegarder le personnage
  const handleSave = () => {
    // TODO: Remplacer par un appel API
    // if (isNewCharacter) {
    //   fetch('/api/characters', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(character)
    //   })
    // } else {
    //   fetch(`/api/characters/${character.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(character)
    //   })
    // }

    console.log('Saving character:', character);
    // Retourner à la liste des personnages
    onNavigate('tous-personnages');
  };

  // Supprimer le personnage
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      // TODO: Remplacer par un appel API
      // fetch(`/api/characters/${character.id}`, { method: 'DELETE' })

      console.log('Deleting character:', character.id);
      onNavigate('tous-personnages');
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <AppHeader
        onLogoClick={() => onNavigate('accueil')}
        showUserInfo={true}
        onUserClick={() => onNavigate('profil')}
        rightContent={
          <div className="flex gap-6">
            <button
              onClick={() => onNavigate('editeur-accueil')}
              className="border border-blue-400 border-solid px-6 py-4 rounded-lg font-inter font-semibold text-base text-black hover:bg-blue-50 transition-colors"
            >
              Mes livres
            </button>
            <button
              onClick={() => onNavigate('tous-personnages')}
              className="bg-blue-400 text-white px-6 py-4 rounded-lg font-inter font-semibold text-base hover:bg-blue-500 transition-colors"
            >
              Mes personnages
            </button>
          </div>
        }
      />

      {/* Contenu principal */}
      <div className="flex-1 px-6 md:px-[100px] py-8">
        {/* Titre avec nom du personnage */}
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-3xl md:text-[40px] text-blue-400 leading-[1.5] mb-6">
            {isNewCharacter ? 'Nouveau personnage' : `Nom du personnage : `}
            {!isNewCharacter && (
              <span className="font-poppins font-black">{character.name || 'Sans nom'}</span>
            )}
          </h2>

          {/* Champs de saisie pour nom et rôle */}
          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <input
              type="text"
              placeholder="Nom du personnage"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-6 py-3 rounded-lg border border-gray-300 text-black placeholder:text-gray-400 text-xl font-inter focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Rôle du personnage (ex: Le Pilote)"
              value={character.role}
              onChange={(e) => setCharacter(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-6 py-3 rounded-lg border border-gray-300 text-black placeholder:text-gray-400 text-xl font-inter focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-12">
          <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px]">
            <Avatar
              style={{ width: '100%', height: '100%' }}
              shape="circle"
              {...character.avatarConfig}
            />
          </div>
        </div>

        {/* Options de personnalisation */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="font-poppins font-bold text-2xl text-black mb-6">
            Personnaliser l'avatar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sexe */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Sexe
              </label>
              <select
                value={character.avatarConfig.sex}
                onChange={(e) => updateAvatarConfig('sex', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {AVATAR_OPTIONS.sex.map(option => (
                  <option key={option} value={option}>
                    {option === 'man' ? 'Homme' : 'Femme'}
                  </option>
                ))}
              </select>
            </div>

            {/* Couleur de peau */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Couleur de peau
              </label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.faceColor.map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatarConfig('faceColor', color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      character.avatarConfig.faceColor === color
                        ? 'border-blue-400 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Style de cheveux */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Style de cheveux
              </label>
              <select
                value={character.avatarConfig.hairStyle}
                onChange={(e) => updateAvatarConfig('hairStyle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {AVATAR_OPTIONS.hairStyle[character.avatarConfig.sex].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Couleur de cheveux */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Couleur de cheveux
              </label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.hairColor.map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatarConfig('hairColor', color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      character.avatarConfig.hairColor === color
                        ? 'border-blue-400 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Style de chapeau */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Chapeau
              </label>
              <select
                value={character.avatarConfig.hatStyle}
                onChange={(e) => updateAvatarConfig('hatStyle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {AVATAR_OPTIONS.hatStyle.map(option => (
                  <option key={option} value={option}>
                    {option === 'none' ? 'Aucun' : option}
                  </option>
                ))}
              </select>
            </div>

            {/* Lunettes */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Lunettes
              </label>
              <select
                value={character.avatarConfig.glassesStyle}
                onChange={(e) => updateAvatarConfig('glassesStyle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {AVATAR_OPTIONS.glassesStyle.map(option => (
                  <option key={option} value={option}>
                    {option === 'none' ? 'Aucune' : option}
                  </option>
                ))}
              </select>
            </div>

            {/* Style de bouche */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Expression
              </label>
              <select
                value={character.avatarConfig.mouthStyle}
                onChange={(e) => updateAvatarConfig('mouthStyle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {AVATAR_OPTIONS.mouthStyle.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Couleur de chemise */}
            <div>
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Couleur de chemise
              </label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.shirtColor.map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatarConfig('shirtColor', color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      character.avatarConfig.shirtColor === color
                        ? 'border-blue-400 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Couleur de fond */}
            <div className="md:col-span-2">
              <label className="block font-inter font-semibold text-sm text-gray-700 mb-2">
                Couleur de fond
              </label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.bgColor.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => updateAvatarConfig('bgColor', gradient)}
                    className={`w-12 h-12 rounded-lg border-2 ${
                      character.avatarConfig.bgColor === gradient
                        ? 'border-blue-400 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bouton pour générer un avatar aléatoire */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setCharacter(prev => ({ ...prev, avatarConfig: genConfig() }))}
              className="bg-gray-200 text-black px-6 py-3 rounded-lg font-inter font-semibold hover:bg-gray-300 transition-colors"
            >
              🎲 Générer un avatar aléatoire
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleSave}
            className="bg-blue-400 text-white px-8 py-4 rounded-lg font-inter font-semibold text-lg hover:bg-blue-500 transition-colors shadow-lg"
          >
            {isNewCharacter ? 'Créer le personnage' : 'Sauvegarder les modifications'}
          </button>

          {!isNewCharacter && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-8 py-4 rounded-lg font-inter font-semibold text-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              Supprimer
            </button>
          )}

          <button
            onClick={() => onNavigate('tous-personnages')}
            className="bg-gray-300 text-black px-8 py-4 rounded-lg font-inter font-semibold text-lg hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
