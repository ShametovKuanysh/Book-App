const sequelize = require('../db/index');
const User = require('./user');
const Book = require('./book');
const Bookmark = require('./bookmark');

// Связи между моделями
User.hasMany(Bookmark, { foreignKey: 'userId' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Bookmark, { foreignKey: 'bookId' });
Bookmark.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = { sequelize, User, Book, Bookmark };
