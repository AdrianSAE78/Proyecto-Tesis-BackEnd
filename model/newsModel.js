const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
    id_news: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    from_role: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    to_role: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium',
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de expiración de la notificación'
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha programada de publicación'
    }
}, {
    tableName: 'news',
    timestamps: true
});

module.exports = News;
