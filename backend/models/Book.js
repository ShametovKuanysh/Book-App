const { DataTypes } = require('sequelize');
const sequelize = require('../db/index'); 

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING, // URL обложки
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  categories: {
    type: DataTypes.STRING, // Массив категорий
    allowNull: true
  },
  publishDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fileUrl: {
    type: DataTypes.STRING, // Ссылка на файл книги
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING, // Тип файла (txt, pdf, epub)
    defaultValue: 'txt'
  }
}, {
    tableName: 'books',
    timestamps: true,
});

module.exports = Book;
