import React, { useState, useEffect } from 'react';
import DigicodeGame from './DigicodeGame';
import DragDropGame from './DragDropGame';
import { authService } from '../../auth/services/auth.service';
import { minigameService } from '../services/minigame.service';

const GAMES_MAPPING = {
    'DIGITAL_LOCK': DigicodeGame,
    'FILL_BLANKS': DragDropGame
};

export default function MiniGameOverlay({ id, onComplete }) {
    const [gameData, setGameData] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGame = async () => {
            try {
                setLoading(true);
                // id passed from Tuesday is the MiniGame ID (database ID)
                const data = await minigameService.getById(id);
                
                let parsedConfig = {};
                try {
                    parsedConfig = typeof data.contentJson === 'string' 
                        ? JSON.parse(data.contentJson) 
                        : data.contentJson;
                } catch (e) {
                    console.error("Failed to parse game config", e);
                    throw new Error("Configuration invalide.");
                }
                
                setGameData(data);
                setConfig(parsedConfig);
            } catch (err) {
                console.error("Erreur chargement jeu:", err);
                setError("Impossible de charger l'épreuve.");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadGame();
    }, [id]);

    const handleWin = async () => {
        try {
            if (gameData?.xpReward) {
                await authService.updateUserXp(gameData.xpReward);
                console.log(`XP Added: ${gameData.xpReward}`);
            }
        } catch (e) {
            console.error("Failed to add XP", e);
        }
        // Redirect to success scene stored in Tuesday variables, usually handled by wrapper logic
        // But here we return success=true
        onComplete(true);
    };

    const handleLose = () => {
        onComplete(false);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white backdrop-blur-sm">
                <div className="animate-pulse">Chargement de l'épreuve...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white backdrop-blur-sm">
                <div className="bg-red-900/50 p-6 rounded border border-red-500 text-center">
                    <p className="mb-4">{error}</p>
                    <button 
                        onClick={() => onComplete(false)} 
                        className="px-4 py-2 bg-white text-red-900 font-bold rounded hover:bg-gray-200"
                    >
                        Passer l'épreuve
                    </button>
                </div>
            </div>
        );
    }

    if (!gameData || !config) return null;

    const GameComponent = GAMES_MAPPING[gameData.type];

    if (!GameComponent) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
                Type de jeu non supporté : {gameData.type}
                <button onClick={() => onComplete(false)} className="ml-4 underline">Fermer</button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="w-full max-w-4xl p-4">
                 {/* We pass gameId so components can re-fetch if needed, but we also pass loaded config directly */}
                 <GameComponent 
                    gameId={id}
                    onWin={handleWin} 
                    onLose={handleLose} 
                 />
             </div>
        </div>
    );
}
