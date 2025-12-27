import React, { useRef, useEffect } from 'react';

export default function TuesdayJsReaderWrapper({ storyJson, onQuit }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!storyJson) return;

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
                    }
                });

                window.parent.postMessage({ type: 'READER_READY' }, '*');
            </script>
        </body>
        </html>
    `;

    return (
        <iframe
            ref={iframeRef}
            srcDoc={iframeContent}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Tuesday Reader"
            sandbox="allow-scripts allow-same-origin"
        />
    );
}