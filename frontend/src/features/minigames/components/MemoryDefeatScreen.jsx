import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function MemoryDefeatScreen({ reason = 'timeout', moves, pairsFound, totalPairs, onContinue }) {
    const [countdown, setCountdown] = useState(4);

    // Redirection automatique après 4 secondes
    useEffect(() => {
        // Démarrer le compte à rebours
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Rediriger automatiquement
                    setTimeout(() => {
                        onContinue();
                    }, 100);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onContinue]);

    const getReasonMessage = () => {
        switch (reason) {
            case 'timeout':
                return {
                    title: 'Temps écoulé !',
                    message: 'Le temps imparti pour trouver toutes les paires est terminé.',
                    icon: <ClockIcon className="w-24 h-24 text-red-500 mx-auto mb-4" />,
                };
            default:
                return {
                    title: 'Échec',
                    message: 'Vous n\'avez pas réussi à trouver toutes les paires.',
                    icon: <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-4" />,
                };
        }
    };

    const reasonData = getReasonMessage();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/95 via-red-900/95 to-pink-900/95 backdrop-blur-sm"
        >
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-red-400 rounded-full opacity-30"
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 100 - 50, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
                className="relative z-10 max-w-2xl w-full mx-4 bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-2xl p-8"
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
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                        }}
                        className="inline-block"
                    >
                        {reasonData.icon}
                    </motion.div>

                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-2">
                        {reasonData.title}
                    </h2>
                    <p className="text-xl text-gray-700">
                        {reasonData.message}
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-6 mb-8"
                >
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-gray-600 mb-2">Paires trouvées</p>
                            <p className="text-4xl font-bold text-pink-600">
                                {pairsFound} / {totalPairs}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-2">Mouvements</p>
                            <p className="text-4xl font-bold text-red-600">{moves}</p>
                        </div>
                    </div>

                    {pairsFound > 0 && (
                        <div className="mt-6 pt-6 border-t-2 border-pink-200 text-center">
                            <p className="text-gray-700 text-lg">
                                🧠 Vous avez tout de même trouvé {pairsFound} paire{pairsFound > 1 ? 's' : ''} !
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Message de redirection automatique */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-pink-50 to-red-50 border-2 border-pink-300 rounded-2xl p-6 mb-8 text-center"
                >
                    <div className="mb-4">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                            }}
                            className="text-5xl mb-3"
                        >
                            ⏱️
                        </motion.div>
                        <p className="text-lg font-semibold text-pink-900 mb-2">
                            L'histoire continue dans
                        </p>
                        <motion.div
                            key={countdown}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600"
                        >
                            {countdown}
                        </motion.div>
                        <p className="text-sm text-pink-700 mt-2">
                            seconde{countdown > 1 ? 's' : ''}
                        </p>
                    </div>
                </motion.div>

                {/* Action - Un seul bouton pour continuer maintenant */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={onContinue}
                        className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        Continuer l'histoire maintenant →
                    </button>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-200 rounded-full blur-2xl opacity-50" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-50" />
            </motion.div>
        </motion.div>
    );
}
