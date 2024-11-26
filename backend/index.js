const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); 

const app = express();

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/auth', require('./routes/auth'))
app.use('/api/books', require('./routes/books'))
app.use('/api/bookmarks', require('./routes/bookmarks'))



// Синхронизация базы данных
sequelize.sync({ force: false }) // Установите `force: true`, если хотите сбросить базу данных
  .then(() => {
    console.log('Модели синхронизированы с базой данных');
  })
  .catch((error) => {
    console.error('Ошибка синхронизации моделей:', error);
  });

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})
