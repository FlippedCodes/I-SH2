import { relations } from 'drizzle-orm';

import {
  int, mysqlTable, boolean, tinytext, timestamp, json, unique, varchar
} from 'drizzle-orm/mysql-core';

export const app = mysqlTable('apps', {
  id: int('id').primaryKey().autoincrement(),
  name: tinytext('name').notNull(),
  trackMessage: boolean('trackMessage').notNull().default(false),
  deleteMessage: boolean('deleteMessage').notNull().default(false),
  webhookSupport: boolean('webhookSupport').notNull().default(false),
  inviteLinks: boolean('inviteLinks').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const hub = mysqlTable('hubs', {
  id: int('id').primaryKey().autoincrement(),
  name: tinytext('name').notNull().unique(),
  ownerID: tinytext('ownerID').notNull(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const hubBridge = mysqlTable('hubBridges', {
  id: varchar('id', [255]).primaryKey(),
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
  userID: tinytext('userID').notNull(),
  appID: int('appID').notNull().references(() => app.id),
  channelID: varchar('channelID', [255]).notNull().references(() => hubBridge.id),
  hubID: int('hubID').notNull().references(() => hub.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({
  userID_appID_channelID_hubID: unique().on(t.userID, t.appID, t.channelID, t.hubID),
}));

export const userToSAgree = mysqlTable('userToSAgrees', {
  userID: varchar('userID', [255]).primaryKey(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const messageLink = mysqlTable('messageLinks', {
  messageID: varchar('messageID', [255]).primaryKey(),
  channelID: varchar('channelID', [255]).references(() => hubBridge.id),
  linkID: tinytext('linkID').primaryKey(),
  appID: int('appID').notNull().references(() => app.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (t) => ({
  messageID_channelID: unique().on(t.messageID, t.channelID),
}));

export const appRelations = relations(app, ({ many }) => ({
  hubs: many(hub),
  userToSAgrees: many(userToSAgree),
  userBlocks: many(userBlock),
  hubBridges: many(hubBridge),
  messageLinks: many(messageLink),
}));

export const hubRelations = relations(hub, ({ many, one }) => ({
  hubSettings: many(hubSetting),
  userBlocks: many(userBlock),
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
