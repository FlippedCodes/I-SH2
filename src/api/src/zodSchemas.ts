// schema/zodSchemas.ts
import { createSelectSchema } from 'drizzle-zod';
import { featureTable, appTable } from './schema/schema';

export const featureSchemaFull = createSelectSchema(featureTable);
export const appSchemaFull = createSelectSchema(appTable);

// Create filtered versions without createdAt and updatedAt
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
