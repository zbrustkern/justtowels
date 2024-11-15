export type StaffRole = 'admin' | 'manager' | 'front_desk' | 'housekeeping' | 'maintenance';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone?: string;
  startDate: Date;
  status: 'active' | 'inactive';
  shifts?: {
    start: Date;
    end: Date;
  }[];
}