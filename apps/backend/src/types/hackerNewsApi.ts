export type HackerNewsApiResult = {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    text?: string;
    url?: string;
}