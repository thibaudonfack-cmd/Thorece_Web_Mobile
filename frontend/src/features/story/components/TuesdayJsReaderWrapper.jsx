import React, { useRef, useEffect, useState } from 'react';
import MiniGameOverlay from '../../minigames/components/MiniGameOverlay';

export default function TuesdayJsReaderWrapper({ storyJson, onQuit }) {
    const iframeRef = useRef(null);
    const [miniGameId, setMiniGameId] = useState(null);

    const handleGameComplete = (success, targetScene) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'GAME_COMPLETE', scene: targetScene, success },
                '*'
            );
        }
        setMiniGameId(null);
    };

    useEffect(() => {
        const handleDialogCreation = () => {
            // 1. Récupération défensive de l'état du moteur
            // Tuesday JS met à jour ces variables globales à chaque changement de dialogue
            if (typeof window.tuesday === 'undefined' && typeof window.scene === 'undefined') return;

            const currentSceneIndex = window.scene;
            const currentDialogIndex = window.dialog;
            const story = window.story_json;

            // 2. Vérification de l'existence du bloc dans le JSON
            if (story && 
                story[window.tue_story] && 
                story[window.tue_story][currentSceneIndex]) {
                
                const currentScene = story[window.tue_story][currentSceneIndex];
                
                if (currentScene.dialogs && currentScene.dialogs[currentDialogIndex]) {
                    const currentBlock = currentScene.dialogs[currentDialogIndex];

                    // 3. Recherche de la variable déclencheur DANS LE BLOC ACTIF
                    if (currentBlock.variables && Array.isArray(currentBlock.variables)) {
                        const gameTrigger = currentBlock.variables.find(v => v.name === "trigger_game_id");
                        
                        if (gameTrigger) {
                            console.log("🧩 Mini-jeu détecté sur ce dialogue ! ID:", gameTrigger.value);
                            
                            // A. Pause visuelle du moteur (empêcher de cliquer sur 'Suivant')
                            // Note: We access the element inside the iframe via iframeRef
                            if (iframeRef.current) {
                                const tuesdayUi = iframeRef.current.contentWindow.document.getElementById('tuesday');
                                if (tuesdayUi) tuesdayUi.style.pointerEvents = 'none';
                            }

                            // B. Déclenchement de l'affichage React
                            setMiniGameId(gameTrigger.value);
                        }
                    }
                }
            }
        };

        const handleMessage = (event) => {
            if (event.source !== iframeRef.current?.contentWindow) return;

            if (event.data.type === 'READER_READY') {
                iframeRef.current.contentWindow.postMessage(
                    { type: 'LOAD_STORY', story: storyJson },
                    '*'
                );
            }
        };

        window.addEventListener('message', handleMessage);
        // Abonnement à l'événement du moteur
        document.addEventListener('creation_dialog', handleDialogCreation);

        return () => {
            window.removeEventListener('message', handleMessage);
            document.removeEventListener('creation_dialog', handleDialogCreation);
        };
    }, [storyJson]);

    if (!storyJson) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 font-medium">Les données de l'histoire sont manquantes.</p>
                </div>
            </div>
        );
    }

    const iframeContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <style>
                body { margin: 0; overflow: hidden; background: black; }
                #tuesday { width: 100vw; height: 100vh; visibility: hidden; opacity: 0; transition: opacity 0.5s; }
            </style>
        </head>
        <body>
            <div id="tuesday"></div>
            <script src="/tuesday.js"></script>
            <script>
                // Fonction utilitaire pour corriger les URLs pour le frontend
                const fixImageUrls = (json) => {
                    let jsonString = JSON.stringify(json);
                    // Remplace l'URL interne Docker par l'URL publique
                    jsonString = jsonString.replace(/http:\\/\\/seaweedfs:8888/g, "http://localhost:8888"); 
                    return JSON.parse(jsonString);
                };

                // Listen for creation_dialog event to detect game triggers and sync with parent
                document.addEventListener('creation_dialog', function() {
                     // Sync internal state to parent window for its useEffect to work
                     window.parent.tue_story = window.tue_story;
                     window.parent.scene = window.scene;
                     window.parent.dialog = window.dialog;
                     window.parent.story_json = window.story_json;
                     window.parent.tuesday = window.tuesday;

                     // Dispatch event on parent document
                     window.parent.document.dispatchEvent(new CustomEvent('creation_dialog'));
                });

                window.addEventListener('message', function(event) {
                    if (event.data.type === 'LOAD_STORY') {
                        let story = event.data.story;

                        if (typeof story === 'string') {
                            try {
                                story = JSON.parse(story);
                            } catch (parseErr) {
                                console.error("Failed to parse story JSON:", parseErr);
                                return;
                            }
                        }
                        
                        // Correction des URLs
                        story = fixImageUrls(story);

                        if (typeof load_story === 'function') {
                            try {
                                // 1. IMPORTANT : On force l'élément racine à être visible
                                const tuesdayElement = document.getElementById('tuesday');
                                if (tuesdayElement) {
                                    tuesdayElement.style.visibility = 'visible';
                                    tuesdayElement.style.opacity = '1';
                                }

                                // 2. Lancement manuel sécurisé
                                setTimeout(() => {
                                    load_story('data', story);
                                }, 100);
                                
                            } catch (err) {
                                console.error("Error calling load_story:", err);
                            }
                        } else {
                            console.error("load_story function not found");
                        }
                    } else if (event.data.type === 'GAME_COMPLETE') {
                        // Resume interactions
                        const engineEl = document.getElementById('tuesday');
                        if (engineEl) engineEl.style.pointerEvents = 'auto';

                        // Clear trigger to avoid re-looping
                        if (window.story_json && window.story_json[window.tue_story] && window.story_json[window.tue_story][window.scene]) {
                             const dialogObj = window.story_json[window.tue_story][window.scene].dialogs[window.dialog];
                             if (dialogObj && dialogObj.variables) {
                                 dialogObj.variables = dialogObj.variables.filter(function(v) { return v.name !== 'trigger_game_id'; });
                             }
                        }

                        if (typeof go_to === 'function' && event.data.scene) {
                            go_to(event.data.scene);
                        } else {
                            // If no scene provided, maybe just continue
                            console.log("No redirection scene provided, continuing...");
                        }
                    }
                });

                window.parent.postMessage({ type: 'READER_READY' }, '*');
            </script>
        </body>
        </html>
    `;

    return (
        <div className="relative w-full h-full">
            <iframe
                ref={iframeRef}
                srcDoc={iframeContent}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Tuesday Reader"
                sandbox="allow-scripts allow-same-origin"
            />
            {miniGameId && (
                <MiniGameOverlay id={miniGameId} onComplete={handleGameComplete} />
            )}
        </div>
    );
}
