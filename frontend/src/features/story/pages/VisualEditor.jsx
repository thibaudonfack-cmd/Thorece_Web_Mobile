import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CloudArrowUpIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useSaveStoryContent, useBook, useBookContent } from '../hooks/useBooks';

export default function VisualEditor() {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const iframeRef = useRef(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);

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
                    alert("Erreur : " + error.message);
                }
            }
        );
    }, [storyId, saveContentMutation]);

    const handleIframeMessage = useCallback((event) => {
        if (event.origin !== import.meta.env.VITE_DOMAINE_URL) return;

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

    const isPublished = book?.status === 'PUBLISHED';

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
        </div>
    );
}