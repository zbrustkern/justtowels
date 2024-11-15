'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HotelSettings } from '../types';

interface GeneralSettingsProps {
  settings: HotelSettings;
  updateSetting: <K extends keyof HotelSettings>(key: K, value: HotelSettings[K]) => void;
}

export function GeneralSettings({ settings, updateSetting }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotel Information</CardTitle>
        <CardDescription>
          Basic information about your hotel property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Hotel Name</Label>
          <Input
            id="name"
            value={settings.name}
            onChange={e => updateSetting('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={settings.address}
            onChange={e => updateSetting('address', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={e => updateSetting('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={e => updateSetting('email', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}