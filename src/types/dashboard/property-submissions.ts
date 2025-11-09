
import { propertySubmissionStatus } from "@/constants/dashboard/admin/propertySubmissions/constants";
import { MiniProject, PropertyType } from "../property";
import { FileItem } from "@/utils/upload";

export type propertySubmissionRow = {
    id: number;
    requesterName: string;
    relationshipType: string;
    propertyType: PropertyType;
    price: number;
    status: propertySubmissionStatus;
    createdAt: string;
    publishedProperty?: MiniProject
};


export type propertySubmissionFull = {
    id: number;
    requesterName: string;
    relationshipType: string;
    propertyType: PropertyType;
    price: number;
    status: propertySubmissionStatus;
    attachments: FileItem[];
    address: string;
    specifications: Record<string, { name: string; value: string | string[] }>;
    authorizationDoc?: FileItem;
    createdAt: string;
    publishedProperty?: MiniProject
};
