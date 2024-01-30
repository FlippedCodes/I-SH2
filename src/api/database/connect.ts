import { Sequelize, Options } from 'sequelize';

// sequelize connect
const connectDB = (DEBUG: boolean) => new Sequelize(
  process.env.DBDatabase,
  process.env.DBUser,
  process.env.DBPassword,
  {
    host: process.env.DBHost,
    dialect: process.env.DBDialect as Options['dialect'],
    storage: process.env.DBStorage, // sqlite specific - usually unset
    logging: DEBUG ? console.log : DEBUG,
  },
);

export default connectDB;
