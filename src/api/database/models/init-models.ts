import type { Sequelize } from 'sequelize';
import { apps as _apps } from './apps';
import type { appsAttributes, appsCreationAttributes } from './apps';
import { hubBridges as _hubBridges } from './hubBridges';
import type { hubBridgesAttributes, hubBridgesCreationAttributes } from './hubBridges';
import { hubSettings as _hubSettings } from './hubSettings';
import type { hubSettingsAttributes, hubSettingsCreationAttributes } from './hubSettings';
import { hubs as _hubs } from './hubs';
import type { hubsAttributes, hubsCreationAttributes } from './hubs';
import { messageLinks as _messageLinks } from './messageLinks';
import type { messageLinksAttributes, messageLinksCreationAttributes } from './messageLinks';
import { userBlocks as _userBlocks } from './userBlocks';
import type { userBlocksAttributes, userBlocksCreationAttributes } from './userBlocks';

export {
  _apps as apps,
  _hubBridges as hubBridges,
  _hubSettings as hubSettings,
  _hubs as hubs,
  _messageLinks as messageLinks,
  _userBlocks as userBlocks,
};

export type {
  appsAttributes,
  appsCreationAttributes,
  hubBridgesAttributes,
  hubBridgesCreationAttributes,
  hubSettingsAttributes,
  hubSettingsCreationAttributes,
  hubsAttributes,
  hubsCreationAttributes,
  messageLinksAttributes,
  messageLinksCreationAttributes,
  userBlocksAttributes,
  userBlocksCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const apps = _apps.initModel(sequelize);
  const hubBridges = _hubBridges.initModel(sequelize);
  const hubSettings = _hubSettings.initModel(sequelize);
  const hubs = _hubs.initModel(sequelize);
  const messageLinks = _messageLinks.initModel(sequelize);
  const userBlocks = _userBlocks.initModel(sequelize);

  hubBridges.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(hubBridges, { as: 'hubBridges', foreignKey: 'appID' });
  hubs.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(hubs, { as: 'hubs', foreignKey: 'appID' });
  messageLinks.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(messageLinks, { as: 'messageLinks', foreignKey: 'appID' });
  userBlocks.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(userBlocks, { as: 'userBlocks', foreignKey: 'appID' });
  messageLinks.belongsTo(hubBridges, { as: 'channel', foreignKey: 'channelID' });
  hubBridges.hasMany(messageLinks, { as: 'messageLinks', foreignKey: 'channelID' });
  userBlocks.belongsTo(hubBridges, { as: 'channel', foreignKey: 'channelID' });
  hubBridges.hasMany(userBlocks, { as: 'userBlocks', foreignKey: 'channelID' });
  hubBridges.belongsTo(hubs, { as: 'hub', foreignKey: 'hubID' });
  hubs.hasMany(hubBridges, { as: 'hubBridges', foreignKey: 'hubID' });
  hubSettings.belongsTo(hubs, { as: 'id_hub', foreignKey: 'id' });
  hubs.hasOne(hubSettings, { as: 'hubSetting', foreignKey: 'id' });
  userBlocks.belongsTo(hubs, { as: 'hub', foreignKey: 'hubID' });
  hubs.hasMany(userBlocks, { as: 'userBlocks', foreignKey: 'hubID' });

  return {
    apps,
    hubBridges,
    hubSettings,
    hubs,
    messageLinks,
    userBlocks,
  };
}
