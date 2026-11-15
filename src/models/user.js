const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { bcryptSaltRounds } = require('../config/env');

class User extends Model {
  async validatePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  // Nunca exponer el hash de la contraseña en las respuestas JSON.
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }

  static associate(models) {
    User.hasMany(models.Task, { foreignKey: 'userId', as: 'tasks', onDelete: 'CASCADE' });
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true, len: [2, 100] },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value) {
          this.setDataValue('email', typeof value === 'string' ? value.trim().toLowerCase() : value);
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      // Por defecto las consultas NO traen el password; usar el scope 'withPassword' cuando sea necesario.
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: { attributes: { include: ['password'] } } },
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, bcryptSaltRounds);
          }
        },
      },
    },
  );

  return User;
};
