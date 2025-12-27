import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editorService } from "../services/editor.service";

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: editorService.getCollections,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => editorService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useRemoveBookFromCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, bookId }) =>
      editorService.removeBookFromCollection(collectionId, bookId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.collectionId],
      });
    },
  });
};

export const useCollection = (collectionId) => {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => editorService.getCollectionById(collectionId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!collectionId,
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => editorService.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useUploadCover = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, file }) =>
      editorService.uploadCover(collectionId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.collectionId],
      });
    },
  });
};
