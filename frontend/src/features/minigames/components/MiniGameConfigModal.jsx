import React, { useState, useEffect } from 'react';
import { minigameService } from '../services/minigame.service';

const GAME_TYPES = [
    { value: 'IMAGE_PUZZLE', label: '🧩 Puzzle Visuel' },
    { value: 'FILL_BLANKS', label: '📝 Grimoire Perdu (Texte à trous)' }
];

export default function MiniGameConfigModal({ isOpen, onClose, onSave, storyBlocks, existingId = null }) {
    const [config, setConfig] = useState({
        type: 'IMAGE_PUZZLE',
        solution: '', // Used for DIGITAL_LOCK
        xpReward: 10,
        successTarget: '',
        failTarget: '',
        name: 'Nouveau jeu',

        // Fields for FILL_BLANKS
        fullText: 'Le chevalier mange une pomme',
        hiddenIndices: [],
        decoys: '',

        // Fields for IMAGE_PUZZLE
        imageUrl: '',
        gridSize: 3,
        timeLimit: 0,
        instructionText: 'Assemblez les pièces pour révéler l\'image mystère!'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load existing data when modal opens with an ID
    useEffect(() => {
        if (isOpen && existingId) {
            setLoading(true);
            minigameService.getById(existingId)
                .then(data => {
                    let parsedContent = {};
                    try {
                        parsedContent = JSON.parse(data.contentJson);
                    } catch (e) {
                        console.error("Failed to parse contentJson", e);
                    }

                    setConfig(prev => ({
                        ...prev,
                        name: data.name,
                        type: data.type,
                        xpReward: data.xpReward,
                        successTarget: data.successPageNumber || '',
                        failTarget: data.failurePageNumber || '',
                        // Restore specific fields
                        solution: parsedContent.solution || '',
                        fullText: parsedContent.fullText || prev.fullText,
                        hiddenIndices: parsedContent.hiddenIndices || [],
                        decoys: Array.isArray(parsedContent.decoys) ? parsedContent.decoys.join(', ') : '',
                        // IMAGE_PUZZLE fields
                        imageUrl: parsedContent.imageUrl || '',
                        gridSize: parsedContent.gridSize || 3,
                        timeLimit: parsedContent.timeLimit || 0,
                        instructionText: parsedContent.instructionText || prev.instructionText
                    }));
                })
                .catch(err => setError("Impossible de charger le jeu : " + err.message))
                .finally(() => setLoading(false));
        } else if (isOpen && !existingId) {
            // Reset for new creation
            setConfig({
                type: 'IMAGE_PUZZLE',
                solution: '',
                xpReward: 10,
                successTarget: '',
                failTarget: '',
                name: 'Nouveau jeu',
                fullText: 'Le chevalier mange une pomme',
                hiddenIndices: [],
                decoys: '',
                imageUrl: '',
                gridSize: 3,
                timeLimit: 0,
                instructionText: 'Assemblez les pièces pour révéler l\'image mystère!'
            });
        }
    }, [isOpen, existingId]);

    if (!isOpen) return null;

    const toggleHiddenWord = (index) => {
        setConfig(prev => {
            const newIndices = prev.hiddenIndices.includes(index)
                ? prev.hiddenIndices.filter(i => i !== index)
                : [...prev.hiddenIndices, index];
            return { ...prev, hiddenIndices: newIndices };
        });
    };

    const renderWordSelector = () => {
        if (!config.fullText) return null;
        const words = config.fullText.split(' ');
        
        return (
            <div className="flex flex-wrap gap-2 p-4 bg-stone-100 rounded-lg border border-stone-300 mb-4">
                {words.map((word, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => toggleHiddenWord(index)}
                        className={`px-2 py-1 rounded transition-colors ${
                            config.hiddenIndices.includes(index)
                                ? 'bg-purple-600 text-white shadow-inner font-bold'
                                : 'bg-white hover:bg-gray-200 text-gray-800 border border-gray-300'
                        }`}
                    >
                        {word}
                    </button>
                ))}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let contentJson = "";

            if (config.type === 'DIGITAL_LOCK') {
                contentJson = JSON.stringify({ solution: config.solution });
            } else if (config.type === 'FILL_BLANKS') {
                contentJson = JSON.stringify({
                    fullText: config.fullText,
                    hiddenIndices: config.hiddenIndices,
                    decoys: config.decoys.split(',').map(s => s.trim()).filter(s => s.length > 0)
                });
            } else if (config.type === 'IMAGE_PUZZLE') {
                contentJson = JSON.stringify({
                    imageUrl: config.imageUrl,
                    gridSize: parseInt(config.gridSize),
                    timeLimit: parseInt(config.timeLimit) || null,
                    instructionText: config.instructionText
                });
            }

            // 1. Prepare payload for Backend
            const backendPayload = {
                type: config.type,
                name: config.name,
                xpReward: parseInt(config.xpReward),
                contentJson: contentJson,
                successPageNumber: config.successTarget ? parseInt(config.successTarget) : null,
                failurePageNumber: config.failTarget ? parseInt(config.failTarget) : null
            };

            let savedGame;
            if (existingId) {
                savedGame = await minigameService.update(existingId, backendPayload);
            } else {
                savedGame = await minigameService.create(backendPayload);
            }

            // 2. Return data to parent for Tuesday JS Injection
            onSave(savedGame.id, {
                ...config,
                id: savedGame.id
            });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-stone-800">
                    {existingId ? '✏️ Modifier l\'Épreuve' : '🧩 Configurer une Épreuve'}
                </h2>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Game Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type d'épreuve</label>
                        <select 
                            value={config.type}
                            onChange={e => setConfig({...config, type: e.target.value})}
                            className="w-full border rounded-md p-2 bg-gray-50"
                        >
                            {GAME_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom (interne)</label>
                        <input
                            type="text"
                            value={config.name}
                            onChange={e => setConfig({...config, name: e.target.value})}
                            className="w-full border rounded-md p-2"
                            required
                        />
                    </div>

                    {/* DYNAMIC CONTENT CONFIGURATION */}
                    {config.type === 'IMAGE_PUZZLE' && (
                        <div className="border border-purple-200 rounded p-4 bg-gradient-to-br from-purple-50 to-indigo-50 space-y-4">
                            <h3 className="text-lg font-bold text-purple-900 mb-3">⚙️ Configuration du Puzzle</h3>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    🖼️ URL de l'image
                                </label>
                                <input
                                    type="url"
                                    value={config.imageUrl}
                                    onChange={e => setConfig({...config, imageUrl: e.target.value})}
                                    className="w-full border border-purple-300 rounded-md p-2"
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                                <p className="text-xs text-purple-600 mt-1">
                                    💡 Conseil: Utilisez une image carrée pour un meilleur rendu
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    🎚️ Difficulté (Taille de la grille)
                                </label>
                                <select
                                    value={config.gridSize}
                                    onChange={e => setConfig({...config, gridSize: e.target.value})}
                                    className="w-full border border-purple-300 rounded-md p-2 bg-white"
                                >
                                    <option value={3}>3x3 - Facile (9 pièces) - 6-8 ans</option>
                                    <option value={4}>4x4 - Moyen (16 pièces) - 9-12 ans</option>
                                    <option value={5}>5x5 - Difficile (25 pièces) - 13+ ans</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    ⏱️ Temps limite (secondes) - Optionnel
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={config.timeLimit}
                                    onChange={e => setConfig({...config, timeLimit: e.target.value})}
                                    className="w-full border border-purple-300 rounded-md p-2"
                                    placeholder="0 = illimité"
                                />
                                <p className="text-xs text-purple-600 mt-1">
                                    ⚠️ Laissez 0 pour un puzzle sans limite de temps
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-900 mb-1">
                                    📝 Texte d'instruction (3 phrases max)
                                </label>
                                <textarea
                                    value={config.instructionText}
                                    onChange={e => setConfig({...config, instructionText: e.target.value})}
                                    className="w-full border border-purple-300 rounded-md p-2"
                                    rows={2}
                                    maxLength={200}
                                    placeholder="Assemblez les pièces du puzzle pour découvrir le secret!"
                                />
                                <p className="text-xs text-purple-600 mt-1">
                                    {config.instructionText.length}/200 caractères
                                </p>
                            </div>

                            {/* Preview */}
                            {config.imageUrl && (
                                <div className="mt-4 p-3 bg-white rounded-lg border-2 border-purple-300">
                                    <p className="text-sm font-medium text-purple-900 mb-2">Aperçu de l'image:</p>
                                    <img
                                        src={config.imageUrl}
                                        alt="Aperçu"
                                        className="max-w-full h-48 object-cover rounded border-2 border-purple-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {config.type === 'DIGITAL_LOCK' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code Secret (ex: 1234)
                            </label>
                            <input
                                type="text"
                                value={config.solution}
                                onChange={e => setConfig({...config, solution: e.target.value})}
                                className="w-full border rounded-md p-2 font-mono tracking-widest"
                                required
                                maxLength={8}
                            />
                        </div>
                    )}

                    {config.type === 'FILL_BLANKS' && (
                        <div className="border border-purple-200 rounded p-4 bg-purple-50">
                            <label className="block text-sm font-medium text-purple-900 mb-2">
                                1. Phrase complète
                            </label>
                            <textarea
                                value={config.fullText}
                                onChange={e => setConfig({...config, fullText: e.target.value, hiddenIndices: []})}
                                className="w-full border rounded-md p-2 mb-4"
                                rows={2}
                            />
                            
                            <label className="block text-sm font-medium text-purple-900 mb-2">
                                2. Cliquez sur les mots à cacher
                            </label>
                            {renderWordSelector()}

                            <label className="block text-sm font-medium text-purple-900 mb-1">
                                3. Mots leurres (séparés par des virgules)
                            </label>
                            <input
                                type="text"
                                value={config.decoys}
                                onChange={e => setConfig({...config, decoys: e.target.value})}
                                className="w-full border rounded-md p-2"
                                placeholder="tarte, chaussette, dragon"
                            />
                        </div>
                    )}

                    {/* XP Reward */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Récompense XP</label>
                        <input
                            type="number"
                            min="0"
                            value={config.xpReward}
                            onChange={e => setConfig({...config, xpReward: e.target.value})}
                            className="w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Success Target */}
                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Si Succès (Redirection)</label>
                            <select
                                value={config.successTarget}
                                onChange={e => setConfig({...config, successTarget: e.target.value})}
                                className="w-full border border-green-200 rounded-md p-2 bg-green-50"
                                required
                            >
                                <option value="">Choisir une scène...</option>
                                {storyBlocks.map(b => (
                                    <option key={b.id} value={b.id}>{b.name || `Scene ${b.id}`}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fail Target */}
                        <div>
                            <label className="block text-sm font-medium text-red-700 mb-1">Si Échec (Redirection)</label>
                            <select
                                value={config.failTarget}
                                onChange={e => setConfig({...config, failTarget: e.target.value})}
                                className="w-full border border-red-200 rounded-md p-2 bg-red-50"
                                required
                            >
                                <option value="">Choisir une scène...</option>
                                {storyBlocks.map(b => (
                                    <option key={b.id} value={b.id}>{b.name || `Scene ${b.id}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Créer l\'épreuve'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
