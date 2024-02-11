import { marked } from "marked";

export async function extractTextWithoutLinksAndImages(markdown: string): Promise<string> {
    // 出力テキストを保持する変数
    let extractedText = '';

    // カスタムレンダラーを作成
    const renderer = new marked.Renderer();

    // リンクのレンダリングをオーバーライド
    renderer.link = (href: string, title: string, text: string) => {
        // リンクのテキストのみを返し、URLは無視
        return text;
    };

    // 画像のレンダリングをオーバーライド
    renderer.image = () => {
        // 画像を無視して何も返さない
        return '';
    };

    // マークダウンをHTMLに変換し、同時にリンクと画像を除外（このプロセスでテキストが抽出される）
    extractedText = await marked(markdown, { renderer });

    // HTMLタグを除去して純粋なテキストのみを返す
    // シンプルな正規表現を使用してHTMLタグを除去する（より複雑なHTMLには対応していないことに注意）
    return extractedText.replace(/<[^>]*>?/gm, '');
}
