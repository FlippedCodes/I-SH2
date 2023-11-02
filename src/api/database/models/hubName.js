import sequelize from 'sequelize';

const hubName = sequelize.define('hub_name', {
  hubID: {
    type: sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  hubName: {
    type: sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },
  ownerID: {
    type: sequelize.STRING(100),
    allowNull: false,
  },
  ownerPlatform: {
    type: sequelize.STRING(30),
    allowNull: false,
  }
});

export default bridgedChannel;
