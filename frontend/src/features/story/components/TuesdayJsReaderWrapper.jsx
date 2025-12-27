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
                document.addEventListener('creation_dialog', function() {
                     const storyVars = window.story_json && window.story_json.parameters && window.story_json.parameters.variables;
                     if (storyVars && storyVars.trigger_game_id) {
                         window.parent.postMessage({ 
                             type: 'TRIGGER_GAME', 
                             gameId: storyVars.trigger_game_id 
                         }, '*');
                         
                         // Pause interactions in the engine
                         const engineEl = document.getElementById('tuesday');
                         if (engineEl) engineEl.style.pointerEvents = 'none';
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
                <MiniGameOverlay id={miniGameId} onComplete={handleGameComplete} />
            )}
        </div>
    );
}
