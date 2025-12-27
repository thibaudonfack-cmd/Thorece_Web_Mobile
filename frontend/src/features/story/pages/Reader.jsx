import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TuesdayJsReaderWrapper from '../components/TuesdayJsReaderWrapper';
import { useBookContent } from '../hooks/useBooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Reader() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const { data: bookContent, isLoading: isContentLoading, error: contentError } = useBookContent(bookId, 'published');

    const [storyJsonFromS3, setStoryJsonFromS3] = useState(null);
    const [s3FetchError, setS3FetchError] = useState(null);
    const [isS3Fetching, setIsS3Fetching] = useState(false);

    useEffect(() => {
        if (bookContent?.s3OriginalUrl) {
            setIsS3Fetching(true);
            fetch(bookContent.s3OriginalUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Impossible de charger le contenu de l'histoire depuis S3");
                    return res.json();
                })
                .then(data => {
                    setStoryJsonFromS3(data);
                    setS3FetchError(null);
                })
                .catch(err => {
                    console.error("Erreur chargement JSON depuis S3:", err);
                    setS3FetchError(err.message);
                })
                .finally(() => {
                    setIsS3Fetching(false);
                });
        } else if (bookContent && !bookContent.s3OriginalUrl) {
            setS3FetchError("Contenu publié non disponible.");
        }
    }, [bookContent]);

    const handleQuitReading = () => {
        navigate(-1);
    };

    if (isContentLoading || isS3Fetching) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Chargement de l'histoire...</p>
                </div>
            </div>
        );
    }

    if (contentError || s3FetchError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Erreur de lecture</h3>
                    <p className="text-gray-600 mb-6">{s3FetchError || contentError?.message || "Une erreur est survenue"}</p>
                    <button
                        onClick={handleQuitReading}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    if (!storyJsonFromS3) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 font-medium">Contenu de l'histoire non disponible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-black">
            <button
                onClick={handleQuitReading}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all font-medium text-sm"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Quitter
            </button>

            <TuesdayJsReaderWrapper storyJson={storyJsonFromS3} onQuit={handleQuitReading} />
        </div>
    );
}