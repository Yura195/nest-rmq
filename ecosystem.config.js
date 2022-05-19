const transactionsEnv = require('dotenv').config({path:'./transactions-ms/.env'});
const usersWalletsEnv = require('dotenv').config({path:'./users-wallets-ms/.env'});

const envVariables = {
  transactionsVariables: {
    NODE_ENV: transactionsEnv.parsed.NODE_ENV,
    PORT: transactionsEnv.parsed.PORT,
    HOST: transactionsEnv.parsed.HOST,
    PSQL_HOST: transactionsEnv.parsed.PSQL_HOST,
    PSQL_PORT: transactionsEnv.parsed.PSQL_PORT,
    PSQL_USERNAME: transactionsEnv.parsed.PSQL_USERNAME,
    PSQL_PASSWORD: transactionsEnv.parsed.PSQL_PASSWORD,
    PSQL_DATABASE: transactionsEnv.parsed.PSQL_DATABASE,
    RABBITMQ_USER: transactionsEnv.parsed.RABBITMQ_USER,
    RABBITMQ_PASSWORD: transactionsEnv.parsed.RABBITMQ_PASSWORD,
    RABBITMQ_HOST: transactionsEnv.parsed.RABBITMQ_HOST,
    RABBITMQ_QUEUE_NAME: transactionsEnv.parsed.RABBITMQ_QUEUE_NAME
  },
  usersWalletsVariables: {
    NODE_ENV: usersWalletsEnv.parsed.NODE_ENV,
    PORT: usersWalletsEnv.parsed.PORT,
    HOST: usersWalletsEnv.parsed.HOST,
    PSQL_HOST: usersWalletsEnv.parsed.PSQL_HOST,
    PSQL_PORT: usersWalletsEnv.parsed.PSQL_PORT,
    PSQL_USERNAME: usersWalletsEnv.parsed.PSQL_USERNAME,
    PSQL_PASSWORD: usersWalletsEnv.parsed.PSQL_PASSWORD,
    PSQL_DATABASE: usersWalletsEnv.parsed.PSQL_DATABASE,
    RABBITMQ_USER: usersWalletsEnv.parsed.RABBITMQ_USER,
    RABBITMQ_PASSWORD: usersWalletsEnv.parsed.RABBITMQ_PASSWORD,
    RABBITMQ_HOST: usersWalletsEnv.parsed.RABBITMQ_HOST,
    RABBITMQ_QUEUE_NAME: usersWalletsEnv.parsed.RABBITMQ_QUEUE_NAME
  }
}
module.exports = {
  apps : [
  {
    name:'users-wallets-ms',
    script:'./users-wallets-ms/dist/main.js',
    env: {
      ...envVariables.transactionsVariables
    }
  }, {
    name:'transactions-ms',
    script:'./transactions-ms/dist/main.js',
    env: {
      ...envVariables.usersWalletsVariables
  }
}
],
};
