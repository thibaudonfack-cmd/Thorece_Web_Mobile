import React, { useState, useEffect } from 'react';
import { minigameService } from '../services/minigame.service';

export default function DragDropGame({ onWin, onLose, gameId }) {
    // Content configuration
    const [sentenceParts, setSentenceParts] = useState([]);
    const [expectedWords, setExpectedWords] = useState([]);
    
    // State
    const [slots, setSlots] = useState([]); 
    const [availableWords, setAvailableWords] = useState([]);
    const [status, setStatus] = useState('loading'); 
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (gameId) {
            minigameService.getById(gameId)
                .then(data => {
                    try {
                        const config = JSON.parse(data.contentJson);
                        // Config expected: { fullText: "Le chevalier...", hiddenIndices: [1, 3], decoys: [...] }
                        if (!config.fullText || !config.hiddenIndices) throw new Error("Invalid config");

                        const words = config.fullText.split(' ');
                        const parts = [];
                        const hiddenWords = [];
                        const initSlots = [];

                        let lastIndex = 0;
                        
                        // We must process indices in order to split correctly
                        const sortedIndices = [...config.hiddenIndices].sort((a, b) => a - b);

                        sortedIndices.forEach((idx, i) => {
                            // Text before the hole
                            const textBefore = words.slice(lastIndex, idx).join(' ');
                            parts.push(textBefore); // Can be empty string if consecutive or start
                            
                            // The hidden word
                            hiddenWords.push(words[idx]);
                            initSlots.push(null);
                            
                            lastIndex = idx + 1;
                        });
                        
                        // Text after last hole
                        if (lastIndex < words.length) {
                            parts.push(words.slice(lastIndex).join(' '));
                        } else {
                            parts.push(""); // End part
                        }

                        setSentenceParts(parts);
                        setExpectedWords(hiddenWords);
                        setSlots(initSlots);

                        // Mix decoys and correct answers
                        const allOptions = [...hiddenWords, ...(config.decoys || [])];
                        setAvailableWords(allOptions.sort(() => Math.random() - 0.5));
                        
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
             // Fallback dev
             setSentenceParts(["Le chevalier", "son", "pour combattre le"]);
             setExpectedWords(["brandit", "épée", "dragon"]);
             setSlots([null, null, null]);
             setAvailableWords(["dragon", "épée", "brandit", "tarte", "chaussette"].sort(() => Math.random() - 0.5));
             setStatus('playing');
        }
    }, [gameId]);

    const handleWordClick = (word) => {
        // Find first empty slot
        const emptyIndex = slots.indexOf(null);
        if (emptyIndex !== -1) {
            const newSlots = [...slots];
            newSlots[emptyIndex] = word;
            setSlots(newSlots);
            
            setAvailableWords(availableWords.filter(w => w !== word));
        }
    };

    const handleSlotClick = (index) => {
        const word = slots[index];
        if (word) {
            const newSlots = [...slots];
            newSlots[index] = null;
            setSlots(newSlots);
            
            setAvailableWords([...availableWords, word]);
        }
    };

    const handleValidate = () => {
        // Check if all slots filled
        if (slots.some(s => s === null)) return;

        // Check correctness
        const isCorrect = slots.every((word, index) => word === expectedWords[index]);
        
        if (isCorrect) {
            setStatus('won');
            setTimeout(onWin, 1500);
        } else {
             // Shake effect
             setShake(true);
             setTimeout(() => setShake(false), 500);
             
             // Reset
             const currentSlots = [...slots];
             const returnedWords = currentSlots.filter(w => w !== null);
             
             setTimeout(() => {
                 setSlots(new Array(expectedWords.length).fill(null));
                 setAvailableWords(prev => [...prev, ...returnedWords].sort(() => Math.random() - 0.5));
             }, 500);
        }
    };

    if (status === 'loading') return <div className="text-white text-center p-8">Ouverture du grimoire...</div>;
    if (status === 'error') return <div className="text-red-500 text-center p-8">Le grimoire est scellé (Erreur).</div>;

    return (
        <div className={`flex flex-col items-center justify-center p-8 bg-indigo-950 border-4 border-purple-400 rounded-xl shadow-2xl max-w-2xl mx-auto text-white relative transition-transform ${shake ? 'translate-x-[-10px]' : ''}`} style={shake ? {animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'} : {}}>
             <style>{`
                @keyframes shake {
                  10%, 90% { transform: translate3d(-1px, 0, 0); }
                  20%, 80% { transform: translate3d(2px, 0, 0); }
                  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                  40%, 60% { transform: translate3d(4px, 0, 0); }
                }
             `}</style>

             <h2 className="text-purple-300 font-serif text-3xl mb-8 italic">Le Grimoire Perdu</h2>
             
             {/* Sentence Area */}
             <div className="flex flex-wrap items-center justify-center gap-3 text-xl mb-12 leading-loose">
                 {sentenceParts.map((part, index) => (
                     <React.Fragment key={index}>
                         {part && <span>{part}</span>}
                         {index < expectedWords.length && (
                             <Slot word={slots[index]} onClick={() => handleSlotClick(index)} />
                         )}
                     </React.Fragment>
                 ))}
                 <span>.</span>
             </div>

             {/* Word Bank */}
             <div className="flex flex-wrap justify-center gap-4 mb-8">
                 {availableWords.map((word, i) => (
                     <button
                        key={`${word}-${i}`}
                        onClick={() => handleWordClick(word)}
                        className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold shadow-md transition-transform hover:scale-110"
                     >
                         {word}
                     </button>
                 ))}
             </div>
             
             {/* Actions */}
             <button
                onClick={handleValidate}
                disabled={slots.some(s => s === null)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                 Incantation !
             </button>
             
             {status === 'won' && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-900/90 z-20 rounded-xl">
                    <div className="text-yellow-400 font-serif text-4xl animate-bounce">Magie Réussie !</div>
                </div>
            )}
        </div>
    );
}

function Slot({ word, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`
                min-w-[100px] h-10 border-b-2 border-white flex items-center justify-center cursor-pointer transition-colors
                ${word ? 'text-yellow-300 font-bold bg-white/10 rounded-t' : 'bg-white/5'}
            `}
        >
            {word || "?"}
        </div>
    )
}
