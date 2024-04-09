import { Hono } from 'hono';

import { eq } from 'drizzle-orm';

import { db } from '../../db/connect';

import { app } from '../../db/schema';

const apps = new Hono();

apps
  .get('/', async (c) => {
    try {
      return c.json(await db.query.app.findMany());
    } catch (error) { return c.json(error, 500); }
  })
  .post();

apps
  .get('/:identifier', async (c) => {
    try {
      const name = c.req.param('identifier');
      const data = await db.query.app.findFirst({
        where: eq(app.name, name),
        with: { feature: { columns: { updatedAt: true } } },
        // FIXME: 500 error
      });
      if (!data) return c.notFound();
      return c.json(data);
    } catch (error) { return c.json(error, 500); }
  })
  .delete();

export default apps;

// {
//   "id": 0,
//   "name": "APPNAME",
//   "features": {
//     "featureX": true,
//     "featureY": 0
//   }
// }
