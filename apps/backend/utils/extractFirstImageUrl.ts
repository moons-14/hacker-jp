import { marked } from "marked";

export function extractFirstImageUrl(markdown: string): string | null {
    // 最初の画像URLを保持する変数
    let firstImageUrl: string | null = null;

    // カスタムレンダラーを作成
    const renderer = new marked.Renderer();

    // 元のimage関数をオーバーライド
    const originalImageRenderer = renderer.image;
    renderer.image = (href: string, title: string, text: string) => {
        // 最初の画像URLがまだ見つかっていない場合は、そのURLを保持
        if (!firstImageUrl) {
            firstImageUrl = href;
        }
        // 元のimage関数を使用してマークダウンを処理
        return originalImageRenderer.call(renderer, href, title, text);
    };

    // マークダウンをHTMLに変換（このプロセスで画像URLが抽出される）
    marked(markdown, { renderer });

    // 最初の画像URLを返す（見つからなければnull）
    return firstImageUrl;
}
