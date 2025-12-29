import React, { useState, useEffect, useRef } from 'react';
import { minigameService } from '../services/minigame.service';
import {
    ArrowDownTrayIcon,
    TrophyIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function ImagePuzzleGame({ onWin, onLose, gameId }) {
    const [status, setStatus] = useState('loading'); // loading, playing, won, lost, error
    const [puzzleConfig, setPuzzleConfig] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [moves, setMoves] = useState(0);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const canvasRef = useRef(null);
    const victoryCardRef = useRef(null);

    // Load game configuration
    useEffect(() => {
        if (gameId) {
            minigameService.getById(gameId)
                .then(data => {
                    try {
                        const config = JSON.parse(data.contentJson);
                        setPuzzleConfig({
                            ...config,
                            gridSize: config.gridSize || 3,
                            imageUrl: config.imageUrl || '/default-puzzle.jpg',
                            timeLimit: config.timeLimit || null,
                            instructionText: config.instructionText || 'Assemblez les pièces du puzzle!'
                        });

                        if (config.timeLimit) {
                            setTimeLeft(config.timeLimit);
                        }

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
            // Fallback for dev/testing
            setPuzzleConfig({
                gridSize: 3,
                imageUrl: '/default-puzzle.jpg',
                timeLimit: null,
                instructionText: 'Assemblez les pièces du puzzle!'
            });
            setStatus('playing');
        }
    }, [gameId]);

    // Initialize puzzle pieces
    useEffect(() => {
        if (puzzleConfig && status === 'playing') {
            const { gridSize } = puzzleConfig;
            const totalPieces = gridSize * gridSize;

            // Create ordered array
            const orderedPieces = Array.from({ length: totalPieces }, (_, i) => ({
                id: i,
                currentIndex: i,
                correctIndex: i
            }));

            // Shuffle pieces (Fisher-Yates algorithm)
            const shuffled = [...orderedPieces];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i].currentIndex, shuffled[j].currentIndex] =
                [shuffled[j].currentIndex, shuffled[i].currentIndex];
            }

            // Ensure puzzle is solvable and not already solved
            let attempts = 0;
            while (isSolved(shuffled) && attempts < 10) {
                const i = Math.floor(Math.random() * shuffled.length);
                const j = Math.floor(Math.random() * shuffled.length);
                if (i !== j) {
                    [shuffled[i].currentIndex, shuffled[j].currentIndex] =
                    [shuffled[j].currentIndex, shuffled[i].currentIndex];
                }
                attempts++;
            }

            setPieces(shuffled);
        }
    }, [puzzleConfig, status]);

    // Timer countdown
    useEffect(() => {
        if (status === 'playing' && timeLeft !== null && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && status === 'playing') {
            setStatus('lost');
            setTimeout(onLose, 2000);
        }
    }, [timeLeft, status, onLose]);

    // Check if puzzle is solved
    const isSolved = (piecesArray = pieces) => {
        return piecesArray.every(piece => piece.currentIndex === piece.correctIndex);
    };

    // Handle piece selection and swapping
    const handlePieceClick = (piece) => {
        if (status !== 'playing') return;

        if (!selectedPiece) {
            // First piece selected
            setSelectedPiece(piece);
        } else if (selectedPiece.id === piece.id) {
            // Deselect if clicking same piece
            setSelectedPiece(null);
        } else {
            // Swap pieces
            setPieces(prevPieces => {
                const newPieces = prevPieces.map(p => {
                    if (p.id === selectedPiece.id) {
                        return { ...p, currentIndex: piece.currentIndex };
                    }
                    if (p.id === piece.id) {
                        return { ...p, currentIndex: selectedPiece.currentIndex };
                    }
                    return p;
                });

                setMoves(prev => prev + 1);
                setSelectedPiece(null);

                // Check if solved
                if (isSolved(newPieces)) {
                    setStatus('won');
                    setTimeout(() => {
                        generateVictoryCard();
                        setTimeout(onWin, 3000);
                    }, 500);
                }

                return newPieces;
            });
        }
    };

    // Generate victory card
    const generateVictoryCard = () => {
        if (!canvasRef.current || !puzzleConfig) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
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
        ctx.fillText(`⏱️ Temps: ${formatTime(puzzleConfig.timeLimit - (timeLeft || 0))}`, 80, 300);
        ctx.fillText(`🧩 Difficulté: ${puzzleConfig.gridSize}x${puzzleConfig.gridSize}`, 80, 350);

        // Load and draw completed image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const imgSize = 400;
            const imgX = (canvas.width - imgSize) / 2;
            const imgY = 420;

            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;

            ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            // Border around image
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 6;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);

            // Footer
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('Cipe Studio - ' + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40);
        };
        img.src = puzzleConfig.imageUrl;
    };

    // Download victory card
    const downloadVictoryCard = () => {
        if (!canvasRef.current) return;

        const link = document.createElement('a');
        link.download = `puzzle-victory-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    // Format time helper
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get piece position in grid
    const getPiecePosition = (index) => {
        const { gridSize } = puzzleConfig;
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return { row, col };
    };

    if (status === 'loading') {
        return (
            <div className="text-white text-center p-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Chargement du puzzle...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-red-500 text-center p-8 flex flex-col items-center gap-4">
                <XCircleIcon className="w-12 h-12" />
                <p>Impossible de charger le puzzle</p>
            </div>
        );
    }

    if (!puzzleConfig) return null;

    const { gridSize, imageUrl, instructionText } = puzzleConfig;
    const pieceSize = 100; // Base size, will be scaled with CSS

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl shadow-2xl max-w-4xl mx-auto relative overflow-hidden min-h-[600px]">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ top: '10%', left: '10%' }}></div>
                <div className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ bottom: '10%', right: '10%', animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10 w-full mb-6">
                <h2 className="text-white font-serif text-3xl mb-2 text-center tracking-wide">
                    🧩 Puzzle Visuel
                </h2>
                <p className="text-purple-200 text-center text-sm max-w-md mx-auto">
                    {instructionText}
                </p>
            </div>

            {/* Stats Bar */}
            <div className="relative z-10 w-full mb-6 flex justify-around items-center bg-black/30 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-400">
                    <TrophyIcon className="w-6 h-6" />
                    <span className="font-bold">{moves} coups</span>
                </div>

                {timeLeft !== null && (
                    <div className={`flex items-center gap-2 ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                        <ClockIcon className="w-6 h-6" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-purple-300">
                    <span className="text-sm">Difficulté:</span>
                    <span className="font-bold">{gridSize}x{gridSize}</span>
                </div>
            </div>

            {/* Puzzle Grid */}
            <div
                className="relative z-10 bg-black/20 backdrop-blur-sm rounded-lg p-4 mb-6"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
                    gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
                    gap: '4px'
                }}
            >
                {pieces
                    .sort((a, b) => a.currentIndex - b.currentIndex)
                    .map((piece) => {
                        const { row, col } = getPiecePosition(piece.correctIndex);
                        const isSelected = selectedPiece?.id === piece.id;
                        const isCorrect = piece.currentIndex === piece.correctIndex;

                        return (
                            <div
                                key={piece.id}
                                onClick={() => handlePieceClick(piece)}
                                className={`
                                    cursor-pointer transition-all duration-200
                                    ${isSelected ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''}
                                    ${isCorrect && status === 'won' ? 'ring-2 ring-green-400' : ''}
                                    hover:scale-105 hover:shadow-lg
                                `}
                                style={{
                                    width: `${pieceSize}px`,
                                    height: `${pieceSize}px`,
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: `${gridSize * pieceSize}px ${gridSize * pieceSize}px`,
                                    backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '4px',
                                    boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                        );
                    })}
            </div>

            {/* Victory Overlay */}
            {status === 'won' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50 animate-fade-in">
                    {/* Confetti effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `-20px`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                        <div className="flex items-center gap-4 text-green-400 animate-bounce">
                            <CheckCircleIcon className="w-16 h-16" />
                            <h3 className="text-6xl font-bold">BRAVO!</h3>
                            <CheckCircleIcon className="w-16 h-16" />
                        </div>

                        <p className="text-2xl text-white">Puzzle résolu en {moves} coups!</p>

                        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                            {/* Victory card preview */}
                            <canvas ref={canvasRef} className="hidden" />
                            {canvasRef.current && (
                                <button
                                    onClick={downloadVictoryCard}
                                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <ArrowDownTrayIcon className="w-6 h-6" />
                                    Télécharger la carte de victoire
                                </button>
                            )}
                        </div>

                        {/* Show complete image */}
                        <div className="mt-6">
                            <img
                                src={imageUrl}
                                alt="Puzzle complété"
                                className="max-w-md mx-auto rounded-lg shadow-2xl border-4 border-amber-400"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Defeat Overlay */}
            {status === 'lost' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
                    <div className="text-center space-y-4">
                        <div className="text-red-500 animate-pulse">
                            <XCircleIcon className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">Temps écoulé!</h3>
                        <p className="text-gray-300">Essayez à nouveau pour résoudre le puzzle</p>
                    </div>
                </div>
            )}
        </div>
    );
}
