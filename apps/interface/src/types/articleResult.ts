export type ArticleSuccessResult = {
    status: "success";
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
        status: "error";
    } | {
        status: "loading";
    }
