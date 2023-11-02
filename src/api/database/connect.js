import sequelize from 'sequelize';

// sequelize connect
const connectDB = await new sequelize(
  process.env.DBDatabase,
  process.env.DBUser,
  process.env.DBPassword,
  {
    host: process.env.DBHost,
    dialect: process.env.DBDialect,
    storage: process.env.DBStorage, // sqlite specific
    logging: DEBUG ? console.log() : DEBUG,
  },
);

export default connectDB;
