import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'
import { OgpHandler } from './utils/OgpHandler'
import { htmlToMarkdown } from 'webforai'
import { extractFirstImageUrl } from './utils/extractFirstImageUrl'
import { HackerNewsApiResult } from './types/hackerNewsApi'
import { extractTextWithoutLinksAndImages } from './utils/removeLinksAndImagesFromMarkdown'
import { cors } from 'hono/cors'
import { cfTranslate } from './utils/cfTranslate'
import { hfSummarize } from './utils/hfSummarize'
import { cache } from 'hono/cache'

type HonoConfig = {
  Bindings: {
    QUEUE: Queue,
    TLANSLATE_API_KEY: string;
    TLANSLATE_API_SECRET: string;
    TLANSLATE_API_LOGIN_NAME: string;
    CF_ACCOUNT_ID: string;
    CF_WORKERS_AI_TOKEN: string;
    HF_TOKEN: string;
  }
};

const app = new Hono<HonoConfig>();


app.get(
  '/article/*',
  cache({
    cacheName: 'hacker-jp-v10',
    cacheControl: 'max-age=31536000',
  })
)

// app.use('/article/*', cors())

// app.use(
//   '/article/*',
//   cors({
//     origin: ['https://hacker-jp.moons14.com'],
//     allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//     allowMethods: ['GET'],
//     exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//     maxAge: 600,
//     credentials: true,
//   })
// )

app.get(
  '/article/:id',
  zValidator(
    'param',
    z.object({
      id: z.string()
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param');

    c.header("Cache-Control", "public, max-age=31536000, immutable");

    let hackerNewsApiResult: HackerNewsApiResult;
    try {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
      hackerNewsApiResult = await res.json();
    } catch {
      return c.json({
        success: false,
      }, 404)
    }

    if (hackerNewsApiResult.type !== "story") {
      return c.json({
        success: false,
      }, 404)
    }

    if (!hackerNewsApiResult.url) {
      //TODO:textの翻訳を返す
      return c.json({
        success: false,
      }, 500)
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
        const translateResult = await cfTranslate(hackerNewsApiResult.title, c.env.CF_ACCOUNT_ID, c.env.CF_WORKERS_AI_TOKEN)

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
        }, 500)

      } catch {

        return c.json({
          success: false,
        }, 500)

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

    try {

      const translatedTitleResult = await cfTranslate(hackerNewsApiResult.title, c.env.CF_ACCOUNT_ID, c.env.CF_WORKERS_AI_TOKEN)

      if (!translatedTitleResult) {
        throw new Error("failed to translate title");
      }

      let plainText = await extractTextWithoutLinksAndImages(markdown);

      // 5000文字以上の場合は省略
      if (plainText.length > 4000) {
        plainText = plainText.slice(0, 4000);
      }

      const summaryDescriptionResult = await hfSummarize(plainText, c.env.HF_TOKEN)

      if (!summaryDescriptionResult) {
        return c.json({
          ...hackerNewsApiResult,
          success: true,
          ja: {
            title: translatedTitleResult,
            description: ""
          },
          image: ogpImage,
        })
      }

      const summaryTranslatedResult = await cfTranslate(summaryDescriptionResult, c.env.CF_ACCOUNT_ID, c.env.CF_WORKERS_AI_TOKEN)

      if (!summaryTranslatedResult) {
        return c.json({
          ...hackerNewsApiResult,
          success: true,
          ja: {
            title: translatedTitleResult,
            description: summaryDescriptionResult
          },
          image: ogpImage,
        })
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
