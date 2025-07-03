export interface UserProfile {
    name: string;
    email: string;
    role: 'admin' | 'member';
    uid: string;
}