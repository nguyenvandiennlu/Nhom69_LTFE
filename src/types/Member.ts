export interface Member {
    id: string;
    name: string;
    status: 'online' | 'idle' | 'offline';
    customStatus?: string;
    isBot?: boolean;
}