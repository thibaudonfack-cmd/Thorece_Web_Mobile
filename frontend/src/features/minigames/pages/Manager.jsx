import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../components/layout/AppHeader';
import Footer from '../../../components/layout/Footer';
import FlipResourceCard from '../../../components/ui/FlipResourceCard'; // Utilisation de ta carte standardisée
import { MINI_GAMES_IMAGES } from '../../../constants/images';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  PuzzlePieceIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

// MOCK DATA (À remplacer par API)
const MOCK_GAMES = [
  { id: 1, name: "Le Code Secret", type: "digital-lock", difficulty: "easy", description: "Trouve le code à 3 chiffres." },
  { id: 2, name: "Labyrinthe Perdu", type: "maze", difficulty: "medium", description: "Sors du labyrinthe avant la nuit." },
];

const DifficultyBadge = ({ level }) => {
  const colors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${colors[level] || colors.easy}`}>
      {level}
    </span>
  );
};

export default function MiniGamesManager() {
  const navigate = useNavigate();
  const [games, setGames] = useState(MOCK_GAMES);

  const handleDelete = (id) => {
    if(window.confirm("Supprimer ce mini-jeu ?")) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  const handleEdit = (id) => {
    // Redirection vers une page d'édition ou ouverture modale
    navigate(`/author/minigames/edit/${id}`);
  };

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col font-inter">
      <AppHeader
        showUserInfo={true}
        onLogoClick={() => navigate('/')}
        onUserClick={() => navigate('/profile')}
        showDashboardButton={true}
        onDashboardClick={() => navigate('/author')}
      />

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-slate-800">Mes Mini-Jeux</h1>
            <p className="text-slate-500 mt-1 text-sm">Gérez votre bibliothèque d'épreuves interactives.</p>
          </div>
          
          <button
            onClick={() => navigate('/author/minigames/create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95"
          >
            <PlusIcon className="w-5 h-5 stroke-[3]" />
            <span>Nouveau Jeu</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <PuzzlePieceIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun mini-jeu</h3>
            <p className="text-slate-500 mb-6">Commencez par créer votre première épreuve.</p>
            <button onClick={() => navigate('/author/minigames/create')} className="text-blue-500 font-bold hover:underline">Créer maintenant</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {games.map((game) => (
              <FlipResourceCard
                key={game.id}
                resource={{
                  title: game.name,
                  description: game.description,
                  cover: MINI_GAMES_IMAGES[game.type]
                }}
                
                statsComponent={
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <DifficultyBadge level={game.difficulty} />
                    <span className="text-xs text-slate-400 font-mono uppercase">{game.type}</span>
                  </div>
                }

                actionsFront={
                  <div className="w-full flex justify-center">
                    <button className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                       <PlayCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                }

                actionsBack={
                  <div className="w-full flex justify-center items-center px-4">
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleDelete(game.id); }}
                       className="p-2 rounded-full border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                     >
                       <TrashIcon className="w-5 h-5" />
                     </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}