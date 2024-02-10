import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'
import { OgpHandler } from './utils/OgpHandler'
import { htmlToMarkdown } from 'webforai'
import { extractFirstImageUrl } from './utils/extractFirstImageUrl'
import { Ai } from '@cloudflare/ai'
import { HackerNewsApiResult } from './types/hackerNewsApi'
import { translate } from './utils/translate'

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
        const translateResult = await ai.run('@cf/meta/m2m100-1.2b', {
          text: hackerNewsApiResult.title,
          source_lang: "english", // defaults to english
          target_lang: "japanese"
        })

        if (translateResult.translated_text) {

          // TODO:タイトルのみを翻訳する
          return c.json({
            ...hackerNewsApiResult,
            success: true,
            ja: {
              title: translateResult.translated_text,
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

      const translatedTitleResult = translate(hackerNewsApiResult.title, c.env.TLANSLATE_API_KEY, c.env.TLANSLATE_API_SECRET, c.env.TLANSLATE_LOGIN_NAME)

      if (!translatedTitleResult) {
        throw new Error("failed to translate title");
      }


      return c.json({
        ...hackerNewsApiResult,
        success: true,
        ja: {
          title: translatedTitleResult,
          description: "",
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

app.get("/test", async (c) => {
  const translatedTitleResult = await translate("hello! This is a example Text.", c.env.TLANSLATE_API_KEY, c.env.TLANSLATE_API_SECRET, c.env.TLANSLATE_API_LOGIN_NAME)

  return c.json(translatedTitleResult)
});

export default app
