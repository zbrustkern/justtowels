export interface Guest {
    id: string;
    name: string;
    email: string;
    roomNumber: string;
    checkIn: Date;
    checkOut: Date;
    requests: string[]; // Array of request IDs
  }