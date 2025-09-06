export interface Visitor {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  purposeOfVisit: string;
  personForVisit: string;
  organisation: string;
  hostId?: string | null;
  checkInTime: string; // ISO 8601 string
  checkOutTime: string | null; // ISO 8601 string
}
