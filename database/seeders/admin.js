'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Admin',
      [
        {
            name: 'Jane Doe',
            email: 'jane@gmail.com',
            password: '$2a$08$2jvDuH/wL90EQGEgiL6HPuTA8xpnCtzmtJ3Wxpui3oD78NWSDuHm2',
            createdAt: '2020-11-01T16:30:07.592Z',
            updatedAt: '2020-11-01T16:30:07.592Z',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Admin', null, {})
  },
}

