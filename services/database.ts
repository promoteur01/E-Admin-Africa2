
import { RequestStatus, UserRole, UserProfile, ServiceRequest } from '../types';

export interface AdCampaign {
  id: string;
  partnerName: string;
  imageUrl: string;
  link: string;
  type: 'banner' | 'sidebar' | 'inline';
  category: string;
  brandColor: string;
  stats: { impressions: number; clics: number };
}

interface DB_SCHEMA {
  users: UserProfile[];
  requests: ServiceRequest[];
  ads: AdCampaign[];
}

const INITIAL_ADS: AdCampaign[] = [
  {
    id: 'ad-mtn',
    partnerName: 'MTN Mobile Money',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000',
    link: 'https://www.mtn.cm',
    type: 'banner',
    category: 'finance',
    brandColor: '#FFCC00',
    stats: { impressions: 0, clics: 0 }
  },
  {
    id: 'ad-orange',
    partnerName: 'Orange Money',
    imageUrl: 'https://images.unsplash.com/photo-1512428559083-a401c33c2b55?q=80&w=1000',
    link: 'https://www.orange.ci',
    type: 'inline',
    category: 'finance',
    brandColor: '#FF7900',
    stats: { impressions: 0, clics: 0 }
  }
];

class MockDatabase {
  private key = 'eadmin_africa_db_v5';

  constructor() {
    if (!localStorage.getItem(this.key)) {
      this.reset();
    }
  }

  reset() {
    const initialData: DB_SCHEMA = {
      users: [
        { id: 'u1', email: 'jean@dupont.com', fullName: 'Jean Dupont', role: UserRole.CLIENT, password: 'password123', status: 'ACTIVE', avatar: 'https://i.pravatar.cc/150?u=u1' },
        { id: 'admin1', email: 'admin@eadmin.africa', fullName: 'Super Admin', role: UserRole.ADMIN_SUPER, password: 'super_secret_99', status: 'ACTIVE' }
      ],
      requests: [
        { id: 'EA-2025-001', type: 'Légalisation de diplôme', country: 'Cameroun', city: 'Yaoundé', submissionDate: '2025-02-15', status: RequestStatus.IN_PROGRESS, clientName: 'Jean Dupont', clientEmail: 'jean@dupont.com' }
      ],
      ads: INITIAL_ADS
    };
    localStorage.setItem(this.key, JSON.stringify(initialData));
  }

  private getDB(): DB_SCHEMA {
    const data = localStorage.getItem(this.key);
    const parsed = data ? JSON.parse(data) : {};
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      ads: Array.isArray(parsed.ads) ? parsed.ads : INITIAL_ADS,
    };
  }

  private saveDB(data: DB_SCHEMA) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getUsers() { return this.getDB().users; }

  getUserByEmailAndRole(email: string, role: UserRole) {
    const norm = email.toLowerCase().trim();
    return this.getDB().users.find(u => u.email.toLowerCase().trim() === norm && u.role === role);
  }
  
  addUser(user: UserProfile) {
    const db = this.getDB();
    const normalizedEmail = user.email.toLowerCase().trim();
    
    const exists = db.users.some(u => 
      u.email.toLowerCase().trim() === normalizedEmail && u.role === user.role
    );

    if (exists) {
      console.warn("User already exists with this role:", normalizedEmail, user.role);
      return false;
    }

    user.email = normalizedEmail;
    db.users.push(user);
    this.saveDB(db);
    return true;
  }

  updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING') {
    const db = this.getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      db.users[userIndex].status = status;
      this.saveDB(db);
      return true;
    }
    return false;
  }

  updateUserPassword(userId: string, newPassword: string) {
    const db = this.getDB();
    const user = db.users.find(u => u.id === userId);
    if (user) { user.password = newPassword; this.saveDB(db); }
  }

  toggleUserStatus(userId: string) {
    const db = this.getDB();
    const user = db.users.find(u => u.id === userId);
    if (user) { 
      user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'; 
      this.saveDB(db); 
    }
  }

  deleteUser(userId: string) {
    const db = this.getDB();
    db.users = db.users.filter(u => u.id !== userId);
    this.saveDB(db);
  }

  getRequests() { return this.getDB().requests; }
  addRequest(request: ServiceRequest) {
    const db = this.getDB();
    db.requests.unshift(request);
    this.saveDB(db);
  }

  getAds(type?: string) {
    const ads = this.getDB().ads;
    return type ? ads.filter(a => a.type === type) : ads;
  }

  recordAdImpression(adId: string) {
    const db = this.getDB();
    const ad = db.ads.find(a => a.id === adId);
    if (ad) ad.stats.impressions++;
    this.saveDB(db);
  }
}

export const db = new MockDatabase();
