
export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN_SUPER = 'ADMIN_SUPER',
  ADMIN_BUSINESS = 'ADMIN_BUSINESS',
  ADMIN_FINANCIAL = 'ADMIN_FINANCIAL',
  ADMIN_COMMUNITY = 'ADMIN_COMMUNITY',
  PARTNER = 'PARTNER'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_INFO = 'AWAITING_INFO',
  VALIDATING = 'VALIDATING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface ServiceRequest {
  id: string;
  type: string;
  subType?: string; // Ex: Acte de naissance
  serviceOption?: string; // Ex: Extrait d'acte
  country: string;
  city: string;
  submissionDate: string;
  status: RequestStatus;
  agentId?: string;
  clientName: string;
  clientEmail: string;
  additionalInfo?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  password?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  country?: string;
  city?: string;
  avatar?: string;
  enrolledByAgentId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}
