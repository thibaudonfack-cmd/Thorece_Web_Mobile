import { create } from 'zustand';
import shuffle from 'lodash/shuffle';

export const usePuzzleStore = create((set, get) => ({
    // État du jeu
    status: 'loading', // loading, playing, won, lost, error
    puzzleConfig: null,
    pieces: [],
    timeLeft: null,
    moves: 0,
    selectedPieceId: null,
    showVictoryScreen: false,
    showDefeatScreen: false,

    // Actions
    setPuzzleConfig: (config) => set({ puzzleConfig: config }),

    setStatus: (status) => set({ status }),

    initializePuzzle: (config) => {
        const { gridSize } = config;
        const totalPieces = gridSize * gridSize;

        // Créer les pièces ordonnées
        const orderedPieces = Array.from({ length: totalPieces }, (_, i) => ({
            id: i,
            correctIndex: i,
        }));

        // Mélanger avec lodash
        let shuffledPieces = shuffle([...orderedPieces]);

        // S'assurer que le puzzle n'est pas déjà résolu
        let attempts = 0;
        while (get().isPuzzleSolved(shuffledPieces) && attempts < 10) {
            shuffledPieces = shuffle([...orderedPieces]);
            attempts++;
        }

        set({
            pieces: shuffledPieces.map((piece, index) => ({
                ...piece,
                currentIndex: index
            })),
            puzzleConfig: config,
            status: 'playing',
            timeLeft: config.timeLimit || null,
            moves: 0,
            selectedPieceId: null,
            showVictoryScreen: false,
            showDefeatScreen: false,
        });
    },

    selectPiece: (pieceId) => {
        const { selectedPieceId, status } = get();

        // Bloquer les interactions si le jeu n'est pas en cours
        if (status !== 'playing') return;

        if (selectedPieceId === pieceId) {
            // Désélectionner si on clique sur la même pièce
            set({ selectedPieceId: null });
        } else if (selectedPieceId === null) {
            // Sélectionner la première pièce
            set({ selectedPieceId: pieceId });
        } else {
            // Échanger les pièces
            get().swapPieces(selectedPieceId, pieceId);
        }
    },

    swapPieces: (pieceId1, pieceId2) => {
        const { pieces, status } = get();

        // Bloquer les interactions si le jeu n'est pas en cours
        if (status !== 'playing') return;

        const piece1Index = pieces.findIndex(p => p.id === pieceId1);
        const piece2Index = pieces.findIndex(p => p.id === pieceId2);

        const newPieces = [...pieces];

        // Échanger les currentIndex
        const tempIndex = newPieces[piece1Index].currentIndex;
        newPieces[piece1Index].currentIndex = newPieces[piece2Index].currentIndex;
        newPieces[piece2Index].currentIndex = tempIndex;

        set({
            pieces: newPieces,
            selectedPieceId: null,
            moves: get().moves + 1,
        });

        // Vérifier si le puzzle est résolu
        if (get().isPuzzleSolved(newPieces)) {
            setTimeout(() => {
                set({
                    status: 'won',
                    showVictoryScreen: true
                });
            }, 300);
        }
    },

    isPuzzleSolved: (piecesToCheck) => {
        const pieces = piecesToCheck || get().pieces;
        return pieces.every(piece => piece.currentIndex === piece.correctIndex);
    },

    decrementTimer: () => {
        const { timeLeft, status } = get();

        if (status !== 'playing' || timeLeft === null) {
            return;
        }

        if (timeLeft > 0) {
            const newTimeLeft = timeLeft - 1;
            set({ timeLeft: newTimeLeft });

            // Si on vient d'atteindre 0, déclencher immédiatement la défaite
            if (newTimeLeft === 0) {
                console.log('⏰ Temps écoulé ! Défaite déclenchée.');
                set({
                    status: 'lost',
                    showDefeatScreen: true
                });
            }
        }
    },

    closeVictoryScreen: () => set({ showVictoryScreen: false }),
    closeDefeatScreen: () => set({ showDefeatScreen: false }),

    reset: () => set({
        status: 'loading',
        puzzleConfig: null,
        pieces: [],
        timeLeft: null,
        moves: 0,
        selectedPieceId: null,
        showVictoryScreen: false,
        showDefeatScreen: false,
    }),
}));
