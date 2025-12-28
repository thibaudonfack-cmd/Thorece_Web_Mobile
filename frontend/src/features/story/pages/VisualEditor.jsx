import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CloudArrowUpIcon, RocketLaunchIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';
import { useSaveStoryContent, useBook, useBookContent } from '../hooks/useBooks';
import MiniGameConfigModal from '../../minigames/components/MiniGameConfigModal';

export default function VisualEditor() {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const iframeRef = useRef(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [isMiniGameModalOpen, setIsMiniGameModalOpen] = useState(false);
    const [storyBlocks, setStoryBlocks] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState(null);

    const { data: book } = useBook(storyId);
    const { data: bookContent } = useBookContent(storyId, 'draft');
    const saveContentMutation = useSaveStoryContent();

    const handleSaveToBackend = useCallback((payload, status) => {
        saveContentMutation.mutate(
            {
                id: storyId,
                content: payload.content,
                status: status
            },
            {
                onSuccess: () => {
                    alert(status === 'PUBLISHED' ? 'Histoire publiée !' : 'Brouillon sauvegardé.');
                },
                onError: (error) => {
                    console.error('Erreur sauvegarde content :', error);
                    const backendMsg = error.response?.data?.message || error.message;
                    alert("Erreur de sauvegarde : " + backendMsg);
                }
            }
        );
    }, [storyId, saveContentMutation]);

    const handleIframeMessage = useCallback((event) => {
        // if (event.origin !== import.meta.env.VITE_DOMAINE_URL) return; // Sometimes problematic in dev

        const { type, payload } = event.data;
        if (!type) return;

        switch (type) {
            case 'SAVE_STORY_DRAFT':
                handleSaveToBackend(payload, 'DRAFT');
                break;
            case 'BUILD_SUCCESS':
                handleSaveToBackend(payload, 'PUBLISHED');
                break;
            case 'LOAD_PROJECT_SUCCESS':
                break;
            case 'STORY_BLOCKS_LIST':
                setStoryBlocks(payload);
                setIsMiniGameModalOpen(true);
                break;
            case 'BLOCK_SELECTED':
                // Check if the selected block has a trigger_game_id variable
                if (payload && payload.variables) {
                    const gameVar = payload.variables.find(v => v[0] === 'trigger_game_id');
                    setSelectedGameId(gameVar ? gameVar[2] : null);
                } else {
                    setSelectedGameId(null);
                }
                break;
            case 'MINIGAME_ADDED_SUCCESS':
                // Refresh selection state if needed
                alert("Épreuve configurée avec succès !");
                break;
            case 'ERROR':
                alert("Erreur éditeur : " + (payload.message || 'Inconnue'));
                break;
            default:
                break;
        }
    }, [handleSaveToBackend]);

    useEffect(() => {
        window.addEventListener('message', handleIframeMessage);
        return () => window.removeEventListener('message', handleIframeMessage);
    }, [handleIframeMessage]);

    useEffect(() => {
        if (iframeLoaded && bookContent?.s3OriginalUrl) {
            fetch(bookContent.s3OriginalUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch project content");
                    return res.json();
                })
                .then(jsonContent => {
                    iframeRef.current?.contentWindow.postMessage({
                        type: 'LOAD_PROJECT',
                        payload: { jsonContent }
                    }, '*');
                })
                .catch(err => console.error("Erreur chargement contenu projet:", err));
        }
    }, [iframeLoaded, bookContent?.s3OriginalUrl]);

    const requestSaveDraft = () => {
        iframeRef.current?.contentWindow.postMessage({ type: 'REQUEST_SAVE' }, '*');
    };

    const requestPublish = () => {
        let message;
        if (isPublished) {
            message = "Voulez-vous mettre à jour la version publiée avec ce contenu ?";
        } else {
            message = "ATTENTION : Vous êtes sur le point de publier cette histoire.\n\nUne fois publiée, elle sera visible par tous. Vous pourrez ensuite publier des mises à jour.\n\nÊtes-vous sûr de vouloir continuer ?";
        }

        if (window.confirm(message)) {
            iframeRef.current?.contentWindow.postMessage({ type: 'REQUEST_BUILD' }, '*');
        }
    };

    const handleOpenMiniGameModal = () => {
        // Request blocks from iframe first to populate select targets
        iframeRef.current?.contentWindow.postMessage({ type: 'GET_STORY_BLOCKS' }, '*');
    };

    const handleSaveMiniGame = (gameId, config) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage({
                type: 'ADD_MINIGAME_TO_BLOCK',
                payload: { gameId, config }
            }, '*');

            // Force automatic save of the story JSON to persist the link
            setTimeout(() => {
                iframeRef.current.contentWindow.postMessage({ type: 'REQUEST_SAVE' }, '*');
            }, 500);
        }
    };

    const isPublished = book?.status === 'PUBLISHED';
    const isLoading = saveContentMutation.isPending;

    return (
        <div className="flex flex-col h-screen w-full bg-white">
            <div className="flex items-center justify-between px-4 py-2 border-b h-16 bg-gray-50 shadow-sm z-10">
                <button
                    onClick={() => navigate(`/author`)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" /> Quitter
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleOpenMiniGameModal}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            selectedGameId 
                            ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                            : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                        }`}
                    >
                        <PuzzlePieceIcon className="w-5 h-5" />
                        {selectedGameId ? 'Modifier Épreuve' : 'Ajouter Épreuve'}
                    </button>

                    <button
                        onClick={requestSaveDraft}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                    >
                        <CloudArrowUpIcon className="w-5 h-5 text-blue-500" />
                        {isLoading ? '...' : 'Brouillon'}
                    </button>

                    <button
                        onClick={requestPublish}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 ${
                            isPublished 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        <RocketLaunchIcon className="w-5 h-5" />
                        {isPublished ? 'Mettre à jour' : 'Publier'}
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full h-full relative bg-gray-100">
                <iframe
                    ref={iframeRef}
                    src="/tuesday_visual.html"
                    title="Tuesday Editor"
                    className="absolute inset-0 w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                    onLoad={() => setIframeLoaded(true)}
                />
            </div>

            <MiniGameConfigModal 
                isOpen={isMiniGameModalOpen}
                onClose={() => setIsMiniGameModalOpen(false)}
                onSave={handleSaveMiniGame}
                storyBlocks={storyBlocks}
                existingId={selectedGameId}
            />
        </div>
    );
}