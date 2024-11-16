import React from 'react';
import { ServiceRequest } from '@/types/request';
import { RequestStatusTracker } from './request-status-tracker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface RequestDetailDialogProps {
  request: ServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailDialog({ 
  request, 
  open, 
  onOpenChange 
}: RequestDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="capitalize">{request.type} Request</span>
            <Badge 
              variant="outline" 
              className="ml-2"
            >
              #{request.id.slice(-4)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {/* Detailed Description */}
        {request.description && (
          <div className="mb-6 rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">Details</span>
            </div>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
        )}

        {/* Status Timeline */}
        <RequestStatusTracker request={request} />
      </DialogContent>
    </Dialog>
  );
}