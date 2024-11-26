const { DataTypes } = require('sequelize');
const sequelize = require('../db/index');
const User = require('./user');
const Book = require('./book');

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'bookmarks',
  timestamps: true,
});

module.exports = Bookmark;
