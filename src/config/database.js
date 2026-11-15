// Configuración usada tanto por la app como por sequelize-cli (migraciones).
const { db } = require('./env');

const base = {
  username: db.user,
  password: db.password,
  database: db.name,
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  logging: db.logging ? console.log : false,
  define: {
    underscored: false,
    timestamps: true,
  },
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
