'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  Timestamp,
  FieldValue,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { GeneralSettings } from './settings-tabs/general-settings';
import { OperationsSettings } from './settings-tabs/operations-settings';
import { HotelSettings } from './types';

const defaultSettings: HotelSettings = {
  name: '',
  address: '',
  phone: '',
  email: '',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  enableAutoAssignment: true,
  enableGuestNotifications: true,
  enableMaintenanceAlerts: true,
  maxMaintenanceRequestsPerDay: 10,
  cleaningBuffer: 60,
  maintenanceStaffEmail: '',
  housekeepingStaffEmail: ''
};

type FirestoreData = {
    [key: string]: string | number | boolean | Date | Timestamp | FieldValue | undefined;
  };

const convertSettingsToFirestore = (settings: HotelSettings): FirestoreData => {
    const firestoreData: FirestoreData = {
      ...settings,
      updatedAt: Timestamp.now()
    };
  
    return firestoreData;
  };

  export function SettingsDashboard() {
    const { userData, hasPermission } = useAuth();
    const [settings, setSettings] = useState<HotelSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);  

  useEffect(() => {
    const fetchSettings = async () => {
      if (!userData?.propertyId) return;
      
      try {
        const docRef = doc(db, 'properties', userData.propertyId, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Remove any extra fields that might be in Firestore but not in our type
          const settingsData: HotelSettings = {
            name: data.name ?? '',
            address: data.address ?? '',
            phone: data.phone ?? '',
            email: data.email ?? '',
            checkInTime: data.checkInTime ?? '15:00',
            checkOutTime: data.checkOutTime ?? '11:00',
            enableAutoAssignment: data.enableAutoAssignment ?? true,
            enableGuestNotifications: data.enableGuestNotifications ?? true,
            enableMaintenanceAlerts: data.enableMaintenanceAlerts ?? true,
            maxMaintenanceRequestsPerDay: data.maxMaintenanceRequestsPerDay ?? 10,
            cleaningBuffer: data.cleaningBuffer ?? 60,
            maintenanceStaffEmail: data.maintenanceStaffEmail ?? '',
            housekeepingStaffEmail: data.housekeepingStaffEmail ?? ''
          };
          setSettings(settingsData);
        } else {
          // Initialize with default settings if none exist
          const firestoreData = convertSettingsToFirestore(defaultSettings);
          await setDoc(docRef, firestoreData);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userData?.propertyId]);

  const handleSave = async () => {
    if (!userData?.propertyId) return;
    
    setSaving(true);
    setSaveStatus(null);
    
    try {
      const docRef = doc(db, 'properties', userData.propertyId, 'settings', 'general');
      const firestoreData = convertSettingsToFirestore(settings);
      await updateDoc(docRef, firestoreData);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof HotelSettings>(
    key: K,
    value: HotelSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!hasPermission(['admin'])) {
    return (
      <Alert>
        <AlertDescription>
          You don&apos;t have permission to access hotel settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hotel Settings</h1>
        <Button 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>

      {saveStatus === 'success' && (
        <Alert className="bg-green-50 text-green-800">
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>Failed to save settings. Please try again.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        <TabsContent value="operations">
          <OperationsSettings settings={settings} updateSetting={updateSetting} />
        </TabsContent>

        {/* Add other tab contents similarly */}
      </Tabs>
    </div>
  );
}