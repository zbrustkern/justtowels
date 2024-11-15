'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MaintenanceType, MaintenanceRecord } from '@/types/maintenance';
import { addDays } from 'date-fns';

type MaintenanceFormData = Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

interface MaintenanceFormProps {
  roomId: string;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<MaintenanceRecord>;
}

export function MaintenanceForm({ roomId, onSubmit, onCancel, initialData }: MaintenanceFormProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    roomId,
    type: (initialData?.type as MaintenanceType) || 'routine',
    description: initialData?.description || '',
    scheduledDate: initialData?.scheduledDate || addDays(new Date(), 1), // Schedule for tomorrow by default
    priority: initialData?.priority || 'medium',
    estimatedDuration: initialData?.estimatedDuration || 60,
    notes: initialData?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={formData.type}
        onValueChange={(value: MaintenanceType) => 
          setFormData({ ...formData, type: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Maintenance Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="routine">Routine Maintenance</SelectItem>
          <SelectItem value="repair">Repair</SelectItem>
          <SelectItem value="inspection">Inspection</SelectItem>
          <SelectItem value="emergency">Emergency</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Scheduled Date</label>
          <Input
            type="datetime-local"
            value={formData.scheduledDate.toISOString().slice(0, 16)}
            onChange={(e) => setFormData({ 
              ...formData, 
              scheduledDate: new Date(e.target.value)
            })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estimated Duration (minutes)</label>
          <Input
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ 
              ...formData, 
              estimatedDuration: parseInt(e.target.value)
            })}
            required
          />
        </div>
      </div>

      <Select
        value={formData.priority}
        onValueChange={(value) => 
          setFormData({ ...formData, priority: value as MaintenanceRecord['priority'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Additional Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Schedule Maintenance
        </Button>
      </div>
    </form>
  );
}