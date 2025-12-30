import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArrowDownTrayIcon, TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function MemoryVictoryScreen({
    moves,
    timeLimit,
    timeLeft,
    gridSize,
    totalPairs,
    onContinue
}) {
    const canvasRef = useRef(null);

    // Générer la carte de victoire au montage
    useEffect(() => {
        if (canvasRef.current) {
            generateVictoryCard();
        }
    }, []);

    const generateVictoryCard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 800;

        // Polyfill pour roundRect (support navigateurs anciens)
        if (!ctx.roundRect) {
            ctx.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ec4899'); // pink-600
        gradient.addColorStop(0.5, '#a855f7'); // purple-500
        gradient.addColorStop(1, '#6366f1'); // indigo-500
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decorative border
        ctx.strokeStyle = '#fbbf24'; // amber-400
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 VICTOIRE! 🏆', canvas.width / 2, 100);

        // Subtitle
        ctx.font = '32px serif';
        ctx.fillText('Jeu de Paires Complété', canvas.width / 2, 160);

        // Stats box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.roundRect(50, 220, canvas.width - 100, 280, 20);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`🧠 Paires trouvées: ${totalPairs}`, 80, 280);
        ctx.fillText(`📊 Mouvements: ${moves}`, 80, 340);

        if (timeLimit) {
            const timeTaken = timeLimit - (timeLeft || 0);
            ctx.fillText(`⏱️ Temps: ${formatTime(timeTaken)}`, 80, 400);
        }

        ctx.fillText(`🎯 Difficulté: ${gridSize}x${gridSize}`, 80, 460);

        // Memory achievement message
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 32px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mémoire Exceptionnelle!', canvas.width / 2, 560);

        // Brain illustration
        ctx.font = '120px sans-serif';
        ctx.fillText('🧠', canvas.width / 2, 680);

        // Footer
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px serif';
        ctx.fillText('Cipe Studio - ' + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40);
    };

    const downloadVictoryCard = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `memory-victory-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const timeTaken = timeLimit ? timeLimit - (timeLeft || 0) : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-sm"
        >
            {/* Confetti */}
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
                gravity={0.3}
            />

            {/* Content */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="relative z-10 max-w-2xl w-full mx-4 bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl p-8"
            >
                {/* Header avec animation */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                        className="inline-block"
                    >
                        <TrophyIcon className="w-24 h-24 text-amber-500 mx-auto mb-4" />
                    </motion.div>

                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                        BRAVO !
                    </h2>
                    <p className="text-2xl text-pink-700 font-semibold">
                        Toutes les paires ont été trouvées !
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <SparklesIcon className="w-8 h-8 mb-2" />
                        <p className="text-sm opacity-90">Mouvements</p>
                        <p className="text-3xl font-bold">{moves}</p>
                    </motion.div>

                    {timeTaken !== null && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <ClockIcon className="w-8 h-8 mb-2" />
                            <p className="text-sm opacity-90">Temps écoulé</p>
                            <p className="text-3xl font-bold">{formatTime(timeTaken)}</p>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="text-4xl mb-2">🧠</div>
                        <p className="text-sm opacity-90">Paires trouvées</p>
                        <p className="text-3xl font-bold">{totalPairs}</p>
                    </motion.div>
                </div>

                {/* Memory achievement badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="mb-8 text-center"
                >
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-8 border-4 border-amber-400">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                            className="text-8xl mb-4"
                        >
                            🧠
                        </motion.div>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                            Mémoire Exceptionnelle !
                        </p>
                        <p className="text-gray-700 mt-2">
                            Vous avez trouvé toutes les paires avec brio !
                        </p>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={downloadVictoryCard}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        <ArrowDownTrayIcon className="w-6 h-6" />
                        Télécharger le certificat
                    </button>

                    <button
                        onClick={onContinue}
                        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        Continuer la lecture →
                    </button>
                </motion.div>

                {/* Hidden canvas for victory card */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-50" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50" />
            </motion.div>
        </motion.div>
    );
}
