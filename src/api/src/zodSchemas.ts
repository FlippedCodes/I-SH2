// schema/zodSchemas.ts
import { createSelectSchema } from 'drizzle-zod';
import { featureTable, appTable, hubTable, hubSettingTable } from './schema/schema';
import z from 'zod';

export const featureSchemaFull = createSelectSchema(featureTable);
export const appSchemaFull = createSelectSchema(appTable);
export const hubSchemaFull = createSelectSchema(hubTable);
export const hubSettingSchemaFull = createSelectSchema(hubSettingTable);

// Create filtered schemas, that are the data, that gets requested off the user

export const appWithFeaturesSchema = featureSchemaFull.omit({
  appID: true,
  createdAt: true,
  updatedAt: true,
});
export const appSchema = appSchemaFull.omit({
  id: true,
  delaunch: true,
  createdAt: true,
  updatedAt: true,
});

// export const hubSchema = hubSchemaFull.omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

export const hubSchema = z.object({
  appName: z.string(),
  ownerID: z.string(),
  name: z.string(),
});

export const hubSettingSchema = hubSettingSchemaFull.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
