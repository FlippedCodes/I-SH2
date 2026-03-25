// schema/zodSchemas.ts
import { createSelectSchema } from 'drizzle-zod';
import { featureTable, appTable } from './schema';

export const featureSchemaFull = createSelectSchema(featureTable);
export const appSchemaFull = createSelectSchema(appTable);

// Create filtered versions without createdAt and updatedAt
export const featureSchema = featureSchemaFull.omit({
  createdAt: true,
  updatedAt: true,
});
export const appSchema = appSchemaFull.omit({
  createdAt: true,
  updatedAt: true,
});
