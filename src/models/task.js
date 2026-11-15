const { Model, DataTypes } = require('sequelize');

const TASK_STATUSES = ['pending', 'in-progress', 'completed'];

class Task extends Model {
  static associate(models) {
    Task.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = (sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 150] },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...TASK_STATUSES),
        allowNull: false,
        defaultValue: 'pending',
        validate: { isIn: [TASK_STATUSES] },
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'Tasks',
    },
  );

  return Task;
};

module.exports.TASK_STATUSES = TASK_STATUSES;
