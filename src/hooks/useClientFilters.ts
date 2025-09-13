import { useMemo, useState } from 'react';
import { ClientWithRole } from './useClientData';

interface UseClientFiltersProps {
  clients: ClientWithRole[];
}

export const useClientFilters = ({ clients }: UseClientFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredClients = useMemo(() => {
    if (!clients) return [];

    return clients.filter(client => {
      const matchesSearch = client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' ||
                         (roleFilter === 'admin' && client.role === 'admin') ||
                         (roleFilter === 'user' && (!client.role || client.role === 'user'));

      return matchesSearch && matchesRole;
    });
  }, [clients, searchTerm, roleFilter]);

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredClients,
  };
};