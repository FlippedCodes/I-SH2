import sequelize from 'sequelize';

const messageLink = sequelize.define('message_link', {
  messageInstanceID: {
    type: sequelize.STRING(30),
    allowNull: false,
  },
  messageID: {
    type: sequelize.STRING(100),
    primaryKey: true,
  },
  channelID: {
    type: sequelize.STRING(100),
    allowNull: false,
  },
  platform: {
    type: sequelize.STRING(30),
    allowNull: false,
  },
},
{
  uniqueKeys: {
    messageUnique: {
      fields: ['messageID', 'channelID', 'plattform'],
    },
  },
});

export default messageLink;
