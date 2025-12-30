// Helper functions to create simple sound effects using Web Audio API
export const createSoundEffects = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const playFlipSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    const playMatchSound = () => {
        // Success sound - ascending tones
        const times = [0, 0.1, 0.2];
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        times.forEach((time, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequencies[index];
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.3);

            oscillator.start(audioContext.currentTime + time);
            oscillator.stop(audioContext.currentTime + time + 0.3);
        });
    };

    const playErrorSound = () => {
        // Error sound - descending tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };

    const playVictorySound = () => {
        // Victory fanfare - C major arpeggio
        const times = [0, 0.15, 0.3, 0.45];
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        times.forEach((time, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequencies[index];
            oscillator.type = 'triangle';

            const volume = index === times.length - 1 ? 0.4 : 0.25;
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.5);

            oscillator.start(audioContext.currentTime + time);
            oscillator.stop(audioContext.currentTime + time + 0.5);
        });
    };

    const playTickSound = () => {
        // Quick tick for timer
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    };

    return {
        playFlipSound,
        playMatchSound,
        playErrorSound,
        playVictorySound,
        playTickSound,
    };
};
