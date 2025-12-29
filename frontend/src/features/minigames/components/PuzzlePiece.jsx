import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

export default function PuzzlePiece({
    piece,
    gridSize,
    imageUrl,
    isSelected,
    isCorrect,
    onClick,
    pieceSize = 100,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: piece.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Calculer la position de la pièce dans l'image originale
    const row = Math.floor(piece.correctIndex / gridSize);
    const col = piece.correctIndex % gridSize;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isDragging ? 1.1 : 1,
                opacity: 1,
                rotate: isDragging ? 5 : 0,
            }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                'cursor-pointer relative overflow-hidden rounded-lg transition-all duration-200',
                {
                    'ring-4 ring-yellow-400 shadow-2xl z-20': isSelected,
                    'ring-2 ring-green-400 shadow-lg': isCorrect && !isSelected,
                    'shadow-md hover:shadow-xl': !isSelected && !isCorrect,
                    'opacity-50': isDragging,
                }
            )}
            style={{
                width: `${pieceSize}px`,
                height: `${pieceSize}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${gridSize * pieceSize}px ${gridSize * pieceSize}px`,
                backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
                border: '2px solid rgba(255, 255, 255, 0.5)',
                ...style,
            }}
        >
            {/* Overlay pour l'effet de sélection */}
            {isSelected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="absolute inset-0 bg-yellow-400"
                />
            )}

            {/* Overlay pour pièce correcte */}
            {isCorrect && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="bg-green-500 text-white rounded-full p-1">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </motion.div>
            )}

            {/* Sparkle effect when dragging */}
            {isDragging && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                            animate={{
                                x: [0, Math.random() * 20 - 10],
                                y: [0, Math.random() * 20 - 10],
                                opacity: [1, 0],
                                scale: [1, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
