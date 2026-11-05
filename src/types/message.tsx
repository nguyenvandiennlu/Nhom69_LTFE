export interface Message {
    id: string;
    user: string;
    text: string;
    time: string;
    to?: string;
    type?: number;
}
