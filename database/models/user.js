'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    static associate({Tickets, Bookings}) {
      // Associations are here
      this.hasMany(Bookings, {foreignKey: 'userId' })
    }
  }


  Users.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   len: [5,50]
      // }
    },
    date:{
      type: DataTypes.DATEONLY
    },

    }, {
    sequelize,
    tableName: 'Users',
    modelName: 'Users',
  });
  return Users;
};