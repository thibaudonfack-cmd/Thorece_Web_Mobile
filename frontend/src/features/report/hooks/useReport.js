import { useMutation } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export const useCreateReport = () => {
    return useMutation({
        mutationFn: (data) => reportService.createReport(data),
        onSuccess: ()  => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });
};