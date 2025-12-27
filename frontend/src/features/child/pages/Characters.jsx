import { useState } from 'react';
import Avatar from 'react-nice-avatar';
import Footer from '../../../components/layout/Footer';
import AppHeader from '../../../components/layout/AppHeader';
import LoadingState from '../../../components/ui/LoadingState';
import { useCharacters } from '../hooks/useChildData';

export default function PageTousPersonnages({ onNavigate }) {
  const { data: characters = [], isLoading } = useCharacters();

  const handleAddCharacter = () => {
    // Naviguer vers l'éditeur pour créer un nouveau personnage
    onNavigate('editeur-personnage');
  };

  const handleCharacterClick = (characterId) => {
    // Naviguer vers l'éditeur pour modifier le personnage
    onNavigate('editeur-personnage', { characterId });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <AppHeader
        onLogoClick={() => onNavigate('accueil')}
        showUserInfo={true}
        onUserClick={() => onNavigate('profil')}
        rightContent={
          <button
            onClick={() => onNavigate('editeur-accueil')}
            className="border border-blue-400 border-solid px-6 py-4 rounded-lg font-inter font-semibold text-base text-black hover:bg-blue-50 transition-colors"
          >
            Mes livres
          </button>
        }
      />

      {/* Titre principal */}
      <div className="px-6 md:px-8 py-12 text-center">
        <h2 className="font-poppins font-black text-4xl md:text-[48px] text-blue-400 leading-[1.5]">
          Mes personnages
        </h2>
      </div>

      {/* Grille de personnages */}
      <div className="flex-1 px-6 md:px-[220px] py-8">
        <div className="flex flex-wrap justify-center gap-12 md:gap-[50px] max-w-[1000px] mx-auto">
          {characters.map((character) => (
            <div
              key={character.id}
              className="flex flex-col items-center gap-6 cursor-pointer group"
              onClick={() => handleCharacterClick(character.id)}
            >
              {/* Avatar */}
              <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px]">
                <Avatar
                  style={{ width: '100%', height: '100%' }}
                  shape="circle"
                  {...character.avatarConfig}
                />
              </div>

              {/* Nom et rôle */}
              <div className="text-center">
                <p className="font-poppins font-black text-[28px] md:text-[32px] text-black leading-[1.5] mb-1">
                  {character.name}
                </p>
                <p className="font-poppins font-black text-[28px] md:text-[32px] text-blue-400 leading-[1.5]">
                  {character.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton ajouter un personnage */}
      <div className="px-6 py-12 flex justify-center">
        <button
          onClick={handleAddCharacter}
          className="bg-blue-400 text-white font-inter font-semibold text-xl px-8 py-4 rounded-lg hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl"
        >
          + Ajouter un personnage
        </button>
      </div>

      <Footer />
    </div>
  );
}
