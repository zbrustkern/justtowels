import React from 'react';
import { format } from 'date-fns';
import { ServiceRequest, RequestStatus } from '@/types/request';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Hourglass,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCog
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface RequestStatusTrackerProps {
  request: ServiceRequest;
}

const statusConfig = {
  'pending': {
    icon: Hourglass,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
    description: 'Request received and awaiting assignment'
  },
  'in-progress': {
    icon: UserCog,
    color: 'bg-blue-100 text-blue-800',
    label: 'In Progress',
    description: 'Staff member is working on your request'
  },
  'completed': {
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800',
    label: 'Completed',
    description: 'Request has been fulfilled'
  }
};

const getEstimatedTime = (type: string, status: RequestStatus): string => {
  if (status === 'completed') return 'Completed';
  
  const estimates = {
    'towels': '10-15 minutes',
    'cleaning': '30-45 minutes',
    'maintenance': '1-2 hours',
    'amenities': '15-20 minutes'
  };
  
  return estimates[type as keyof typeof estimates] || 'Time varies';
};

export function RequestStatusTracker({ request }: RequestStatusTrackerProps) {
  const currentStatus = statusConfig[request.status];
  const timelineSteps = Object.entries(statusConfig);
  const currentStepIndex = timelineSteps.findIndex(([status]) => status === request.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <currentStatus.icon className="h-5 w-5" />
            Request Status
          </span>
          <Badge className={currentStatus.color}>
            {currentStatus.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Requested: {format(request.createdAt, 'MMM d, h:mm a')}</span>
          </div>
          {request.assignedTo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCog className="h-4 w-4" />
              <span>Assigned to staff</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Estimated time: {getEstimatedTime(request.type, request.status)}</span>
          </div>
        </div>

        {/* Status Timeline */}
        <ScrollArea className="h-full w-full">
          <div className="relative">
            {timelineSteps.map(([status, config], index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = status === request.status;

              return (
                <div
                  key={status}
                  className={`relative flex items-center gap-4 pb-8 last:pb-0
                    ${index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {/* Timeline Line */}
                  {index < timelineSteps.length - 1 && (
                    <div className={`absolute left-[15px] top-[24px] h-full w-px
                      ${isCompleted ? 'bg-primary' : 'bg-border'}`}
                    />
                  )}

                  {/* Status Icon */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full
                          ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                          <config.icon className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{config.description}</p>
                        {isCurrent && request.status === 'in-progress' && (
                          <p className="text-xs text-muted-foreground">
                            Started: {format(request.updatedAt, 'h:mm a')}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Status Details */}
                  <div className="flex-1">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                    {isCurrent && request.status === 'in-progress' && (
                      <p className="text-sm text-muted-foreground">
                        Started at {format(request.updatedAt, 'h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}