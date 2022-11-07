'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Bookings}) {
      // Associations
      this.hasMany(Bookings, {foreignKey: 'ticketId' })
    }
  }
  Tickets.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    agency: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    valid_till:{
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    capacity_per_day:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preset: {
      type:DataTypes.STRING
    },
    imageURL: {
      type: DataTypes.STRING
    },
    // DataTypes.TIME is better option but we dont require second & time related Op, so String is fine
    time: {
      type: DataTypes.STRING
    }
    }, {
    sequelize,
    tableName: 'Tickets',
    modelName: 'Tickets',
  });
  return Tickets;
};