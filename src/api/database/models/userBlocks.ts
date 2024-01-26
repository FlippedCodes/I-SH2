import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { apps, appsId } from './apps';
import type { hubBridges, hubBridgesId } from './hubBridges';
import type { hubs, hubsId } from './hubs';

export interface userBlocksAttributes {
  blockID: number;
  userID: string;
  appID: number;
  channelID: string;
  hubID: number;
  reason: string;
  acknowledged: number;
}

export type userBlocksPk = 'blockID';
export type userBlocksId = userBlocks[userBlocksPk];
export type userBlocksOptionalAttributes = 'blockID' | 'acknowledged';
export type userBlocksCreationAttributes = Optional<userBlocksAttributes, userBlocksOptionalAttributes>;

export class userBlocks extends Model<userBlocksAttributes, userBlocksCreationAttributes> implements userBlocksAttributes {
  blockID: number;

  userID: string;

  appID: number;

  channelID: string;

  hubID: number;

  reason: string;

  acknowledged: number;

  // userBlocks belongsTo apps via appID
  app: apps;

  getApp: Sequelize.BelongsToGetAssociationMixin<apps>;

  setApp: Sequelize.BelongsToSetAssociationMixin<apps, appsId>;

  createApp: Sequelize.BelongsToCreateAssociationMixin<apps>;

  // userBlocks belongsTo hubBridges via channelID
  channel: hubBridges;

  getChannel: Sequelize.BelongsToGetAssociationMixin<hubBridges>;

  setChannel: Sequelize.BelongsToSetAssociationMixin<hubBridges, hubBridgesId>;

  createChannel: Sequelize.BelongsToCreateAssociationMixin<hubBridges>;

  // userBlocks belongsTo hubs via hubID
  hub: hubs;

  getHub: Sequelize.BelongsToGetAssociationMixin<hubs>;

  setHub: Sequelize.BelongsToSetAssociationMixin<hubs, hubsId>;

  createHub: Sequelize.BelongsToCreateAssociationMixin<hubs>;

  static initModel(sequelize: Sequelize.Sequelize): typeof userBlocks {
    return userBlocks.init({
      blockID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.TEXT('tiny'),
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
      channelID: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: 'hubBridges',
          key: 'channelID',
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
      reason: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
      acknowledged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      tableName: 'userBlocks',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'blockID' },
          ],
        },
        {
          name: 'blockUnique',
          unique: true,
          using: 'HASH',
          fields: [
            { name: 'userID' },
            { name: 'channelID' },
            { name: 'hubID' },
            { name: 'appID' },
          ],
        },
        {
          name: 'FK_userBlocks_hubs',
          using: 'BTREE',
          fields: [
            { name: 'hubID' },
          ],
        },
        {
          name: 'FK_userBlocks_hubBridges',
          using: 'BTREE',
          fields: [
            { name: 'channelID' },
          ],
        },
        {
          name: 'FK_userBlocks_apps',
          using: 'BTREE',
          fields: [
            { name: 'appID' },
          ],
        },
      ],
    });
  }
}
