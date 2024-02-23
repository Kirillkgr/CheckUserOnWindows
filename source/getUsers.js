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
        exec('cut -d: -f1 /etc/passwd', {encoding: "utf8"},
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
const usersTable = (callback) => {
    if (os.platform() === 'win32') {
        exec_netUser((err, res) => {
            if (err) {
                console.log(`Error: ${err}`);
            } else {
                // Регулярное выражение для обработки вывода команды 'net user' на Windows
                callback(res.match(/User\s{3}([A-Za-z0-9_]+)/g));
            }
        });
    } else if (os.platform() === 'linux') {
        exec('cut -d: -f1 /etc/passwd', {encoding: "utf8"},
            (error, stdout, stderr) => {
                if (error) {
                    callback(stderr, null);
                } else {
                    // Регулярное выражение для обработки вывода команды 'cut -d: -f1 /etc/passwd' на Linux
                    callback(stdout.match(/([A-Za-z0-9_]+)/g));
                }
            }
        );
    } else {
        callback('Unsupported OS', null);
    }
};

module.exports = usersTable;