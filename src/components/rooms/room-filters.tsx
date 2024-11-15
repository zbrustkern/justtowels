'use client';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RoomStatus, RoomType } from '@/types/room';

interface RoomFiltersProps {
  filters: {
    status: RoomStatus | 'all';
    type: RoomType | 'all';
    floor: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function RoomFilters({ filters, onFilterChange }: RoomFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange('status', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="vacant">Vacant</SelectItem>
          <SelectItem value="occupied">Occupied</SelectItem>
          <SelectItem value="cleaning">Cleaning</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onFilterChange('type', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="deluxe">Deluxe</SelectItem>
          <SelectItem value="suite">Suite</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.floor}
        onValueChange={(value) => onFilterChange('floor', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by floor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Floors</SelectItem>
          <SelectItem value="1">1st Floor</SelectItem>
          <SelectItem value="2">2nd Floor</SelectItem>
          <SelectItem value="3">3rd Floor</SelectItem>
          <SelectItem value="4">4th Floor</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search room number..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
      />
    </div>
  );
}