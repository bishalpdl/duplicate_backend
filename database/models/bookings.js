'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users, Tickets}) {
      // define association here
      this.belongsTo(Users, {foreignKey: 'userId'});
      this.belongsTo(Tickets, {foreignKey: 'ticketId'});

    }
  }
  Bookings.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    date:{
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticketId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seatNo: {
      type: DataTypes.INTEGER
    }
    
  }, {
    sequelize,
    tableName: 'Bookings',
    modelName: 'Bookings',
  });
  return Bookings;
};