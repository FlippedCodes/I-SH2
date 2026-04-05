import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { ErrorResponse } from 'hono-error-handler';
import { eq } from 'drizzle-orm';

import { app, db } from '../../index';
import { appTable, featureTable } from '../../schema/schema';
import {
  appWithFeaturesSchema,
  appSchema,
  appSchemaFull,
  featureSchemaFull,
} from '../../zodSchemas';

const apps = new OpenAPIHono();

//#region Get App
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
            schema: appSchemaFull
              .extend({ features: featureSchemaFull })
              .openapi('AppWithFeatures'),
          },
        },
        description: 'Retrieve specific registered app.',
      },
      400: {
        description: 'App not found',
      },
    },
  }),
  async (_c_) => {
    const { appName } = _c_.req.valid('param');
    const result = await db.query.app.findFirst({
      where: eq(appTable.name, appName),
      with: { feature: true },
    });
    if (!result) throw new ErrorResponse('App not found', 404);
    return _c_.json(result, 200);
  },
);

//#region Get all Apps
apps.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            // FIXME: Example doesn't show
            schema: appSchema.openapi('App'),
          },
        },
        description: 'Retrieve all registered apps',
      },
      404: {
        description: 'There are no apps registered',
      },
    },
  }),
  async (_c_) => {
    const results = await db.query.app.findMany();
    if (!results) throw new ErrorResponse('There are no apps registered', 404);
    return _c_.json(
      results.map((result) => result.name),
      200,
    );
  },
);

export default apps;
