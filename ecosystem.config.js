module.exports = {
  apps : [
  {
    name:'users-wallets-ms',
    script:'./users-wallets-ms/dist/main.js',
    env: {
      NODE_ENV:'development',
      PORT:3001,
      HOST:'localhost',
      PSQL_HOST:'localhost',
      PSQL_PORT:5432,
      PSQL_USERNAME:'yura',
      PSQL_PASSWORD:'password',
      PSQL_DATABASE:'wallets',
      RABBITMQ_USER:'xaagwlkp',
      RABBITMQ_PASSWORD:'eR722UqRPvHhBynAEyZfQnBwhJ7jieVd',
      RABBITMQ_HOST:'sparrow.rmq.cloudamqp.com/xaagwlkp',
      RABBITMQ_QUEUE_NAME:'transaction-queue'
    }
  }, {
    name:'transactions-ms',
    script:'./transactions-ms/dist/main.js',
    env: {
      NODE_ENV:'development',
      PORT:3000,
      HOST:'localhost',
      PSQL_HOST:'localhost',
      PSQL_PORT:5432,
      PSQL_USERNAME:'yura',
      PSQL_PASSWORD:'password',
      PSQL_DATABASE:'transactions',
      RABBITMQ_USER:'xaagwlkp',
      RABBITMQ_PASSWORD:'eR722UqRPvHhBynAEyZfQnBwhJ7jieVd',
      RABBITMQ_HOST:'sparrow.rmq.cloudamqp.com/xaagwlkp',
      RABBITMQ_QUEUE_NAME:'transaction-queue'
  }
}
],
};
