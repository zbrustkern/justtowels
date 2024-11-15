'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HotelSettings } from '../types';

interface OperationsSettingsProps {
  settings: HotelSettings;
  updateSetting: <K extends keyof HotelSettings>(key: K, value: HotelSettings[K]) => void;
}

export function OperationsSettings({ settings, updateSetting }: OperationsSettingsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Check-in & Check-out</CardTitle>
          <CardDescription>
            Set default times for guest arrivals and departures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Check-in Time</Label>
              <Input
                id="checkInTime"
                type="time"
                value={settings.checkInTime}
                onChange={e => updateSetting('checkInTime', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Check-out Time</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={settings.checkOutTime}
                onChange={e => updateSetting('checkOutTime', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cleaningBuffer">
              Cleaning Buffer (minutes)
            </Label>
            <Input
              id="cleaningBuffer"
              type="number"
              min="0"
              value={settings.cleaningBuffer}
              onChange={e => updateSetting('cleaningBuffer', Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>
            Configure maintenance request handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxRequests">
              Maximum Maintenance Requests per Day
            </Label>
            <Input
              id="maxRequests"
              type="number"
              min="1"
              value={settings.maxMaintenanceRequestsPerDay}
              onChange={e => updateSetting('maxMaintenanceRequestsPerDay', Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}