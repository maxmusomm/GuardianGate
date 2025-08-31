import type { Timestamp } from "firebase/firestore";

export interface Visitor {
  id: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  purposeOfVisit: string;
  personForVisit: string;
  organisation: string;
  checkInTime: Timestamp;
  checkOutTime: Timestamp | null;
}
