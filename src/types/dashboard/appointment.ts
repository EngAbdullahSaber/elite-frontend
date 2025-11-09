// types/dashboard/appointment.ts
export interface AppointmentRow {
  id: string;
  project: {
    id: string;
    title: string;
    description: string;
    price: string;
    location: string;
    image?: string | null;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
  };
  appointmentAt: string; // ISO string format: "2024-02-15T10:00:00"
  status: string;
  customerNotes: string;
  createdAt: string;
  updatedAt: string;
  reviewStars?: number;
  agentReviewStars?: number;
  agentReviewText?: string;
  expectedProfit?: number;
  isPaid?: boolean;
  proofFiles?: any[];
}

// Update the props interface for AppointmentDetails
interface AppointmentDetailsProps {
  appointment: AppointmentRow;
  onAppointmentAction?: () => void;
}
