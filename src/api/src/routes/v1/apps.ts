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
      results.map((result) => ( { id: result.id, name: result.name } )),
      200,
    );
  },
);

//#region Create App
apps.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: appSchema
              .extend({ features: appWithFeaturesSchema })
              .openapi('AppWithFeaturesInput'),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: appSchemaFull
              .extend({ features: featureSchemaFull })
              .openapi('AppWithFeatures'),
          },
        },
        description: 'App updated successfully',
      },
      200: {
        content: {
          'application/json': {
            schema: appSchemaFull
              .extend({ features: featureSchemaFull })
              .openapi('AppWithFeatures'),
          },
        },
        description: 'App created successfully',
      },
      400: {
        description: 'Invalid request data',
      },
    },
  }),
  async (_c_) => {
    // TODO: after creation, queue with correct routing also has to be created
    const appData = _c_.req.valid('json');

    // Check if app with this name already exists
    const existingApp = await db.query.app.findFirst({
      where: eq(appTable.name, appData.name),
    });

    if (existingApp) {
      // Update existing app
      const updatedApp = await db
        .update(appTable)
        .set({ name: appData.name, delaunch: false })
        .where(eq(appTable.name, appData.name))
        .returning();

      // Update features if they exist
      if (appData.features) {
        await db
          .update(featureTable)
          .set({
            appID: updatedApp[0].id,
            tosLink: appData.features.tosLink,
            privacyPolicyLink: appData.features.privacyPolicyLink,
            textLength: appData.features.textLength,
            trackMessage: appData.features.trackMessage,
            deleteMessage: appData.features.deleteMessage,
            deleteMessageTime: appData.features.deleteMessageTime,
            inviteLinks: appData.features.inviteLinks,
            webhookSupport: appData.features.webhookSupport,
            media: appData.features.media,
            mediaStickers: appData.features.mediaStickers,
            mediaEmojis: appData.features.mediaEmojis,
          })
          .where(eq(featureTable.appID, updatedApp[0].id));
      }

      return _c_.json({ ...updatedApp[0], features: appData.features }, 200);
    } else {
      // Create new app
      const newApp = await db
        .insert(appTable)
        .values({ name: appData.name })
        .returning();

      // Create features for new app
      if (appData.features) {
        const newFeatures = await db
          .insert(featureTable)
          .values({
            appID: newApp[0].id,
            tosLink: appData.features.tosLink,
            privacyPolicyLink: appData.features.privacyPolicyLink,
            textLength: appData.features.textLength,
            trackMessage: appData.features.trackMessage,
            deleteMessage: appData.features.deleteMessage,
            deleteMessageTime: appData.features.deleteMessageTime,
            inviteLinks: appData.features.inviteLinks,
            webhookSupport: appData.features.webhookSupport,
            media: appData.features.media,
            mediaStickers: appData.features.mediaStickers,
            mediaEmojis: appData.features.mediaEmojis,
          })
          .returning();
      }

      return _c_.json({ ...newApp[0], features: appData.features }, 201);
    }
  },
);

//#region Delaunch App
apps.openapi(
  createRoute({
    method: 'delete',
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
        description: 'App successfully delaunched',
      },
      404: {
        description: 'App not found',
      },
    },
  }),
  async (_c_) => {
    const { appName } = _c_.req.valid('param');

    // First check if app exists
    const existingApp = await db.query.app.findFirst({
      where: eq(appTable.name, appName),
    });
    if (!existingApp) {
      throw new ErrorResponse('App not found', 404);
    }

    // Update the app to set delaunch flag to true
    await db.update(appTable).set({ delaunch: true }).where(eq(appTable.name, appName));

    return _c_.json({ message: 'App successfully delaunched' }, 200);
  },
);

//#region Delete App

apps.openapi(
  createRoute({
    method: 'delete',
    path: '/delete/{appName}',
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
        description: 'App successfully deleted',
      },
      404: {
        description: 'App not found',
      },
      403: {
        description: 'App is not delaunched and force delete not requested',
      },
    },
  }),
  async (_c_) => {
    // TODO: check if queue is empty, before deleting
    const { appName } = _c_.req.valid('param');

    // Check if app exists
    const existingApp = await db.query.app.findFirst({
      where: eq(appTable.name, appName),
    });

    if (!existingApp) {
      throw new ErrorResponse("App doesn't exist", 404);
    }

    // Check if app is delaunched or force delete is requested
    const forceDelete = _c_.req.query('force') === 'true';

    if (!existingApp.delaunch && !forceDelete) {
      throw new ErrorResponse('App must be delaunched first or force delete requested', 403);
    }

    // Delete the app and its features
    await db.delete(featureTable).where(eq(featureTable.appID, existingApp.id));

    await db.delete(appTable).where(eq(appTable.name, appName));

    return _c_.json({ message: 'App successfully deleted' }, 200);
  },
);

export default apps;
