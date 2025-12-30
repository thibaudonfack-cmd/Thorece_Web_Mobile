import { create } from 'zustand';
import shuffle from 'lodash/shuffle';

export const useMemoryStore = create((set, get) => ({
    // État du jeu
    status: 'loading', // loading, playing, won, lost, error
    memoryConfig: null,
    cards: [],
    flippedCards: [], // IDs des cartes actuellement retournées
    matchedPairs: [], // IDs des paires trouvées
    moves: 0,
    timeLeft: null,
    isLocked: false, // Bloquer les clics pendant l'animation
    showVictoryScreen: false,
    showDefeatScreen: false,
    showConfetti: null, // ID de la carte pour afficher confetti

    // Actions
    setMemoryConfig: (config) => set({ memoryConfig: config }),

    setStatus: (status) => set({ status }),

    initializeGame: (config) => {
        console.log('🎬 initializeGame called with config:', config);
        const { gridSize, imagePairs } = config;

        if (!imagePairs || imagePairs.length === 0) {
            console.error('❌ initializeGame: No image pairs!');
            set({ status: 'error' });
            return;
        }

        // Créer les paires de cartes à partir des URLs d'images
        const cardPairs = imagePairs.flatMap((imageUrl, index) => [
            { id: `${index}-a`, pairId: index, imageUrl: imageUrl, isMatched: false, isFlipped: false },
            { id: `${index}-b`, pairId: index, imageUrl: imageUrl, isMatched: false, isFlipped: false },
        ]);

        console.log(`🃏 Created ${cardPairs.length} cards from ${imagePairs.length} pairs`);

        // Mélanger les cartes avec lodash shuffle
        const shuffledCards = shuffle(cardPairs);

        set({
            cards: shuffledCards,
            memoryConfig: config,
            status: 'playing',
            timeLeft: config.timeLimit || null,
            moves: 0,
            flippedCards: [],
            matchedPairs: [],
            isLocked: false,
            showVictoryScreen: false,
            showDefeatScreen: false,
            showConfetti: null,
        });

        console.log('✅ Game initialized! Status set to "playing" with', shuffledCards.length, 'cards');
    },

    flipCard: (cardId) => {
        const { cards, flippedCards, isLocked, matchedPairs, status } = get();

        console.log('🔄 flipCard called:', cardId, { status, isLocked, flippedCardsCount: flippedCards.length });

        // Gardes de sécurité
        if (status !== 'playing') {
            console.log('⏸️ flipCard blocked: status is not playing:', status);
            return;
        }
        if (isLocked) {
            console.log('⏸️ flipCard blocked: game is locked');
            return;
        }
        if (flippedCards.includes(cardId)) {
            console.log('⏸️ flipCard blocked: card already flipped');
            return;
        }
        if (matchedPairs.some(pair => pair.includes(cardId))) {
            console.log('⏸️ flipCard blocked: card already matched');
            return;
        }

        const card = cards.find(c => c.id === cardId);
        if (!card) {
            console.log('⏸️ flipCard blocked: card not found');
            return;
        }

        const newFlippedCards = [...flippedCards, cardId];

        console.log('✅ Flipping card:', cardId, 'New flipped cards:', newFlippedCards);

        // Mettre à jour les cartes retournées
        set({
            flippedCards: newFlippedCards,
            cards: cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c)
        });

        // Si c'est la deuxième carte retournée, vérifier la paire
        if (newFlippedCards.length === 2) {
            console.log('🎲 Two cards flipped, checking match...');
            get().checkMatch();
        }
    },

    checkMatch: () => {
        const { cards, flippedCards, matchedPairs, moves } = get();

        set({ isLocked: true, moves: moves + 1 });

        const [firstCardId, secondCardId] = flippedCards;
        const firstCard = cards.find(c => c.id === firstCardId);
        const secondCard = cards.find(c => c.id === secondCardId);

        if (firstCard.pairId === secondCard.pairId) {
            // ✅ Paire trouvée !
            // Déclencher confetti
            set({ showConfetti: firstCardId });
            setTimeout(() => set({ showConfetti: null }), 2500);

            setTimeout(() => {
                const newMatchedPairs = [...matchedPairs, [firstCardId, secondCardId]];

                set({
                    matchedPairs: newMatchedPairs,
                    cards: cards.map(c =>
                        c.id === firstCardId || c.id === secondCardId
                            ? { ...c, isMatched: true }
                            : c
                    ),
                    flippedCards: [],
                    isLocked: false,
                });

                // Vérifier si toutes les paires sont trouvées
                const totalPairs = cards.length / 2;
                console.log(`🎯 Paires trouvées: ${newMatchedPairs.length}/${totalPairs}`);

                if (newMatchedPairs.length === totalPairs) {
                    console.log('🎉 Toutes les paires trouvées ! Victoire !');
                    setTimeout(() => {
                        set({
                            status: 'won',
                            showVictoryScreen: true
                        });
                    }, 500);
                }
            }, 800); // Délai pour voir les deux cartes
        } else {
            // ❌ Pas de correspondance
            setTimeout(() => {
                set({
                    cards: cards.map(c =>
                        c.id === firstCardId || c.id === secondCardId
                            ? { ...c, isFlipped: false }
                            : c
                    ),
                    flippedCards: [],
                    isLocked: false,
                });
            }, 1200); // Délai pour mémoriser avant de retourner
        }
    },

    decrementTimer: () => {
        const { timeLeft, status } = get();

        if (status !== 'playing' || timeLeft === null) {
            return;
        }

        if (timeLeft > 0) {
            const newTimeLeft = timeLeft - 1;
            set({ timeLeft: newTimeLeft });

            if (newTimeLeft === 0) {
                console.log('⏰ Temps écoulé ! Défaite déclenchée (Memory).');
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
        memoryConfig: null,
        cards: [],
        flippedCards: [],
        matchedPairs: [],
        moves: 0,
        timeLeft: null,
        isLocked: false,
        showVictoryScreen: false,
        showDefeatScreen: false,
        showConfetti: null,
    }),
}));
