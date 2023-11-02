import sequelize from 'sequelize';

const bridgedChannel = sequelize.define('bridged_channel', {
  channelID: {
    type: sequelize.STRING(100),
    primaryKey: true,
    unique: true,
  },
  serverID: {
    type: sequelize.STRING(100),
    allowNull: true,
  },
  platform: {
    type: sequelize.STRING(30),
    allowNull: false,
  },
  hubID: {
    type: sequelize.INTEGER(11),
    allowNull: false,
  },
},
{
  uniqueKeys: {
    uniqueLink: {
      fields: ['serverID', 'plattform', 'hubID'],
    },
  },
});

export default bridgedChannel;