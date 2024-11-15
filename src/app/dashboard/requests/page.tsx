// src/app/dashboard/requests/page.tsx
import { RequestList } from '@/components/requests/request-list';
import { CreateRequest } from '@/components/requests/create-request';

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Requests</h1>
        <CreateRequest />
      </div>
      <RequestList />
    </div>
  );
}