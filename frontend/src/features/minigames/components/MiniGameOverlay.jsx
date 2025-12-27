import React from 'react';
import DigicodeGame from './DigicodeGame';
import DragDropGame from './DragDropGame';
import { authService } from '../../auth/services/auth.service';

const GAMES = {
    'cadenas_mystique': {
        component: DigicodeGame,
        xp: 50,
        successScene: 'scene_success_cadenas',
        failScene: 'scene_fail_cadenas'
    },
    'grimoire_perdu': {
        component: DragDropGame,
        xp: 30,
        successScene: 'scene_success_grimoire',
        failScene: 'scene_fail_grimoire'
    },
    // Aliases for testing or id-based mapping
    '1': {
        component: DigicodeGame,
        xp: 10,
        successScene: 'success',
        failScene: 'fail'
    },
    '2': {
        component: DragDropGame,
        xp: 15,
        successScene: 'success',
        failScene: 'fail'
    }
};

export default function MiniGameOverlay({ id, onComplete }) {
    const gameConfig = GAMES[id];

    const handleWin = async () => {
        try {
            await authService.updateUserXp(gameConfig.xp);
            console.log(`XP Added: ${gameConfig.xp}`);
        } catch (e) {
            console.error("Failed to add XP", e);
        }
        onComplete(true, gameConfig.successScene);
    };

    const handleLose = () => {
        onComplete(false, gameConfig.failScene);
    };

    if (!gameConfig) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white">
                <div className="bg-red-900/50 p-4 rounded border border-red-500">
                    <p>Erreur: Jeu inconnu ({id})</p>
                    <button onClick={() => onComplete(false, 'error')} className="mt-2 text-sm underline">Fermer</button>
                </div>
            </div>
        );
    }

    const GameComponent = gameConfig.component;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="w-full max-w-4xl p-4">
                 <GameComponent onWin={handleWin} onLose={handleLose} />
             </div>
        </div>
    );
}
