import React, { useState, useEffect } from 'react';
import { minigameService } from '../services/minigame.service';

export default function DigicodeGame({ onWin, onLose, gameId }) {
    const [code, setCode] = useState('');
    const [attempts, setAttempts] = useState(3);
    const [status, setStatus] = useState('loading'); // loading, playing, won, lost, error
    const [targetCode, setTargetCode] = useState(null);

    useEffect(() => {
        if (gameId) {
            minigameService.getById(gameId)
                .then(data => {
                    try {
                        const config = JSON.parse(data.contentJson);
                        setTargetCode(config.solution || '1234'); // Fallback if missing
                        setStatus('playing');
                    } catch (e) {
                        console.error("Invalid game config JSON", e);
                        setStatus('error');
                    }
                })
                .catch(err => {
                    console.error("Failed to load game", err);
                    setStatus('error');
                });
        } else {
             // Fallback for dev/testing without backend
             setTargetCode('1337');
             setStatus('playing');
        }
    }, [gameId]);

    useEffect(() => {
        if (code.length === 4 && status === 'playing') {
            handleVerify();
        }
    }, [code, status]);

    const handleVerify = () => {
        if (code === targetCode) {
            setStatus('won');
            setTimeout(onWin, 1500);
        } else {
            // Error
            setCode('');
            setAttempts(prev => prev - 1);
            if (attempts - 1 <= 0) {
                setStatus('lost');
                setTimeout(onLose, 1500);
            }
        }
    };

    const handlePress = (num) => {
        if (code.length < 4 && status === 'playing') {
            setCode(prev => prev + num);
        }
    };

    if (status === 'loading') return <div className="text-white text-center p-8">Chargement du système de sécurité...</div>;
    if (status === 'error') return <div className="text-red-500 text-center p-8">Erreur système critique. Connexion impossible.</div>;

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-stone-900 border-4 border-amber-700 rounded-xl shadow-2xl max-w-md mx-auto relative overflow-hidden">
            {/* Background Texture Effect */}
            <div className="absolute inset-0 opacity-10 bg-[url('/assets/images/features-icons.png')]"></div>
            
            <h2 className="text-amber-500 font-serif text-2xl mb-6 relative z-10 tracking-widest uppercase">
                Système de Sécurité
            </h2>

            {/* Screen */}
            <div className={`w-full bg-black border-2 border-stone-600 rounded p-4 mb-6 text-center h-20 flex items-center justify-center relative z-10 ${status === 'lost' ? 'animate-pulse border-red-500' : ''}`}>
                <span className={`font-mono text-4xl tracking-[0.5em] ${status === 'won' ? 'text-green-500' : status === 'lost' ? 'text-red-500' : 'text-amber-500'}`}>
                    {code.padEnd(4, '_')}
                </span>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 relative z-10 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handlePress(num.toString())}
                        className="bg-stone-800 hover:bg-stone-700 text-amber-500 font-bold py-4 rounded border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all text-xl shadow-lg"
                    >
                        {num}
                    </button>
                ))}
                <div className="col-span-1"></div>
                <button
                    onClick={() => handlePress('0')}
                    className="bg-stone-800 hover:bg-stone-700 text-amber-500 font-bold py-4 rounded border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all text-xl shadow-lg"
                >
                    0
                </button>
                <div className="col-span-1"></div>
            </div>

            {/* Status Info */}
            <div className="mt-6 text-stone-400 font-mono text-sm relative z-10">
                Tentatives restantes: <span className={attempts === 1 ? 'text-red-500 font-bold' : 'text-amber-500'}>{attempts}</span>
            </div>
            
            {status === 'won' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                    <div className="text-green-500 font-bold text-3xl animate-bounce">ACCÈS AUTORISÉ</div>
                </div>
            )}
            
            {status === 'lost' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                    <div className="text-red-500 font-bold text-3xl">VERROUILLAGE</div>
                </div>
            )}
        </div>
    );
}
