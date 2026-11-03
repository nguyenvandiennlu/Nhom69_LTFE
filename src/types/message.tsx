export interface Message {
    id: string;
    user: string;
    text: string;
    time: string;
}
export interface CurrentChat {
    name: string;
    type: 'room' | 'people';
}