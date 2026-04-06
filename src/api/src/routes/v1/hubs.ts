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
      404: {
        description: 'Hub not found',
      },
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
        description: 'App not registered | Hub already exists | Invalid request data',
      },
    },
  }),
  async (_c_) => {
    const hubData = _c_.req.valid('json');

    // Check if app exists
    const usedApp = await db.query.app.findFirst({
      where: eq(appTable.id, hubData.appID),
    });
    if (!usedApp) throw new ErrorResponse('App not registered', 400);

    // Check if hub with this name already exists
    const existingHub = await db.query.hub.findFirst({
      where: eq(hubTable.name, hubData.name),
    });
    if (existingHub) throw new ErrorResponse('Hub already exists', 400);

    // Create new hub
    const newHub = await db.insert(hubTable).values(hubData).returning();

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

export default hubs;
