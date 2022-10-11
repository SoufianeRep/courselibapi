require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;

module.exports = {
  "development": {
    host: DB_HOST,
    database: 'course_database_dev',
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  "test": {
    host: DB_HOST,
    database: 'course_database_test',
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        required: true,
        rejectUnauthorize: false
      }
    }
  },
  "production": {
    host: DB_HOST,
    database: 'course_database_prod',
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        required: true,
        rejectUnauthorize: false
      }
    }
  },
};
