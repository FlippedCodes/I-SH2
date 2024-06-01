import { relations } from 'drizzle-orm';

import {
  int, mysqlTable, boolean, timestamp, json, unique, varchar,
} from 'drizzle-orm/mysql-core';

export const app = mysqlTable('apps', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const feature = mysqlTable('features', {
  appID: int('appID').primaryKey().references(() => app.id),
  trackMessage: boolean('trackMessage').notNull().default(false),
  deleteMessage: boolean('deleteMessage').notNull().default(false),
  webhookSupport: boolean('webhookSupport').notNull().default(false),
  inviteLinks: boolean('inviteLinks').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const hub = mysqlTable('hubs', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  ownerID: varchar('ownerID', { length: 255 }).notNull(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const hubBridge = mysqlTable('hubBridges', {
  id: varchar('id', { length: 255 }).primaryKey(),
  appID: int('appID').notNull().references(() => app.id),
  hubID: int('hubID').notNull().references(() => hub.id),
  additionalData: json('additionalData'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({
  id_data_app: unique().on(t.id, t.appID, t.hubID),
}));

export const hubSetting = mysqlTable('hubSettings', {
  id: int('id').primaryKey().references(() => hub.id),
  allowInvites: boolean('allowInvites').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const userBlock = mysqlTable('userBlocks', {
  id: int('id').primaryKey().autoincrement(),
  userID: varchar('userID', { length: 255 }).notNull(),
  appID: int('appID').notNull().references(() => app.id),
  channelID: varchar('channelID', { length: 255 }).notNull().references(() => hubBridge.id),
  hubID: int('hubID').notNull().references(() => hub.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({
  userID_appID_channelID_hubID: unique().on(t.userID, t.appID, t.channelID, t.hubID),
}));

export const userToSAgree = mysqlTable('userToSAgrees', {
  userID: varchar('userID', { length: 255 }).primaryKey(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const messageLink = mysqlTable('messageLinks', {
  messageID: varchar('messageID', { length: 255 }).primaryKey(),
  channelID: varchar('channelID', { length: 255 }).references(() => hubBridge.id),
  linkID: varchar('linkID', { length: 255 }).primaryKey(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({
  messageID_channelID: unique().on(t.messageID, t.channelID),
}));

export const appRelations = relations(app, ({ many, one }) => ({
  feature: one(feature, { fields: [app.id], references: [feature.appID] }),
  hubs: many(hub),
  userToSAgrees: many(userToSAgree),
  userBlocks: many(userBlock),
  hubBridges: many(hubBridge),
  messageLinks: many(messageLink),
}));

export const hubRelations = relations(hub, ({ many, one }) => ({
  userBlocks: many(userBlock),
  hubSetting: one(hubSetting, { fields: [hub.id], references: [hubSetting.id] }),
  app: one(app, { fields: [hub.id], references: [app.id] }),
}));

export const userToSAgreeRelations = relations(userToSAgree, ({ one }) => ({
  app: one(app, { fields: [userToSAgree.appID], references: [app.id] }),
}));

export const hubBridgeRelations = relations(hubBridge, ({ one, many }) => ({
  app: one(app, { fields: [hubBridge.appID], references: [app.id] }),
  userBlocks: many(userBlock),
}));

export const userBlockRelations = relations(userBlock, ({ one }) => ({
  app: one(app, { fields: [userBlock.appID], references: [app.id] }),
  hub: one(hub, { fields: [userBlock.hubID], references: [hub.id] }),
  hubBridge: one(hubBridge, { fields: [userBlock.channelID], references: [hubBridge.id] }),
}));

export const messageLinkRelations = relations(messageLink, ({ one }) => ({
  app: one(app, { fields: [messageLink.appID], references: [app.id] }),
  hubBridges: one(hubBridge, { fields: [messageLink.channelID], references: [hubBridge.id] }),
}));

export const featureRelations = relations(feature, ({ one }) => ({
  app: one(app, { fields: [feature.appID], references: [app.id] }),
}));
