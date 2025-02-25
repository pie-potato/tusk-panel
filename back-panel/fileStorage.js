const multer = require('multer');
const path = require('path');

const filePath = (filename) => path.join(__dirname, 'uploads', filename);

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для загруженных файлов.  Создайте папку 'uploads' в корне проекта.
    },
    filename:  (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload: upload,
    filePath: filePath
}