// Подключение необходимых модулей
const iconv = require('iconv-lite');
const {exec} = require('child_process');
const os = require('os');
// Функция для выполнения команды 'net user'
const exec_netUser = (callback) => {
    if (os.platform() === 'win32') {
        exec('net user', {encoding: "buffer"},
            (error, stdout, stderr) => {
                if (error) {
                    // Если произошла ошибка, вызываем колбэк с ошибкой
                    callback(stderr, null);
                } else {
                    // Если выполнение прошло успешно, вызываем колбэк с результатом, декодируя вывод из кодировки CP866
                    callback(null, iconv.decode(stdout, 'CP866'));
                }
            }
        );
    } else if (os.platform() === 'linux') {
// Выполнение команды для получения списка пользователей в системе Linux
        exec('getent passwd', {encoding: "buffer"},
            (error, stdout, stderr) => {
                if (error) {
                    callback(stderr, null);
                } else {
                    callback(null, stdout);
                }
            }
        );
    } else {
        callback('Unsupported OS', null);
    }
}

// Функция для создания массива со списком пользователей
const usersTable = (callback) => (exec_netUser((err, res) => {
    if (err) {
        // Если произошла ошибка при выполнении команды 'net user', выводим ошибку в консоль
        console.log(`Error: ${err}`);
    } else {
        // Если выполнение прошло успешно, вызываем колбэк с массивом пользователей, извлекая их из вывода команды
        callback(res
            .slice(res.lastIndexOf('-') + 1)
            .match(/([A-Za-zА-Яа-я0-9_]+)/g)
        );
    }
}));

module.exports = usersTable;