import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as z from 'zod'
import { OgpHandler } from '../utils/OgpHandler'
import { htmlToMarkdown } from 'webforai'
import { extractFirstImageUrl } from '../utils/extractFirstImageUrl'

const app = new Hono()

app.get(
  '/articles/:id',
  zValidator(
    'param',
    z.object({
      id: z.string()
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param')

    const emptyResult = {
      by: "",
      descendants: 0,
      id: 0,
      kids: [],
      score: 0,
      time: 0,
      title: "",
      type: "",
      url: "",
      ja: {
        title: "",
        description: "",
      },
      image: ""
    }

    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).catch((err) => {
      return c.json(emptyResult)
    });

    const data = await res.json();

    if (!data) {
      return c.json(emptyResult)
    }

    const articleData = data as {
      by: string;
      descendants: number;
      id: number;
      kids: number[];
      score: number;
      time: number;
      title: string;
      type: string;
      url: string;
    }

    if (articleData.type !== "story") {
      return c.json(emptyResult)
    }

    if (!articleData.url) {
      //TODO:textの翻訳を返す
      return c.json(emptyResult)
    }

    const siteRes = await fetch(articleData.url).catch((err) => {
      // TODO:タイトルのみ翻訳して返す
      return c.json({
        ...articleData,
        ja: {
          title: "",
          description: "",
        },
        image: ""
      })
    });


    const ogp = new OgpHandler();
    const eleRes = new HTMLRewriter().on("meta", ogp).transform(siteRes);

    const html = await eleRes.text();

    const markdown = htmlToMarkdown(html, { solveLinks: articleData.url });

    let ogpImage = ogp.image;
    if (ogpImage === "") {
      const imgMatch = extractFirstImageUrl(markdown);
      if (imgMatch) {
        ogpImage = imgMatch;
      }
    }



    // c.header("Cache-Control", "public, max-age=31536000, immutable");

    return c.json({
      ...articleData,
      ja: {
        title: "",
        description: "",
      },
      image: ogpImage || ""
    })
  }
)

export default app
