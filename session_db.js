//Creating a sessions model

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Sessions extends Model {}
Sessions.init({
    sessionId :DataTypes.UUID,
    user:DataTypes.STRING,
    timeofLogin: DataTypes.DATE
}, { sequelize,});

(async () => {
    await sequelize.sync()
})()

module.exports = {Sessions}

