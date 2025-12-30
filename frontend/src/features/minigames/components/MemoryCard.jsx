import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function MemoryCard({
    card,
    onFlip,
    isFlipped,
    isMatched,
    isLocked,
    showShakeAnimation,
}) {
    const handleClick = () => {
        if (isLocked || isFlipped || isMatched) return;
        onFlip(card.id);
    };

    return (
        <div className="relative w-full aspect-square perspective-1000">
            <motion.div
                className="relative w-full h-full cursor-pointer"
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    rotateY: isFlipped || isMatched ? 180 : 0,
                    scale: isMatched ? 1.05 : 1,
                }}
                whileHover={!isFlipped && !isMatched && !isLocked ? {
                    scale: 1.1,
                    rotate: [0, -2, 2, 0],
                } : {}}
                whileTap={!isFlipped && !isMatched && !isLocked ? { scale: 0.9 } : {}}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                }}
                onClick={handleClick}
            >
                {/* Face arrière (dos de la carte) */}
                <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                    }}
                    animate={showShakeAnimation ? {
                        x: [0, -10, 10, -10, 10, 0],
                        rotate: [0, -2, 2, -2, 2, 0],
                    } : !isFlipped && !isMatched ? {
                        boxShadow: [
                            '0 20px 25px -5px rgba(236, 72, 153, 0.5)',
                            '0 25px 50px -12px rgba(236, 72, 153, 0.8)',
                            '0 20px 25px -5px rgba(236, 72, 153, 0.5)',
                        ],
                    } : {}}
                    transition={showShakeAnimation ? { duration: 0.5 } : {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 relative overflow-hidden">
                        {/* Motif de fond animé */}
                        <div className="absolute inset-0 opacity-30">
                            {[...Array(9)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-8 h-8 bg-white rounded-full"
                                    style={{
                                        left: `${(i % 3) * 33}%`,
                                        top: `${Math.floor(i / 3) * 33}%`,
                                    }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Logo ou motif central */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <SparklesIcon className="w-20 h-20 text-white opacity-50" />
                            </motion.div>
                        </div>

                        {/* Bordure brillante */}
                        <div className="absolute inset-0 border-4 border-white/30 rounded-2xl" />
                    </div>
                </motion.div>

                {/* Face avant (image de la carte) */}
                <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        rotateY: 180,
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 relative flex items-center justify-center p-2">
                        {/* Image - object-contain pour voir toute l'image */}
                        <img
                            src={card.imageUrl}
                            alt="Carte mémoire"
                            className="w-full h-full object-contain rounded-lg"
                            loading="lazy"
                            style={{
                                imageRendering: 'crisp-edges',
                            }}
                        />

                        {/* Overlay si matchée */}
                        {isMatched && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                >
                                    <div className="bg-green-500 text-white rounded-full p-3 shadow-lg">
                                        <svg
                                            className="w-8 h-8"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Bordure de la carte */}
                        <div className="absolute inset-0 border-4 border-gradient-to-br from-purple-400 to-pink-400 rounded-2xl pointer-events-none" />
                    </div>
                </motion.div>

                {/* Effet de brillance lors du hover */}
                {!isFlipped && !isMatched && !isLocked && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl pointer-events-none"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                )}
            </motion.div>
        </div>
    );
}
