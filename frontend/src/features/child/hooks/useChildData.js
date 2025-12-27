import { useQuery } from '@tanstack/react-query';
import { childService } from '../services/child.service';

export const useCharacters = () => {
    return useQuery({
        queryKey: ['characters'],
        queryFn: childService.getCharacters
    });
};
