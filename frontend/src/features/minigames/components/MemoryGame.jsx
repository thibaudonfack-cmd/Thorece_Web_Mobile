import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import ConfettiExplosion from 'react-confetti-explosion';

import { minigameService } from '../services/minigame.service';
import { useMemoryStore } from '../stores/useMemoryStore';
import MemoryCard from './MemoryCard';
import MemoryVictoryScreen from './MemoryVictoryScreen';
import MemoryDefeatScreen from './MemoryDefeatScreen';

export default function MemoryGame({ onWin, onLose, gameId }) {
    const {
        status,
        memoryConfig,
        cards,
        flippedCards,
        matchedPairs,
        timeLeft,
        moves,
        isLocked,
        showVictoryScreen,
        showDefeatScreen,
        showConfetti,
        setMemoryConfig,
        setStatus,
        initializeGame,
        flipCard,
        decrementTimer,
        closeVictoryScreen,
        closeDefeatScreen,
        reset,
    } = useMemoryStore();

    // Charger la configuration du jeu
    useEffect(() => {
        if (gameId) {
            minigameService
                .getById(gameId)
                .then((data) => {
                    try {
                        const config = JSON.parse(data.contentJson);
                        const fullConfig = {
                            ...config,
                            gridSize: config.gridSize || 4, // 4x4 par défaut
                            imagePairs: config.imagePairs || [],
                            timeLimit: config.timeLimit || null,
                            instructionText:
                                config.instructionText || 'Trouvez toutes les paires d\'images identiques!',
                        };
                        setMemoryConfig(fullConfig);
                        initializeGame(fullConfig);
                    } catch (e) {
                        console.error('Invalid game config JSON', e);
                        setStatus('error');
                    }
                })
                .catch((err) => {
                    console.error('Failed to load game', err);
                    setStatus('error');
                });
        }

        return () => reset();
    }, [gameId]);

    // Timer
    useEffect(() => {
        if (status === 'playing' && timeLeft !== null && timeLeft > 0) {
            const timer = setTimeout(() => {
                decrementTimer();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    const handleCardClick = (cardId) => {
        // Bloquer les clics si le jeu n'est pas en cours
        if (status !== 'playing') return;
        flipCard(cardId);
    };

    const handleVictoryContinue = () => {
        closeVictoryScreen();
        setTimeout(() => {
            onWin();
        }, 300);
    };

    const handleDefeatContinue = () => {
        closeDefeatScreen();
        setTimeout(() => {
            onLose();
        }, 300);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'loading') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 gap-4"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                />
                <p className="text-white text-lg font-semibold">Chargement du jeu de mémoire...</p>
            </motion.div>
        );
    }

    if (status === 'error') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 gap-4 text-red-500"
            >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-lg font-semibold">Impossible de charger le jeu de mémoire</p>
            </motion.div>
        );
    }

    if (!memoryConfig) return null;

    const { gridSize, instructionText } = memoryConfig;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 rounded-3xl shadow-2xl max-w-5xl mx-auto overflow-hidden min-h-[700px]"
            >
                {/* Animated background blobs */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <motion.div
                        className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{ top: '10%', left: '10%' }}
                    />
                    <motion.div
                        className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                        style={{ bottom: '10%', right: '10%' }}
                    />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 w-full mb-6 text-center"
                >
                    <h2 className="text-white font-serif text-4xl mb-3 tracking-wide flex items-center justify-center gap-3">
                        <SparklesIcon className="w-10 h-10 text-pink-400" />
                        Jeu de Paires
                        <SparklesIcon className="w-10 h-10 text-pink-400" />
                    </h2>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto px-4">
                        {instructionText}
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 w-full mb-8 flex flex-wrap justify-center items-center gap-4 bg-black/40 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 rounded-xl shadow-lg"
                    >
                        <TrophyIcon className="w-6 h-6 text-white" />
                        <div className="text-left">
                            <p className="text-xs text-pink-100">Mouvements</p>
                            <p className="text-2xl font-bold text-white">{moves}</p>
                        </div>
                    </motion.div>

                    {timeLeft !== null && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            animate={
                                timeLeft < 30
                                    ? {
                                          scale: [1, 1.05, 1],
                                          backgroundColor: ['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.9)', 'rgba(239, 68, 68, 0.9)'],
                                      }
                                    : {}
                            }
                            transition={timeLeft < 30 ? { duration: 1, repeat: Infinity } : {}}
                            className={clsx(
                                'flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg',
                                timeLeft < 30
                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            )}
                        >
                            <ClockIcon className="w-6 h-6 text-white" />
                            <div className="text-left">
                                <p className="text-xs text-blue-100">Temps restant</p>
                                <p className="text-2xl font-mono font-bold text-white">
                                    {formatTime(timeLeft)}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-xl shadow-lg"
                    >
                        <span className="text-3xl">🧠</span>
                        <div className="text-left">
                            <p className="text-xs text-purple-100">Paires à trouver</p>
                            <p className="text-2xl font-bold text-white">
                                {matchedPairs.length} / {cards.length / 2}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Memory Grid */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="relative z-10 mb-8"
                >
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                        <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                maxWidth: `${gridSize * 120}px`,
                            }}
                        >
                            {cards.map((card) => {
                                const isFlipped = flippedCards.includes(card.id);
                                const isMatched = matchedPairs.some(
                                    (pair) => pair[0] === card.id || pair[1] === card.id
                                );

                                // Trouver si cette carte fait partie d'une paire non correspondante
                                const showShake =
                                    flippedCards.length === 2 &&
                                    flippedCards.includes(card.id) &&
                                    !isMatched;

                                return (
                                    <div key={card.id} className="relative">
                                        <MemoryCard
                                            card={card}
                                            onFlip={handleCardClick}
                                            isFlipped={isFlipped}
                                            isMatched={isMatched}
                                            isLocked={isLocked}
                                            showShakeAnimation={showShake}
                                        />

                                        {/* Confetti explosion sur paire trouvée */}
                                        {showConfetti === card.id && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                                                <ConfettiExplosion
                                                    force={0.6}
                                                    duration={2500}
                                                    particleCount={50}
                                                    width={800}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Hint */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10 text-center"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 shadow-xl">
                        <p className="text-white text-sm font-semibold flex items-center justify-center gap-2">
                            <span className="text-2xl">💡</span>
                            Cliquez sur deux cartes pour les retourner et trouver les paires!
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Victory Screen */}
            <AnimatePresence>
                {showVictoryScreen && (
                    <MemoryVictoryScreen
                        moves={moves}
                        timeLimit={memoryConfig.timeLimit}
                        timeLeft={timeLeft}
                        gridSize={gridSize}
                        totalPairs={cards.length / 2}
                        onContinue={handleVictoryContinue}
                    />
                )}
            </AnimatePresence>

            {/* Defeat Screen */}
            <AnimatePresence>
                {showDefeatScreen && (
                    <MemoryDefeatScreen
                        reason="timeout"
                        moves={moves}
                        pairsFound={matchedPairs.length}
                        totalPairs={cards.length / 2}
                        onContinue={handleDefeatContinue}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
