import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { hubs, hubsId } from './hubs';

export interface hubSettingsAttributes {
  id: number;
  allowInvites: boolean;
}

export type hubSettingsPk = 'id';
export type hubSettingsId = hubSettings[hubSettingsPk];
export type hubSettingsOptionalAttributes = 'allowInvites';
export type hubSettingsCreationAttributes = Optional<hubSettingsAttributes, hubSettingsOptionalAttributes>;

export class hubSettings extends Model<hubSettingsAttributes, hubSettingsCreationAttributes> implements hubSettingsAttributes {
  id: number;

  allowInvites: boolean;

  // hubSettings belongsTo hubs via id
  id_hub: hubs;

  getId_hub: Sequelize.BelongsToGetAssociationMixin<hubs>;

  setId_hub: Sequelize.BelongsToSetAssociationMixin<hubs, hubsId>;

  createId_hub: Sequelize.BelongsToCreateAssociationMixin<hubs>;

  static initModel(sequelize: Sequelize.Sequelize): typeof hubSettings {
    return hubSettings.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'hubs',
          key: 'id',
        },
      },
      allowInvites: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      tableName: 'hubSettings',
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
