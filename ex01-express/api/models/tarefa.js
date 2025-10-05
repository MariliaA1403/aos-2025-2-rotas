const getTarefaModel = (sequelize, { DataTypes }) => {
  const Tarefa = sequelize.define("tarefa", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // Cada tarefa pertence a um usuário
  Tarefa.associate = (models) => {
    Tarefa.belongsTo(models.User, {
      foreignKey: {
        allowNull: true, // caso não queira obrigar a vinculação
      },
      onDelete: "CASCADE",
    });
  };

  return Tarefa;
};

export default getTarefaModel;
