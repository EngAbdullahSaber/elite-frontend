export type PropertyType = "apartment" | "villa" | "land" | "home" | "office";

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "شقة",
  villa: "فيلا",
  home: "اراضى سكنية",
  land: "اراضى تجارية",
  office: "مكاتب ادارية",
};

export type AccessType = "direct" | "mediated" | "restricted";

export const accessTypeLabels: Record<AccessType, string> = {
  direct: "مباشر",
  mediated: "عن طريق وسيط",
  restricted: "مقيّد",
};

export type MiniProject = {
  id: number;
  title: string;
  type: PropertyType;
  image?: string;
};
