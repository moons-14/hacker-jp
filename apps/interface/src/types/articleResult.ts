export type ArticleSuccessResult = {
    success: true;
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
    ja: {
        title: string;
        description: string;
    };
    image: string;
}
export type ArticleResult = ArticleSuccessResult
    | {
        success: false;
    }