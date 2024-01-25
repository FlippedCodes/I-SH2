import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { apps, appsId } from './apps';
import type { hubs, hubsId } from './hubs';
import type { messageLinks, messageLinksId } from './messageLinks';
import type { userBlocks, userBlocksId } from './userBlocks';

export interface hubBridgesAttributes {
  channelID: string;
  additionalData: string;
  appID: number;
  hubID: number;
}

export type hubBridgesPk = 'channelID';
export type hubBridgesId = hubBridges[hubBridgesPk];
export type hubBridgesCreationAttributes = hubBridgesAttributes;

export class hubBridges extends Model<hubBridgesAttributes, hubBridgesCreationAttributes> implements hubBridgesAttributes {
  channelID: string;

  additionalData: string;

  appID: number;

  hubID: number;

  // hubBridges belongsTo apps via appID
  app: apps;

  getApp: Sequelize.BelongsToGetAssociationMixin<apps>;

  setApp: Sequelize.BelongsToSetAssociationMixin<apps, appsId>;

  createApp: Sequelize.BelongsToCreateAssociationMixin<apps>;

  // hubBridges hasMany messageLinks via channelID
  messageLinks: messageLinks[];

  getMessageLinks: Sequelize.HasManyGetAssociationsMixin<messageLinks>;

  setMessageLinks: Sequelize.HasManySetAssociationsMixin<messageLinks, messageLinksId>;

  addMessageLink: Sequelize.HasManyAddAssociationMixin<messageLinks, messageLinksId>;

  addMessageLinks: Sequelize.HasManyAddAssociationsMixin<messageLinks, messageLinksId>;

  createMessageLink: Sequelize.HasManyCreateAssociationMixin<messageLinks>;

  removeMessageLink: Sequelize.HasManyRemoveAssociationMixin<messageLinks, messageLinksId>;

  removeMessageLinks: Sequelize.HasManyRemoveAssociationsMixin<messageLinks, messageLinksId>;

  hasMessageLink: Sequelize.HasManyHasAssociationMixin<messageLinks, messageLinksId>;

  hasMessageLinks: Sequelize.HasManyHasAssociationsMixin<messageLinks, messageLinksId>;

  countMessageLinks: Sequelize.HasManyCountAssociationsMixin;

  // hubBridges hasMany userBlocks via channelID
  userBlocks: userBlocks[];

  getUserBlocks: Sequelize.HasManyGetAssociationsMixin<userBlocks>;

  setUserBlocks: Sequelize.HasManySetAssociationsMixin<userBlocks, userBlocksId>;

  addUserBlock: Sequelize.HasManyAddAssociationMixin<userBlocks, userBlocksId>;

  addUserBlocks: Sequelize.HasManyAddAssociationsMixin<userBlocks, userBlocksId>;

  createUserBlock: Sequelize.HasManyCreateAssociationMixin<userBlocks>;

  removeUserBlock: Sequelize.HasManyRemoveAssociationMixin<userBlocks, userBlocksId>;

  removeUserBlocks: Sequelize.HasManyRemoveAssociationsMixin<userBlocks, userBlocksId>;

  hasUserBlock: Sequelize.HasManyHasAssociationMixin<userBlocks, userBlocksId>;

  hasUserBlocks: Sequelize.HasManyHasAssociationsMixin<userBlocks, userBlocksId>;

  countUserBlocks: Sequelize.HasManyCountAssociationsMixin;

  // hubBridges belongsTo hubs via hubID
  hub: hubs;

  getHub: Sequelize.BelongsToGetAssociationMixin<hubs>;

  setHub: Sequelize.BelongsToSetAssociationMixin<hubs, hubsId>;

  createHub: Sequelize.BelongsToCreateAssociationMixin<hubs>;

  static initModel(sequelize: Sequelize.Sequelize): typeof hubBridges {
    return hubBridges.init({
      channelID: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: "TINYTEXT can't be used as a pimary",
      },
      additionalData: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      appID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'apps',
          key: 'id',
        },
      },
      hubID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'hubs',
          key: 'id',
        },
      },
    }, {
      sequelize,
      tableName: 'hubBridges',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'channelID' },
          ],
        },
        {
          name: 'channelID_data_app',
          unique: true,
          using: 'HASH',
          fields: [
            { name: 'channelID' },
            { name: 'additionalData' },
            { name: 'appID' },
          ],
        },
        {
          name: 'FK_hubBridges_apps',
          using: 'BTREE',
          fields: [
            { name: 'appID' },
          ],
        },
        {
          name: 'FK_hubBridges_hubs',
          using: 'BTREE',
          fields: [
            { name: 'hubID' },
          ],
        },
      ],
    });
  }
}
