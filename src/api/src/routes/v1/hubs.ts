import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi';
import { ErrorResponse } from 'hono-error-handler';
import { eq, and } from 'drizzle-orm';

import { db } from '../../index';
import {
  hubTable,
  hubSettingTable,
  appTable,
  // userBlockTable,
  // messageLinksTable,
} from '../../schema/schema';
import {
  hubSchema,
  hubSchemaFull,
  hubSettingSchema,
  hubSettingSchemaFull,
  // userBlockSchema,
  // messageLinksSchema,
} from '../../zodSchemas';

const hubs = new OpenAPIHono();

//#region Get Hubs by Owner and app
hubs.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: {
      query: z.object({
        appName: z
          .string()
          .optional()
          .openapi({
            param: {
              name: 'appName',
              in: 'query',
            },
            example: 'discord',
          }),
        ownerId: z
          .string()
          .optional()
.openapi({
          param: {
            name: 'ownerId',
            in: 'query',
          },
          example: 'user123',
        }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(hubSchema.openapi('Hub')).openapi('HubList'),
          },
        },
        description: 'Retrieve list of hubs',
      },
400: { description: 'Missing parameter' },
      404: { description: 'No hubs found' },
    },
  }),
  async (_c_) => {
    const { appName, ownerId } = _c_.req.valid('query');

    if (!(appName && ownerId)) throw new ErrorResponse('Missing parameter', 400);

    console.log({ appName, ownerId });

    // const results = await db.query.hub.findMany({
    //   where: and(
    //     eq(appTable.name, appName),
    //     eq(hubTable.ownerID, ownerId)
    //   ),
    //   with: { app: true }
    // });
    // manual join required. seems like drizzle tries to find the appName in the hub table
    const results = await db
      .select()
      .from(hubTable)
      .innerJoin(appTable, eq(hubTable.appID, appTable.id))
      .where(and(eq(appTable.name, appName), eq(hubTable.ownerID, ownerId)));
    if (!results || results.length === 0) throw new ErrorResponse('No hubs found', 404);
    const output = results.map((result) => ({
      id: result.hubs.id,
      name: result.hubs.name,
    }));
    return _c_.json(output, 200);
  },
);

//#region Create Hub
hubs.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: hubSchema.openapi('HubWithSettingsInput'),
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: hubSchemaFull.extend({ settings: hubSettingSchemaFull }).openapi('Hub'),
          },
        },
        description: 'Hub created successfully',
      },
      400: {
        description:
'App not registered | Hub already exists | Hub name too long | Invalid request data',
      },
    },
  }),
  async (_c_) => {
    const hubData = _c_.req.valid('json');

    // Check if app exists and appid
    const app = await db.query.app.findFirst({
      where: eq(appTable.name, hubData.appName),
    });
    if (!app) throw new ErrorResponse('App not registered', 400);

    const sterilizedHubData = {
      name: hubData.name.replaceAll(' ', '_'),
      appID: app.id,
      ownerID: hubData.ownerID,
    };

    // check length of hub name
    if (sterilizedHubData.name.length > 255) throw new ErrorResponse('Hub name too long', 400);

    // Check if hub with this name already exists
    const existingHub = await db.query.hub.findFirst({
      where: eq(hubTable.name, sterilizedHubData.name),
    });
    if (existingHub) throw new ErrorResponse('Hub already exists', 400);

    // Create new hub
    const newHub = await db.insert(hubTable).values(sterilizedHubData).returning();

    // Create hub settings
    const newHubSetting = await db
      .insert(hubSettingTable)
      .values({
        id: newHub[0].id,
        allowInvites: undefined,
      })
      .returning();

    return _c_.json({ ...newHub[0], settings: newHubSetting[0] }, 201);
  },
);

//#region Get Hub
hubs.openapi(
  createRoute({
    method: 'get',
    path: '/{hubName}',
    request: {
      params: z.object({
        hubName: z.string().openapi({
          param: {
            name: 'hubName',
            in: 'path',
          },
          example: '123456789_foobar',
        }),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: hubSchemaFull.openapi('Hub'),
          },
        },
        description: 'Retrieve specific hub.',
      },
      404: { description: 'Hub not found' },
    },
  }),
  async (_c_) => {
    const { hubName } = _c_.req.valid('param');
    const result = await db.query.hub.findFirst({
      where: eq(hubTable.name, hubName),
      with: {
        hubSetting: true,
        app: true,
      },
    });
    if (!result) throw new ErrorResponse('Hub not found', 404);
    return _c_.json(result, 200);
  },
);

//#region Delete Hub
hubs.openapi(
  createRoute({
    method: 'delete',
    path: '/',
    request: {
      query: z.object({
        hubName: z
          .string()
          .optional()
          .openapi({
            param: {
              name: 'hubName',
              in: 'query',
            },
            example: '123456789_foobar',
          }),
        ownerId: z
          .string()
          .optional()
          .openapi({
            param: {
              name: 'ownerId',
              in: 'query',
            },
            example: 'user123',
          }),
      }),
    },
    responses: {
      200: { description: 'Hub deleted' },
      404: { description: 'Hub not found' },
    },
  }),
  async (_c_) => {
    const { hubName, ownerId } = _c_.req.valid('query');
    const result = await db
      .delete(hubTable)
      .where(and(eq(hubTable.name, hubName), eq(hubTable.ownerID, ownerId)))
      .returning();
    if (result.length === 0) throw new ErrorResponse('Hub not found', 404);
    return _c_.json(result, 200);
  },
);

// hubs
//   // get: identifier; ownerId; searchString
//   // not sure if broadcast command should be removed, as this would need to be pagenated.
//   .get('/')
//   // post: name, ownerID, ownerAppIdentifier
//   .post();

// hubs
//   // get: lists settings and connected channels
//   .get('/:hubId')
//   // put: name, ownerID, ownerAppIdentifier
//   .put()
//   // delete
//   .delete();

export default hubs;
