import { IconType } from "react-icons";
import { PropertyType } from "./property";



export type NavItem = {
    name: string;
    href?: string;
    children?: NavItem[];
};

export type Property = {
    id: string;
    imageLink: string;
    location: string;
    type: PropertyType;
    title: string;
    link: string;
    rooms?: string;
    beds?: string;
    area?: string;
    price?: number;

};

export type NotificationType = "info" | "done" | "warn" | "error";

export type BookingStatus =
    | 'pending'
    | 'assigned'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export interface Booking {
    id: string;
    status: BookingStatus;
    propertyName: string;
    propertyType: string;
    propertyImage: string;
    startDate: string;
    endDate: string;
    agent?: string;
    propertyLink: string;
    review?: {
        rating: number;
        comment: string;
    }
}

export type SelectableItem = {
    label: string;
    icon?: IconType;
    href?: string;
    children?: SelectableItem[];
};


export type Role = 'admin' | 'marketer' | 'agent';