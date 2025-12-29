import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArrowDownTrayIcon, TrophyIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function VictoryScreen({
    moves,
    timeLimit,
    timeLeft,
    gridSize,
    imageUrl,
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

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#7c3aed'); // purple-600
        gradient.addColorStop(1, '#4f46e5'); // indigo-600
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
        ctx.fillText('Puzzle Complété', canvas.width / 2, 160);

        // Stats box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.roundRect(50, 200, canvas.width - 100, 180, 20);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`📊 Mouvements: ${moves}`, 80, 250);

        if (timeLimit) {
            const timeTaken = timeLimit - (timeLeft || 0);
            ctx.fillText(`⏱️ Temps: ${formatTime(timeTaken)}`, 80, 300);
        }

        ctx.fillText(`🧩 Difficulté: ${gridSize}x${gridSize}`, 80, 350);

        // Load and draw completed image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const imgSize = 400;
            const imgX = (canvas.width - imgSize) / 2;
            const imgY = 420;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 6;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);

            // Footer
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('Cipe Studio - ' + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40);
        };
        img.src = imageUrl;
    };

    const downloadVictoryCard = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `puzzle-victory-${Date.now()}.png`;
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-sm"
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
                className="relative z-10 max-w-2xl w-full mx-4 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8"
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

                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        BRAVO !
                    </h2>
                    <p className="text-2xl text-purple-700 font-semibold">
                        Puzzle résolu avec succès
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
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
                            className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-lg"
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
                        <div className="text-4xl mb-2">🧩</div>
                        <p className="text-sm opacity-90">Difficulté</p>
                        <p className="text-3xl font-bold">{gridSize}x{gridSize}</p>
                    </motion.div>
                </div>

                {/* Image complète */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="mb-8"
                >
                    <img
                        src={imageUrl}
                        alt="Puzzle complété"
                        className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-amber-400"
                    />
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
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        Continuer la lecture →
                    </button>
                </motion.div>

                {/* Hidden canvas for victory card */}
                <canvas ref={canvasRef} className="hidden" />
            </motion.div>
        </motion.div>
    );
}
