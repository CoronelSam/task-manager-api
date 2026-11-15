const { Sequelize } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const User = require('./user')(sequelize);
const Task = require('./task')(sequelize);

const models = { User, Task };

// Relaciones: User → hasMany → Task  |  Task → belongsTo → User
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(models);
});

module.exports = { sequelize, Sequelize, ...models };
