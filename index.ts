import { Hono, type HonoRequest } from 'hono';
import { markdownToBlocks } from '@tryfabric/martian';

// Honoアプリケーションを作成
const app = new Hono();

// マークダウンからNotionの形式のJSONに変換する関数
const convertMarkdownToNotion = (markdown: string) => {
  const blocks = markdownToBlocks(markdown);
  return blocks;
};

// v1プレフィックスを付けたPOSTエンドポイント
app.post('/v1/convert', async (c) => {
  try {
    // リクエストボディからマークダウンを取得
    const markdown = await c.req.text()
    const { children } = c.req.query()

    // マークダウンをNotionの形式のJSONに変換
    const notionBlocks = convertMarkdownToNotion(markdown);

    if (children === "true") {
      return c.json({
        children: notionBlocks
      });
    }

    return c.json(notionBlocks);
  } catch (error) {
    // エラーハンドリング
    return c.json({ error: `Failed to convert markdown to Notion format ${error}` }, 500);
  }
});

// その他のエンドポイントに対して404を返す
app.all('*', (c) => c.json({ error: 'Not Found' }, 404));

export default app;