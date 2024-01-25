import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { apps, appsId } from './apps';
import type { hubBridges, hubBridgesId } from './hubBridges';
import type { hubSettings, hubSettingsCreationAttributes, hubSettingsId } from './hubSettings';
import type { userBlocks, userBlocksId } from './userBlocks';

export interface hubsAttributes {
  id: number;
  name: string;
  ownerID: string;
  appID: number;
}

export type hubsPk = 'id';
export type hubsId = hubs[hubsPk];
export type hubsOptionalAttributes = 'id';
export type hubsCreationAttributes = Optional<hubsAttributes, hubsOptionalAttributes>;

export class hubs extends Model<hubsAttributes, hubsCreationAttributes> implements hubsAttributes {
  id: number;

  name: string;

  ownerID: string;

  appID: number;

  // hubs belongsTo apps via appID
  app: apps;

  getApp: Sequelize.BelongsToGetAssociationMixin<apps>;

  setApp: Sequelize.BelongsToSetAssociationMixin<apps, appsId>;

  createApp: Sequelize.BelongsToCreateAssociationMixin<apps>;

  // hubs hasMany hubBridges via hubID
  hubBridges: hubBridges[];

  getHubBridges: Sequelize.HasManyGetAssociationsMixin<hubBridges>;

  setHubBridges: Sequelize.HasManySetAssociationsMixin<hubBridges, hubBridgesId>;

  addHubBridge: Sequelize.HasManyAddAssociationMixin<hubBridges, hubBridgesId>;

  addHubBridges: Sequelize.HasManyAddAssociationsMixin<hubBridges, hubBridgesId>;

  createHubBridge: Sequelize.HasManyCreateAssociationMixin<hubBridges>;

  removeHubBridge: Sequelize.HasManyRemoveAssociationMixin<hubBridges, hubBridgesId>;

  removeHubBridges: Sequelize.HasManyRemoveAssociationsMixin<hubBridges, hubBridgesId>;

  hasHubBridge: Sequelize.HasManyHasAssociationMixin<hubBridges, hubBridgesId>;

  hasHubBridges: Sequelize.HasManyHasAssociationsMixin<hubBridges, hubBridgesId>;

  countHubBridges: Sequelize.HasManyCountAssociationsMixin;

  // hubs hasOne hubSettings via id
  hubSetting: hubSettings;

  getHubSetting: Sequelize.HasOneGetAssociationMixin<hubSettings>;

  setHubSetting: Sequelize.HasOneSetAssociationMixin<hubSettings, hubSettingsId>;

  createHubSetting: Sequelize.HasOneCreateAssociationMixin<hubSettings>;

  // hubs hasMany userBlocks via hubID
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

  static initModel(sequelize: Sequelize.Sequelize): typeof hubs {
    return hubs.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: 'name',
      },
      ownerID: {
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
    }, {
      sequelize,
      tableName: 'hubs',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'name',
          unique: true,
          using: 'HASH',
          fields: [
            { name: 'name' },
          ],
        },
        {
          name: 'FK_hubs_apps',
          using: 'BTREE',
          fields: [
            { name: 'appID' },
          ],
        },
      ],
    });
  }
}
