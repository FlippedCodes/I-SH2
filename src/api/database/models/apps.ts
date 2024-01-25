import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hubBridges, hubBridgesId } from './hubBridges';
import type { hubs, hubsId } from './hubs';
import type { messageLinks, messageLinksId } from './messageLinks';
import type { userBlocks, userBlocksId } from './userBlocks';

export interface appsAttributes {
  id: number;
  name: string;
  feature1: string;
}

export type appsPk = 'id';
export type appsId = apps[appsPk];
export type appsOptionalAttributes = 'id';
export type appsCreationAttributes = Optional<appsAttributes, appsOptionalAttributes>;

export class apps extends Model<appsAttributes, appsCreationAttributes> implements appsAttributes {
  id: number;

  name: string;

  feature1: string;

  // apps hasMany hubBridges via appID
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

  // apps hasMany hubs via appID
  hubs: hubs[];

  getHubs: Sequelize.HasManyGetAssociationsMixin<hubs>;

  setHubs: Sequelize.HasManySetAssociationsMixin<hubs, hubsId>;

  addHub: Sequelize.HasManyAddAssociationMixin<hubs, hubsId>;

  addHubs: Sequelize.HasManyAddAssociationsMixin<hubs, hubsId>;

  createHub: Sequelize.HasManyCreateAssociationMixin<hubs>;

  removeHub: Sequelize.HasManyRemoveAssociationMixin<hubs, hubsId>;

  removeHubs: Sequelize.HasManyRemoveAssociationsMixin<hubs, hubsId>;

  hasHub: Sequelize.HasManyHasAssociationMixin<hubs, hubsId>;

  hasHubs: Sequelize.HasManyHasAssociationsMixin<hubs, hubsId>;

  countHubs: Sequelize.HasManyCountAssociationsMixin;

  // apps hasMany messageLinks via appID
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

  // apps hasMany userBlocks via appID
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

  static initModel(sequelize: Sequelize.Sequelize): typeof apps {
    return apps.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      feature1: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'apps',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
  }
}
