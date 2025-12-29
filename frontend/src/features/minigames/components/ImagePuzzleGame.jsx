import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { minigameService } from '../services/minigame.service';
import { usePuzzleStore } from '../stores/usePuzzleStore';
import PuzzlePiece from './PuzzlePiece';
import VictoryScreen from './VictoryScreen';
import DefeatScreen from './DefeatScreen';

export default function ImagePuzzleGame({ onWin, onLose, gameId }) {
    const {
        status,
        puzzleConfig,
        pieces,
        timeLeft,
        moves,
        selectedPieceId,
        showVictoryScreen,
        showDefeatScreen,
        setPuzzleConfig,
        setStatus,
        initializePuzzle,
        selectPiece,
        swapPieces,
        decrementTimer,
        closeVictoryScreen,
        closeDefeatScreen,
        reset,
    } = usePuzzleStore();

    const [localPieces, setLocalPieces] = useState([]);

    // Configuration des capteurs pour le drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
                            gridSize: config.gridSize || 3,
                            imageUrl: config.imageUrl || '/default-puzzle.jpg',
                            timeLimit: config.timeLimit || null,
                            instructionText:
                                config.instructionText || 'Assemblez les pièces du puzzle!',
                        };
                        setPuzzleConfig(fullConfig);
                        initializePuzzle(fullConfig);
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

    // Synchroniser les pièces locales avec le store
    useEffect(() => {
        setLocalPieces(pieces);
    }, [pieces]);

    // Timer
    useEffect(() => {
        if (status === 'playing' && timeLeft !== null && timeLeft > 0) {
            const timer = setTimeout(() => {
                decrementTimer();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, status]);

    // Gérer le drag end
    const handleDragEnd = (event) => {
        // Bloquer le drag si le jeu n'est pas en cours
        if (status !== 'playing') return;

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localPieces.findIndex((p) => p.id === active.id);
            const newIndex = localPieces.findIndex((p) => p.id === over.id);

            const newPieces = arrayMove(localPieces, oldIndex, newIndex);
            setLocalPieces(newPieces);

            // Mettre à jour le store
            swapPieces(active.id, over.id);
        }
    };

    const handlePieceClick = (pieceId) => {
        // Bloquer les clics si le jeu n'est pas en cours
        if (status !== 'playing') return;

        selectPiece(pieceId);
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
                <p className="text-white text-lg font-semibold">Chargement du puzzle...</p>
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
                <p className="text-lg font-semibold">Impossible de charger le puzzle</p>
            </motion.div>
        );
    }

    if (!puzzleConfig) return null;

    const { gridSize, imageUrl, instructionText } = puzzleConfig;
    const pieceSize = 100;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl shadow-2xl max-w-5xl mx-auto overflow-hidden min-h-[700px]"
            >
                {/* Animated background blobs */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <motion.div
                        className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl"
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
                        className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl"
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
                        <SparklesIcon className="w-10 h-10 text-amber-400" />
                        Puzzle Visuel
                        <SparklesIcon className="w-10 h-10 text-amber-400" />
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
                        className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 rounded-xl shadow-lg"
                    >
                        <TrophyIcon className="w-6 h-6 text-white" />
                        <div className="text-left">
                            <p className="text-xs text-amber-100">Mouvements</p>
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
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl shadow-lg"
                    >
                        <span className="text-3xl">🧩</span>
                        <div className="text-left">
                            <p className="text-xs text-purple-100">Difficulté</p>
                            <p className="text-2xl font-bold text-white">{gridSize}x{gridSize}</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Puzzle Grid avec DndContext */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="relative z-10 mb-8"
                >
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={localPieces.map((p) => p.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div
                                    className="grid gap-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
                                        gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
                                    }}
                                >
                                    {localPieces
                                        .sort((a, b) => a.currentIndex - b.currentIndex)
                                        .map((piece) => (
                                            <PuzzlePiece
                                                key={piece.id}
                                                piece={piece}
                                                gridSize={gridSize}
                                                imageUrl={imageUrl}
                                                isSelected={selectedPieceId === piece.id}
                                                isCorrect={piece.currentIndex === piece.correctIndex}
                                                onClick={() => handlePieceClick(piece.id)}
                                                pieceSize={pieceSize}
                                            />
                                        ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </motion.div>

                {/* Hint: Image preview miniature */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative z-10"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-xl">
                        <p className="text-white text-sm mb-2 text-center font-semibold">
                            💡 Aperçu
                        </p>
                        <img
                            src={imageUrl}
                            alt="Aperçu du puzzle"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-white/30 shadow-lg"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Victory Screen */}
            <AnimatePresence>
                {showVictoryScreen && (
                    <VictoryScreen
                        moves={moves}
                        timeLimit={puzzleConfig.timeLimit}
                        timeLeft={timeLeft}
                        gridSize={gridSize}
                        imageUrl={imageUrl}
                        onContinue={handleVictoryContinue}
                    />
                )}
            </AnimatePresence>

            {/* Defeat Screen */}
            <AnimatePresence>
                {showDefeatScreen && (
                    <DefeatScreen
                        reason="timeout"
                        moves={moves}
                        onContinue={handleDefeatContinue}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
