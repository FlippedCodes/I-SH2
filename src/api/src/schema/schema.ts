import { relations } from 'drizzle-orm';

import {
  integer,
  pgTable,
  boolean,
  timestamp,
  json,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

//#region appTable
export const appTable = pgTable('apps', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  delaunch: boolean('delaunch').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//#region featureTable
export const featureTable = pgTable('features', {
  appID: integer('appID')
    .primaryKey()
    .references(() => appTable.id),
  tosLink: varchar('tosLink', { length: 255 }).notNull(),
  privacyPolicyLink: varchar('privacyPolicyLink', { length: 255 }).notNull(),
  textLength: integer('textLength').notNull().default(0),
  trackMessage: boolean('trackMessage').notNull().default(false),
  deleteMessage: boolean('deleteMessage').notNull().default(false),
  deleteMessageTime: integer('deleteMessageTime').notNull().default(0),
  inviteLinks: boolean('inviteLinks').notNull().default(false),
  webhookSupport: boolean('webhookSupport').notNull().default(false),
  media: boolean('media').notNull().default(false),
  mediaStickers: boolean('mediaStickers').notNull().default(false),
  mediaEmojis: boolean('mediaEmojis').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//#region hubTable
export const hubTable = pgTable('hubs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  ownerID: varchar('ownerID', { length: 255 }).notNull(),
  appID: integer('appID')
    .notNull()
    .references(() => appTable.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//#region hubBridgeTable
export const hubBridgeTable = pgTable(
  'hubBridges',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    appID: integer('appID')
      .notNull()
      .references(() => appTable.id),
    hubID: integer('hubID')
      .notNull()
      .references(() => hubTable.id),
    additionalData: json('additionalData'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    id_data_app: unique().on(t.id, t.appID, t.hubID),
  }),
);

//#region hubSettingTable
export const hubSettingTable = pgTable('hubSettings', {
  id: integer('id')
    .primaryKey()
    .references(() => hubTable.id),
  allowInvites: boolean('allowInvites').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//#region userBlockTable
export const userBlockTable = pgTable(
  'userBlocks',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userID: varchar('userID', { length: 255 }).notNull(),
    appID: integer('appID')
      .notNull()
      .references(() => appTable.id),
    channelID: varchar('channelID', { length: 255 })
      .notNull()
      .references(() => hubBridgeTable.id),
    hubID: integer('hubID')
      .notNull()
      .references(() => hubTable.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    userID_appID_channelID_hubID: unique().on(
      t.userID,
      t.appID,
      t.channelID,
      t.hubID,
    ),
  }),
);

//#region userToSAgreeTable
export const userToSAgreeTable = pgTable('userToSAgrees', {
  userID: varchar('userID', { length: 255 }).primaryKey(),
  appID: integer('appID')
    .notNull()
    .references(() => appTable.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//#region messageLinkTable
export const messageLinkTable = pgTable(
  'messageLinks',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    messageID: varchar('messageID', { length: 255 }),
    channelID: varchar('channelID', { length: 255 }).references(
      () => hubBridgeTable.id,
    ),
    linkID: varchar('linkID', { length: 255 }),
    appID: integer('appID')
      .notNull()
      .references(() => appTable.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    messageID_channelID: unique().on(t.messageID, t.channelID),
  }),
);

//#region appRelations
export const appRelations = relations(appTable, ({ many, one }) => ({
  feature: one(featureTable, { fields: [appTable.id], references: [featureTable.appID] }),
  hubs: many(hubTable),
  userToSAgrees: many(userToSAgreeTable),
  userBlocks: many(userBlockTable),
  hubBridges: many(hubBridgeTable),
  messageLinks: many(messageLinkTable),
}));

//#region hubRelations
export const hubRelations = relations(hubTable, ({ many, one }) => ({
  userBlocks: many(userBlockTable),
  hubSetting: one(hubSettingTable, {
    fields: [hubTable.id],
    references: [hubSettingTable.id],
  }),
  app: one(appTable, { fields: [hubTable.id], references: [appTable.id] }),
}));

//#region userToSAgreeRelations
export const userToSAgreeRelations = relations(userToSAgreeTable, ({ one }) => ({
  app: one(appTable, {
    fields: [userToSAgreeTable.appID],
    references: [appTable.id],
  }),
}));

//#region hubBridgeRelations
export const hubBridgeRelations = relations(hubBridgeTable, ({ one, many }) => ({
  app: one(appTable, { fields: [hubBridgeTable.appID], references: [appTable.id] }),
  userBlocks: many(userBlockTable),
}));

//#region userBlockRelations
export const userBlockRelations = relations(userBlockTable, ({ one }) => ({
  app: one(appTable, { fields: [userBlockTable.appID], references: [appTable.id] }),
  hub: one(hubTable, { fields: [userBlockTable.hubID], references: [hubTable.id] }),
  hubBridge: one(hubBridgeTable, {
    fields: [userBlockTable.channelID],
    references: [hubBridgeTable.id],
  }),
}));

//#region messageLinkRelations
export const messageLinkRelations = relations(messageLinkTable, ({ one }) => ({
  app: one(appTable, {
    fields: [messageLinkTable.appID],
    references: [appTable.id],
  }),
  hubBridges: one(hubBridgeTable, {
    fields: [messageLinkTable.channelID],
    references: [hubBridgeTable.id],
  }),
}));

//#region featureRelations
export const featureRelations = relations(featureTable, ({ one }) => ({
  app: one(appTable, { fields: [featureTable.appID], references: [appTable.id] }),
}));

export const schema = {
  app: appTable,
  feature: featureTable,
  appRelations,
};