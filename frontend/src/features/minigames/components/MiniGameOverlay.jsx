import React, { useState, useEffect } from 'react';
import DigicodeGame from './DigicodeGame';
import DragDropGame from './DragDropGame';
import { authService } from '../../auth/services/auth.service';
import { minigameService } from '../services/minigame.service';

export default function MiniGameOverlay({ id, successScene, failScene, onComplete }) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            minigameService.getById(id)
                .then(data => {
                    setGameData(data);
                    setError(null);
                })
                .catch(err => {
                    console.error("Failed to load game config:", err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleWin = async () => {
        if (gameData?.xpReward) {
            try {
                await authService.updateUserXp(gameData.xpReward);
                console.log(`XP Added: ${gameData.xpReward}`);
            } catch (e) {
                console.error("Failed to add XP", e);
            }
        }

        // Use successScene from props (from story JSON), fallback to API data
        const targetScene = successScene || gameData?.successPageNumber || 'success';
        onComplete(true, targetScene);
    };

    const handleLose = () => {
        // Use failScene from props (from story JSON), fallback to API data
        const targetScene = failScene || gameData?.failurePageNumber || 'fail';
        onComplete(false, targetScene);
    };

    if (loading) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p>Chargement de l'épreuve...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !gameData) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white">
                <div className="bg-red-900/50 p-6 rounded-lg border border-red-500">
                    <p className="text-lg font-bold mb-2">Erreur de chargement</p>
                    <p className="text-sm mb-4">{error || `Jeu inconnu (ID: ${id})`}</p>
                    <button
                        onClick={() => onComplete(false, failScene || 'error')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    // Determine which component to use based on game type
    let GameComponent;
    switch (gameData.type) {
        case 'DIGITAL_LOCK':
            GameComponent = DigicodeGame;
            break;
        case 'FILL_BLANKS':
            GameComponent = DragDropGame;
            break;
        default:
            return (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white">
                    <div className="bg-red-900/50 p-6 rounded-lg border border-red-500">
                        <p className="text-lg font-bold mb-2">Type de jeu non supporté</p>
                        <p className="text-sm mb-4">Type: {gameData.type}</p>
                        <button
                            onClick={() => onComplete(false, failScene || 'error')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            );
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-4xl p-4">
                <GameComponent gameId={id} onWin={handleWin} onLose={handleLose} />
            </div>
        </div>
    );
}
