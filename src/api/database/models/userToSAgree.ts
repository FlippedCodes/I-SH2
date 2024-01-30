import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { apps, appsId } from '../sequelize-auto/apps';

export interface userToSAgreeAttributes {
  userID: string;
  appID: number;
}

export type userToSAgreePk = 'userID';
export type userToSAgreeId = userToSAgree[userToSAgreePk];
export type userToSAgreeCreationAttributes = userToSAgreeAttributes;

export class userToSAgree extends Model<userToSAgreeAttributes, userToSAgreeCreationAttributes> implements userToSAgreeAttributes {
  userID: string;

  appID: number;

  // userToSAgree belongsTo apps via appID
  app: apps;

  getApp: Sequelize.BelongsToGetAssociationMixin<apps>;

  setApp: Sequelize.BelongsToSetAssociationMixin<apps, appsId>;

  createApp: Sequelize.BelongsToCreateAssociationMixin<apps>;

  static initModel(sequelize: Sequelize.Sequelize): typeof userToSAgree {
    return userToSAgree.init({
      userID: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
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
      tableName: 'userToSAgrees',
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'userID' },
          ],
        },
        {
          name: 'FK_userToSAgree_apps',
          using: 'BTREE',
          fields: [
            { name: 'appID' },
          ],
        },
      ],
    });
  }
}
