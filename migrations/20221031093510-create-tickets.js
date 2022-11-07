'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      imageURL: {
        type: DataTypes.STRING
      }, 
      preset: {
        type:DataTypes.STRING
      },
      time: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Tickets');
  }
};