// Подключение необходимых модулей
const usersTable = require('./source/getUsers'); // Импорт функции usersTable из файла './source/windows'
const path = require('path'); // Подключение модуля path для работы с путями файловой системы
const express = require('express');
const {exec} = require("child_process"); // Подключение модуля express для создания веб-приложения
const os = require('os');

const app = express(); // Создание экземпляра приложения express
app.set('view engine', 'pug'); // Установка шаблонизатора pug
app.set('views', path.join(__dirname, 'views')); // Установка пути к каталогу с представлениями
app.use(express.static(path.join(__dirname, 'public'))); // Использование статических файлов из каталога 'public'
app.use(express.urlencoded({extended: true})); // Использование парсера для данных в формате x-www-form-urlencoded

// Обработка маршрута '/'
app.route('/').get((req, res) => {
    res.render('index', {'title': 'Веб-App'}); // Отображение страницы 'index' с передачей объекта данных
});

// Обработка POST-запроса на маршрут '/users'
app.route('/users').post((req, res) => {
    let name = req.body.name.trim(); // Получение имени пользователя из тела запроса

    // Вызов функции usersTable для получения списка пользователей и отображения страницы 'users'
    usersTable((userName) => {
        res.render('users', {
            'title': `Пользователь ${name}`, // Заголовок страницы
            'value': userName.indexOf(name), // Поиск позиции имени пользователя в списке
            'name': name // Передача имени пользователя в представление
        });
    });
});

const server = app.listen(process.argv[2], () => {
    let port
    if (process.argv[2] === undefined) {
        port = server.address().port
    } else {
        port = process.argv[2]
    }
    console.log(`Приложение запущено на http://localhost:${port}`)
    if (os.platform() === 'win32') {
        exec(`explorer http://localhost:${port}`);
    }else if (os.platform() === 'linux') {
        exec(`xdg-open http://localhost:${port}`);
    } else {
        exec(`open http://localhost:${port}`);
    }
})