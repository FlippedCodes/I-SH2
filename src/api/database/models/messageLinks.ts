import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { apps, appsId } from './apps';
import type { hubBridges, hubBridgesId } from './hubBridges';

export interface messageLinksAttributes {
  messageID: string;
  channelID: string;
  linkID: string;
  appID: number;
}

export type messageLinksPk = "messageID";
export type messageLinksId = messageLinks[messageLinksPk];
export type messageLinksOptionalAttributes = "messageID";
export type messageLinksCreationAttributes = Optional<messageLinksAttributes, messageLinksOptionalAttributes>;

export class messageLinks extends Model<messageLinksAttributes, messageLinksCreationAttributes> implements messageLinksAttributes {
  messageID: string;
  channelID: string;
  linkID: string;
  appID: number;

  // messageLinks belongsTo apps via appID
  app: apps;
  getApp: Sequelize.BelongsToGetAssociationMixin<apps>;
  setApp: Sequelize.BelongsToSetAssociationMixin<apps, appsId>;
  createApp: Sequelize.BelongsToCreateAssociationMixin<apps>;
  // messageLinks belongsTo hubBridges via channelID
  channel: hubBridges;
  getChannel: Sequelize.BelongsToGetAssociationMixin<hubBridges>;
  setChannel: Sequelize.BelongsToSetAssociationMixin<hubBridges, hubBridgesId>;
  createChannel: Sequelize.BelongsToCreateAssociationMixin<hubBridges>;

  static initModel(sequelize: Sequelize.Sequelize): typeof messageLinks {
    return messageLinks.init({
    messageID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    channelID: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'hubBridges',
        key: 'channelID'
      }
    },
    linkID: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    appID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'apps',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'messageLinks',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "messageID" },
        ]
      },
      {
        name: "messageUnique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "messageID" },
          { name: "channelID" },
        ]
      },
      {
        name: "FK_messageLinks_hubBridges",
        using: "BTREE",
        fields: [
          { name: "channelID" },
        ]
      },
      {
        name: "FK_messageLinks_apps",
        using: "BTREE",
        fields: [
          { name: "appID" },
        ]
      },
    ]
  });
  }
}
