import React, { useRef, useEffect, useState } from 'react';
import MiniGameOverlay from '../../minigames/components/MiniGameOverlay';

export default function TuesdayJsReaderWrapper({ storyJson, onQuit }) {
    const iframeRef = useRef(null);
    const [miniGameId, setMiniGameId] = useState(null);
    const [miniGameScenes, setMiniGameScenes] = useState({ success: null, fail: null });

    const handleGameComplete = (success, targetScene) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'GAME_COMPLETE', scene: targetScene, success },
                '*'
            );
        }
        setMiniGameId(null);
        setMiniGameScenes({ success: null, fail: null });
    };

    useEffect(() => {
        if (!storyJson) return;

        const handleMessage = (event) => {
            if (event.source !== iframeRef.current?.contentWindow) return;

            if (event.data.type === 'READER_READY') {
                iframeRef.current.contentWindow.postMessage(
                    { type: 'LOAD_STORY', story: storyJson },
                    '*'
                );
            } else if (event.data.type === 'TRIGGER_GAME') {
                setMiniGameId(event.data.gameId);
                setMiniGameScenes({
                    success: event.data.successScene,
                    fail: event.data.failScene
                });
            }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
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
                #tuesday { width: 100vw; height: 100vh; }
            </style>
        </head>
        <body>
            <div id="tuesday"></div>
            <script src="/tuesday.js"></script>
            <script>
                // Listen for creation_dialog event to detect game triggers
                // IMPORTANT: The event is dispatched on the 'tuesday' element, not on document
                window.addEventListener('load', function() {
                    const tuesdayElement = document.getElementById('tuesday');
                    if (tuesdayElement) {
                        tuesdayElement.addEventListener('creation_dialog', function() {
                            console.log('🎮 [MINIGAME] creation_dialog event triggered');

                            // Check current scene/dialog variables in engine state
                            const currentSceneId = window.tue_story;
                            const sceneIdx = window.scene;
                            const dialogIdx = window.dialog;

                            console.log('🎮 [MINIGAME] Current position:', { currentSceneId, sceneIdx, dialogIdx });

                     if (window.story_json && window.story_json[currentSceneId] && window.story_json[currentSceneId][sceneIdx]) {
                         const sceneObj = window.story_json[currentSceneId][sceneIdx];
                         if (sceneObj.dialogs && sceneObj.dialogs[dialogIdx]) {
                             const dialogObj = sceneObj.dialogs[dialogIdx];
                             console.log('🎮 [MINIGAME] Dialog variables:', dialogObj.variables);

                             if (dialogObj.variables) {
                                 const gameVar = dialogObj.variables.find(function(v) { return v[0] === 'trigger_game_id'; });
                                 if (gameVar) {
                                     console.log('🎮 [MINIGAME] Game trigger found! ID:', gameVar[2]);
                                     const successVar = dialogObj.variables.find(function(v) { return v[0] === 'success_target'; });
                                     const failVar = dialogObj.variables.find(function(v) { return v[0] === 'fail_target'; });

                                     const gameData = {
                                         type: 'TRIGGER_GAME',
                                         gameId: gameVar[2],
                                         successScene: successVar ? successVar[2] : null,
                                         failScene: failVar ? failVar[2] : null
                                     };

                                     console.log('🎮 [MINIGAME] Sending TRIGGER_GAME message:', gameData);
                                     window.parent.postMessage(gameData, '*');

                                     // Pause interactions in the engine
                                     const engineEl = document.getElementById('tuesday');
                                     if (engineEl) engineEl.style.pointerEvents = 'none';
                                 }
                             }
                         }
                     }
                        });
                    }
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

                        if (typeof load_story === 'function') {
                            try {
                                load_story('data', story);
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

                        // Clear trigger to avoid re-looping if staying on same scene (though usually we jump)
                        if (window.story_json && window.story_json.parameters && window.story_json.parameters.variables) {
                             window.story_json.parameters.variables.trigger_game_id = null;
                        }

                        if (typeof go_to === 'function' && event.data.scene) {
                            go_to(event.data.scene);
                        } else {
                            console.warn("go_to function missing or scene not provided");
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
                <MiniGameOverlay
                    id={miniGameId}
                    successScene={miniGameScenes.success}
                    failScene={miniGameScenes.fail}
                    onComplete={handleGameComplete}
                />
            )}
        </div>
    );
}
