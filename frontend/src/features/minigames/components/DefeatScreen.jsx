import React from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function DefeatScreen({ reason = 'timeout', moves, onRetry, onContinue }) {
    const getReasonMessage = () => {
        switch (reason) {
            case 'timeout':
                return {
                    title: 'Temps écoulé !',
                    message: 'Le temps imparti pour résoudre ce puzzle est terminé.',
                    icon: <ClockIcon className="w-24 h-24 text-red-500 mx-auto mb-4" />,
                };
            default:
                return {
                    title: 'Échec',
                    message: 'Vous n\'avez pas réussi à résoudre le puzzle.',
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/95 via-red-900/95 to-orange-900/95 backdrop-blur-sm"
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

                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2">
                        {reasonData.title}
                    </h2>
                    <p className="text-xl text-gray-700">
                        {reasonData.message}
                    </p>
                </motion.div>

                {/* Stats */}
                {moves > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-8 text-center"
                    >
                        <p className="text-gray-600 mb-2">Vous avez effectué</p>
                        <p className="text-4xl font-bold text-red-600">{moves}</p>
                        <p className="text-gray-600">mouvement{moves > 1 ? 's' : ''}</p>
                    </motion.div>
                )}

                {/* Encouragement */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8"
                >
                    <div className="flex items-start gap-3">
                        <div className="text-3xl">💡</div>
                        <div>
                            <p className="font-semibold text-blue-900 mb-2">Conseil</p>
                            <p className="text-blue-800">
                                Observez bien l'image complète avant de commencer.
                                Commencez par les coins et les bords pour avoir des repères !
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={onRetry}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                        Réessayer
                    </button>

                    <button
                        onClick={onContinue}
                        className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        Continuer sans résoudre
                    </button>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-200 rounded-full blur-2xl opacity-50" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-50" />
            </motion.div>
        </motion.div>
    );
}
