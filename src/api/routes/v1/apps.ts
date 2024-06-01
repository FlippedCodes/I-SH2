import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';

import { ErrorResponse } from 'hono-error-handler';

import { eq } from 'drizzle-orm';

import { db } from '../../db/connect';

import { app } from '../../db/schema';

const apps = new OpenAPIHono();

const routeGetApp = createRoute({
  method: 'get',
  path: '/{appName}',
  request: {
    params: z.object({
      appName: z.string()
        .openapi({
          param: {
            name: 'appName',
            in: 'path',
          },
          example: 'discord',
        }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ example: 1 }),
            appName: z.string().openapi({ example: 'discord' }),
            features: z.object({
              featureX: z.boolean().openapi({ example: true }),
              featureY: z.number().openapi({ example: 300 }),
            }),
          }).openapi('App'),
        },
      },
      description: 'Retrieve specific app',
    },
  },
});

apps.openapi(
  routeGetApp,
  async (c) => {
    const { appName } = c.req.valid('param');
    const result = await db.query.app.findFirst({
      where: eq(app.name, appName),
      with: { feature: true },
    });
    if (!result) throw new ErrorResponse('App doesn\'t exist', 404);
    return c.json(
      {
        id: result.id,
        appName: result.name,
        features: {
          featureX: result.feature.inviteLinks,
          featureY: result.feature.appID,
        },
      },
      200,
    );
  },
);

// apps
//   .get('/', async (c) => {
//     try {
//       return c.json(await db.query.app.findMany());
//     } catch (error) { return c.json(error, 500); }
//   })
//   .post();

// apps
//   .get('/:identifier', async (c) => {
//     try {
//       const name = c.req.param('identifier');
//       const result = await db.query.app.findFirst({
//         where: eq(app.name, name),
//         with: { feature: true },
//       });
//       if (!result) return c.notFound();
//       return c.json(result);
//     } catch (error) { return c.json(error, 500); }
//   })
//   .delete();

export default apps;

// {
//   "id": 0,
//   "name": "APPNAME",
//   "features": {
//     "featureX": true,
//     "featureY": 0
//   }
// }
