import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'
import { OgpHandler } from './utils/OgpHandler'
import { htmlToMarkdown } from 'webforai'
import { extractFirstImageUrl } from './utils/extractFirstImageUrl'
import { Ai } from '@cloudflare/ai'
import { HackerNewsApiResult } from './types/hackerNewsApi'
import { translate } from './utils/translate'
import { extractTextWithoutLinksAndImages } from './utils/removeLinksAndImagesFromMarkdown'

type HonoConfig = {
  Bindings: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    AI: any;
    TLANSLATE_API_KEY: string;
    TLANSLATE_API_SECRET: string;
    TLANSLATE_API_LOGIN_NAME: string;
  }
};

const app = new Hono<HonoConfig>();

app.get(
  '/article/:id',
  zValidator(
    'param',
    z.object({
      id: z.string()
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param')

    const ai = new Ai(c.env.AI)

    let hackerNewsApiResult: HackerNewsApiResult;
    try {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
      hackerNewsApiResult = await res.json();
    } catch {
      return c.json({
        success: false,
      })
    }

    if (hackerNewsApiResult.type !== "story") {
      return c.json({
        success: false,
      })
    }

    if (!hackerNewsApiResult.url) {
      //TODO:textの翻訳を返す
      return c.json({
        success: false,
      })
    }


    const articleUrl = new URL(hackerNewsApiResult.url);

    let articleSiteResponse: Response;
    const ogp = new OgpHandler();
    let html: string;
    try {

      articleSiteResponse = await fetch(articleUrl.href);
      // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
      const eleRes = new HTMLRewriter().on("meta", ogp).transform(articleSiteResponse);

      html = await eleRes.text();

    } catch (e) {

      console.error(e);

      try {
        const translateResult = await translate(hackerNewsApiResult.title, c.env.TLANSLATE_API_KEY, c.env.TLANSLATE_API_SECRET, c.env.TLANSLATE_API_LOGIN_NAME)

        if (translateResult) {

          // TODO:タイトルのみを翻訳する
          return c.json({
            ...hackerNewsApiResult,
            success: true,
            ja: {
              title: translateResult,
              description: ""
            },
            image: ""
          })
        }

        return c.json({
          success: false,
        })

      } catch {

        return c.json({
          success: false,
        })

      }

    }

    const markdown = htmlToMarkdown(html, { solveLinks: hackerNewsApiResult.url });

    let ogpImage = ogp.image;
    if (ogpImage === "") {
      const imgMatch = extractFirstImageUrl(markdown);
      if (imgMatch) {
        ogpImage = imgMatch;
      }
    }

    // c.header("Cache-Control", "public, max-age=31536000, immutable");

    try {

      const translatedTitleResult = await translate(hackerNewsApiResult.title, c.env.TLANSLATE_API_KEY, c.env.TLANSLATE_API_SECRET, c.env.TLANSLATE_API_LOGIN_NAME)

      if (!translatedTitleResult) {
        throw new Error("failed to translate title");
      }

      let plainText = await extractTextWithoutLinksAndImages(markdown);

      // 5000文字以上の場合は省略
      if (plainText.length > 4000) {
        plainText = plainText.slice(0, 4000);
      }

      const summaryDescriptionResult = await ai.run('@cf/meta/llama-2-7b-chat-fp16', {
        messages: [
          {
            role: "system",
            content: "Generate a summary based on the given text. \nOutput only the summary.",
          },
          {
            role: "user",
            content: `# Given text\n \`\`\`\n${plainText}\n\`\`\` ¥n¥n # Summarise Text\n`,
          }
        ],
        stream: false,
        max_tokens: 3072
      });

      if (!summaryDescriptionResult.response) {
        throw new Error("failed to generate summary");
      }

      const summaryTranslatedResult = await translate(summaryDescriptionResult.response, c.env.TLANSLATE_API_KEY, c.env.TLANSLATE_API_SECRET, c.env.TLANSLATE_API_LOGIN_NAME)

      if (!summaryTranslatedResult) {
        throw new Error("failed to translate summary");
      }

      return c.json({
        ...hackerNewsApiResult,
        success: true,
        ja: {
          title: translatedTitleResult,
          description: summaryTranslatedResult.replace(/\n/g, "")
        },
        image: ogpImage,
      })
    } catch (e) {
      console.error(e);

      return c.json({
        success: false,
      })
    }

  }
)

export default app
