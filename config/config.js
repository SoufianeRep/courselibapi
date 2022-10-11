require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DATABASE_URL } = process.env;

module.exports = {
  "development": {
    use_env_variable: DATABASE_URL,
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
    use_env_variable: 'DATABASE_URL',
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
    use_env_variable: 'DATABASE_URL',
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
