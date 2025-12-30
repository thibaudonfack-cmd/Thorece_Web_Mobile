import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, ClockIcon, SparklesIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import ConfettiExplosion from 'react-confetti-explosion';

import { minigameService } from '../services/minigame.service';
import { useMemoryStore } from '../stores/useMemoryStore';
import MemoryCard from './MemoryCard';
import MemoryVictoryScreen from './MemoryVictoryScreen';
import MemoryDefeatScreen from './MemoryDefeatScreen';
import { createSoundEffects } from '../utils/soundEffects';

export default function MemoryGame({ onWin, onLose, gameId }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [soundEffects, setSoundEffects] = useState(null);
    const [error, setError] = useState(null);
    const [loadingTimeout, setLoadingTimeout] = useState(false);

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

    // Initialiser les effets sonores
    useEffect(() => {
        try {
            const effects = createSoundEffects();
            setSoundEffects(effects);
        } catch (error) {
            console.error('Failed to initialize sound effects:', error);
        }
    }, []);

    // Timeout de sécurité pour le chargement
    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === 'loading') {
                console.error('⏰ Loading timeout! Game failed to initialize after 5 seconds');
                setLoadingTimeout(true);
                setError('Le jeu prend trop de temps à charger. Veuillez réessayer.');
                setStatus('error');
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [status]);

    // Charger la configuration du jeu
    useEffect(() => {
        if (gameId) {
            console.log('🎮 Loading Memory game with ID:', gameId);
            minigameService
                .getById(gameId)
                .then((data) => {
                    console.log('📦 Game data received:', data);
                    try {
                        const config = JSON.parse(data.contentJson);
                        console.log('📋 Parsed config:', config);

                        const fullConfig = {
                            ...config,
                            gridSize: config.gridSize || 4, // 4x4 par défaut
                            imagePairs: config.imagePairs || [],
                            timeLimit: config.timeLimit || null,
                            instructionText:
                                config.instructionText || 'Trouvez toutes les paires d\'images identiques!',
                        };

                        console.log('✅ Full config:', fullConfig);
                        console.log(`🖼️ Image pairs count: ${fullConfig.imagePairs.length}`);

                        if (!fullConfig.imagePairs || fullConfig.imagePairs.length === 0) {
                            console.error('❌ ERROR: No image pairs in config!');
                            setError('Aucune image configurée pour ce jeu');
                            setStatus('error');
                            return;
                        }

                        // Validation supplémentaire : vérifier que les URLs d'images sont valides
                        const validImagePairs = fullConfig.imagePairs.filter(url => url && typeof url === 'string' && url.trim() !== '');
                        if (validImagePairs.length === 0) {
                            console.error('❌ ERROR: No valid image URLs in config!');
                            setError('Les URLs des images sont invalides');
                            setStatus('error');
                            return;
                        }

                        // Utiliser les URLs d'images valides
                        const validConfig = { ...fullConfig, imagePairs: validImagePairs };

                        setMemoryConfig(validConfig);
                        initializeGame(validConfig);
                        console.log('🎯 Game initialized successfully');
                    } catch (e) {
                        console.error('❌ Invalid game config JSON', e);
                        setStatus('error');
                    }
                })
                .catch((err) => {
                    console.error('❌ Failed to load game', err);
                    setStatus('error');
                });
        }

        return () => reset();
    }, [gameId]);

    // Log status changes
    useEffect(() => {
        console.log('🎮 Game status changed:', status);
    }, [status]);

    // Log cards changes
    useEffect(() => {
        console.log(`🃏 Cards in game: ${cards.length}, Status: ${status}`);
    }, [cards.length, status]);

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
        console.log('🎯 handleCardClick called:', cardId, 'Status:', status);
        console.log('📊 Current state:', { status, cardsCount: cards.length, isLocked, flippedCardsCount: flippedCards.length });

        // Bloquer les clics si le jeu n'est pas en cours
        if (status !== 'playing') {
            console.log('⏸️ Card flip blocked: status is not "playing", current status:', status);
            return;
        }

        // Vérification de sécurité : s'assurer que la carte existe
        const card = cards.find(c => c.id === cardId);
        if (!card) {
            console.error('❌ Card not found:', cardId);
            return;
        }

        // Jouer le son de flip
        if (soundEnabled && soundEffects) {
            soundEffects.playFlipSound();
        }

        console.log('🔄 Calling flipCard for:', cardId);
        flipCard(cardId);
    };

    // Effet sonore pour les paires trouvées
    useEffect(() => {
        if (matchedPairs.length > 0 && soundEnabled && soundEffects) {
            soundEffects.playMatchSound();
        }
    }, [matchedPairs.length]);

    // Effet sonore pour la victoire
    useEffect(() => {
        if (status === 'won' && soundEnabled && soundEffects) {
            setTimeout(() => {
                soundEffects.playVictorySound();
            }, 500);
        }
    }, [status]);

    // Effet sonore pour le timer en dessous de 10 secondes
    useEffect(() => {
        if (timeLeft !== null && timeLeft <= 10 && timeLeft > 0 && status === 'playing' && soundEnabled && soundEffects) {
            soundEffects.playTickSound();
        }
    }, [timeLeft]);

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
        console.log('❌ Showing error screen. Error:', error);
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 gap-4 text-white bg-red-900/50 rounded-2xl"
            >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-lg font-semibold">Impossible de charger le jeu de mémoire</p>
                {error && <p className="text-sm text-red-300">{error}</p>}
            </motion.div>
        );
    }

    if (!memoryConfig) {
        console.log('⏳ Waiting for config...');
        return null;
    }

    const { gridSize, instructionText } = memoryConfig;

    console.log('🎲 Rendering Memory game', { gridSize, cardsCount: cards.length, status });

    // Vérification de sécurité : ne pas afficher si pas de cartes
    if (cards.length === 0 && status === 'playing') {
        console.warn('⚠️ Game status is "playing" but no cards available. Possible initialization issue.');
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
                <p className="text-white text-lg font-semibold">Préparation des cartes...</p>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col items-center justify-start p-2 md:p-4 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 rounded-3xl shadow-2xl w-full max-w-full mx-auto overflow-y-auto"
                style={{ maxHeight: '95vh' }}
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
                            type: 'tween',  // ✅ TWEEN pour supporter 3 keyframes
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
                            type: 'tween',  // ✅ TWEEN pour supporter 3 keyframes
                        }}
                        style={{ bottom: '10%', right: '10%' }}
                    />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 w-full mb-4 md:mb-6 text-center"
                >
                    <div className="relative px-12 md:px-0">
                        <h2 className="text-white font-serif text-2xl md:text-4xl mb-2 md:mb-3 tracking-wide flex items-center justify-center gap-2 md:gap-3">
                            <SparklesIcon className="w-6 h-6 md:w-10 md:h-10 text-pink-400" />
                            Jeu de Paires
                            <SparklesIcon className="w-6 h-6 md:w-10 md:h-10 text-pink-400" />
                        </h2>

                        {/* Bouton Son */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="absolute top-0 right-0 md:right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 hover:bg-white/30 transition-colors"
                            title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
                        >
                            {soundEnabled ? (
                                <SpeakerWaveIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            ) : (
                                <SpeakerXMarkIcon className="w-5 h-5 md:w-6 md:h-6 text-white/50" />
                            )}
                        </motion.button>
                    </div>

                    <p className="text-purple-200 text-sm md:text-lg max-w-2xl mx-auto px-4">
                        {instructionText}
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 w-full mb-4 md:mb-8 flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-black/40 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-pink-500 to-rose-500 px-3 md:px-6 py-2 md:py-3 rounded-xl shadow-lg"
                    >
                        <TrophyIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        <div className="text-left">
                            <p className="text-xs text-pink-100">Mouvements</p>
                            <p className="text-xl md:text-2xl font-bold text-white">{moves}</p>
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
                            transition={timeLeft < 30 ? {
                                duration: 1,
                                repeat: Infinity,
                                type: 'tween',  // ✅ TWEEN pour supporter 3 keyframes
                                ease: 'easeInOut'
                            } : {}}
                            className={clsx(
                                'flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl shadow-lg',
                                timeLeft < 30
                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            )}
                        >
                            <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            <div className="text-left">
                                <p className="text-xs text-blue-100">Temps restant</p>
                                <p className="text-xl md:text-2xl font-mono font-bold text-white">
                                    {formatTime(timeLeft)}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 px-3 md:px-6 py-2 md:py-3 rounded-xl shadow-lg"
                    >
                        <span className="text-2xl md:text-3xl">🧠</span>
                        <div className="text-left">
                            <p className="text-xs text-purple-100">Paires à trouver</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
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
                    className="relative z-10 mb-8 w-full max-w-full px-2"
                >
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-2 md:p-4 shadow-2xl">
                        <div
                            className="grid gap-2 md:gap-3 mx-auto w-full"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                maxWidth: '100%',
                                aspectRatio: '1',
                                maxHeight: '70vh',
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
