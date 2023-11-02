import sequelize from 'sequelize';

const bannedUser = sequelize.define('banned_user', {
  userID: {
    type: sequelize.STRING(30),
    primaryKey: true,
    autoIncrement: true,
  },
  platform: {
    type: sequelize.STRING(30),
    allowNull: false,
  },
  reason: sequelize.TEXT,
});

export default bannedUser;