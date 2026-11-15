const app = require('./app');
const { sequelize } = require('./models');
const { port, nodeEnv } = require('./config/env');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✔ Conexión a MySQL establecida');

    const server = app.listen(port, () => {
      console.log(`✔ Task Manager API (${nodeEnv}) escuchando en http://localhost:${port}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('✖ No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

start();
