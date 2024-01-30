import type { Sequelize } from 'sequelize';
import { apps as _apps } from '../models/apps';
import type { appsAttributes, appsCreationAttributes } from '../models/apps';
import { hubBridges as _hubBridges } from '../models/hubBridges';
import type { hubBridgesAttributes, hubBridgesCreationAttributes } from '../models/hubBridges';
import { hubSettings as _hubSettings } from '../models/hubSettings';
import type { hubSettingsAttributes, hubSettingsCreationAttributes } from '../models/hubSettings';
import { hubs as _hubs } from '../models/hubs';
import type { hubsAttributes, hubsCreationAttributes } from '../models/hubs';
import { messageLinks as _messageLinks } from '../models/messageLinks';
import type { messageLinksAttributes, messageLinksCreationAttributes } from '../models/messageLinks';
import { userBlocks as _userBlocks } from '../models/userBlocks';
import type { userBlocksAttributes, userBlocksCreationAttributes } from '../models/userBlocks';
import { userToSAgree as _userToSAgree } from './userToSAgree';
import type { userToSAgreeAttributes, userToSAgreeCreationAttributes } from './userToSAgree';

export {
  _apps as apps,
  _hubBridges as hubBridges,
  _hubSettings as hubSettings,
  _hubs as hubs,
  _messageLinks as messageLinks,
  _userBlocks as userBlocks,
  _userToSAgree as userToSAgree,
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
  userToSAgreeAttributes,
  userToSAgreeCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const apps = _apps.initModel(sequelize);
  const hubBridges = _hubBridges.initModel(sequelize);
  const hubSettings = _hubSettings.initModel(sequelize);
  const hubs = _hubs.initModel(sequelize);
  const messageLinks = _messageLinks.initModel(sequelize);
  const userBlocks = _userBlocks.initModel(sequelize);
  const userToSAgree = _userToSAgree.initModel(sequelize);

  hubBridges.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(hubBridges, { as: 'hubBridges', foreignKey: 'appID' });
  hubs.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(hubs, { as: 'hubs', foreignKey: 'appID' });
  messageLinks.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(messageLinks, { as: 'messageLinks', foreignKey: 'appID' });
  userBlocks.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(userBlocks, { as: 'userBlocks', foreignKey: 'appID' });
  userToSAgree.belongsTo(apps, { as: 'app', foreignKey: 'appID' });
  apps.hasMany(userToSAgree, { as: 'userToSAgrees', foreignKey: 'appID' });
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
    userToSAgree,
  };
}
