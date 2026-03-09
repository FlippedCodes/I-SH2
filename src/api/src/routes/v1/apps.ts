import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';

import { ErrorResponse } from 'hono-error-handler';

import { eq } from 'drizzle-orm';

import { db } from '../../index';

import { appTable } from '../../schema/schema';

const apps = new OpenAPIHono();

apps.openapi(
  createRoute({
    method: 'get',
    path: '/{appName}',
    request: {
      params: z.object({
        appName: z.string().openapi({
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
            schema: z
              .object({
                id: z.number().openapi({ example: 1 }),
                appName: z.string().openapi({ example: 'discord' }),
                features: z.object({
                  featureX: z.boolean().openapi({ example: true }),
                  featureY: z.number().openapi({ example: 300 }),
                }),
              })
              .openapi('App'),
          },
        },
        description: 'Retrieve specific app',
      },
    },
  }),
  async (c) => {
    const { appName } = c.req.valid('param');
    const result = await db.query.app.findFirst({
      where: eq(appTable.name, appName),
      with: { feature: true },
    });
    if (!result) throw new ErrorResponse("App doesn't exist", 404);
    return c.json(
      {
        id: result.id,
        appName: result.name,
        features: result.feature,
      },
      200
    );
  }
);

apps.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            // FIXME: Example doesn't show
            schema: z
              .tuple([z.string().openapi({ example: 'discord' })])
              .openapi('AppList'),
          },
        },
        description: 'Retrieve specific app',
      },
    },
  }),
  async (c) => {
    const results = await db.query.app.findMany();
    if (!results) throw new ErrorResponse('There are no apps registered.', 404);
    return c.json(
      results.map((result) => result.name),
      200
    );
  }
);

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
