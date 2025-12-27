import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storyService } from '../services/story.service';

// --- 1. HOOKS DE LECTURE (CONTEXTES) ---

export const useBook = (id) => {
    return useQuery({
        queryKey: ['books', id],
        queryFn: () => storyService.getBookById(id),
        enabled: !!id,
        refetchOnWindowFocus: false
    });
};

export const useBookContent = (id, type = 'published') => {
    return useQuery({
        queryKey: ['books', id, 'content', type],
        queryFn: () => storyService.getBookContent(id, type),
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: false // Don't retry if 404 (content doesn't exist yet)
    });
};

export const useAuthorBooks = () => {
    return useQuery({
        queryKey: ['books', 'author'],
        queryFn: storyService.getAuthorBooks,
        staleTime: 0,
        refetchOnWindowFocus: true
    });
};

export const useEditorPoolBooks = () => {
    return useQuery({
        queryKey: ['books', 'pool'],
        queryFn: storyService.getPublishedBooksPool,
        staleTime: 0,
        refetchOnWindowFocus: true
    });
};

export const usePublicBooks = () => {
    return useQuery({
        queryKey: ['books', 'public'],
        queryFn: storyService.getPublicCollectionsBooks,
        staleTime: 0,
        refetchOnWindowFocus: true

    });
};

export const usePersonalBooks = () => {
    return useQuery({
        queryKey: ['books', 'bag'],
        queryFn: storyService.getPersonalBagBooks,
        staleTime: 0,
        refetchOnWindowFocus: true
    });
};

// --- 2. HOOKS D'ACTION (MUTATIONS) ---

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookData) => storyService.createBook(bookData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', 'author'] });
        }
    });
};

export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}) => storyService.updateBook(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => storyService.deleteBook(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        }
    });
};

export const useAddToCollection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, collectionId }) => storyService.addBookToCollection(bookId, collectionId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['books', 'public'] });
            queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        }
    });
};

export const useAddToBag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookId) => storyService.addToBag(bookId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
};
export const useRemoveFromBag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookId) => storyService.removeFromBag(bookId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books', 'bag'] });
        }
    });
};

export const useUploadBookCover = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, file }) => storyService.uploadCover(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
};

export const useSaveStoryContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, content, status }) => storyService.saveStoryContent(id, content, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        }
    });
};