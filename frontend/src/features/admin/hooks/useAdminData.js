import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: adminService.getUsers
  });
};

export const useAdminBooks = () => {
  return useQuery({
    queryKey: ['adminBooks'],
    queryFn: adminService.getAdminBooks
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: adminService.getReports
  });
};
