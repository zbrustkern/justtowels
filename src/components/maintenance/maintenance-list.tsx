'use client';

import { MaintenanceRecord } from '@/types/maintenance';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  onStatusUpdate?: (record: MaintenanceRecord, newStatus: MaintenanceRecord['status']) => Promise<void>;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export function MaintenanceList({ records, onStatusUpdate }: MaintenanceListProps) {
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="capitalize">{record.type}</CardTitle>
                <CardDescription>{format(record.scheduledDate, 'MMM d, yyyy h:mm a')}</CardDescription>
              </div>
              <div className="space-x-2">
                <Badge className={priorityColors[record.priority]}>
                  {record.priority}
                </Badge>
                <Badge className={statusColors[record.status]}>
                  {record.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{record.description}</p>
            {record.notes && (
              <p className="text-sm text-gray-500">{record.notes}</p>
            )}
            {record.estimatedDuration && (
              <p className="text-sm text-gray-500 mt-2">
                Estimated duration: {record.estimatedDuration} minutes
              </p>
            )}
            {record.assignedTo && (
              <p className="text-sm text-gray-500">
                Assigned to: {record.assignedTo}
              </p>
            )}
            {onStatusUpdate && record.status !== 'completed' && record.status !== 'cancelled' && (
              <div className="mt-4 space-x-2">
                {record.status === 'scheduled' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className="cursor-pointer hover:bg-blue-200"
                          onClick={() => onStatusUpdate(record, 'in_progress')}
                        >
                          Start
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Begin maintenance work</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {record.status === 'in_progress' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className="cursor-pointer hover:bg-green-200"
                          onClick={() => onStatusUpdate(record, 'completed')}
                        >
                          Complete
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark maintenance as finished</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => onStatusUpdate(record, 'cancelled')}
                      >
                        Cancel
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel this maintenance task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {/* Add tooltips for priority and status badges */}
            <div className="space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className={priorityColors[record.priority]}>
                      {record.priority}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Priority Level: {record.priority}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className={statusColors[record.status]}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Status: {record.status.replace('_', ' ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Add tooltip for estimated duration */}
            {record.estimatedDuration && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm text-gray-500 mt-2">
                    Estimated duration: {record.estimatedDuration} minutes
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expected time to complete this maintenance task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Add tooltip for assigned staff */}
            {record.assignedTo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm text-gray-500">
                    Assigned to: {record.assignedTo}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Staff member responsible for this task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>
      ))}
      {records.length === 0 && (
        <p className="text-center text-gray-500">No maintenance records found</p>
      )}
    </div>
  );
}