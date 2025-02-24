const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const nodemailer = require('nodemailer');
const Project = require('./mongooseModels/Project.js')
const Board = require('./mongooseModels/Board.js')
const Column = require('./mongooseModels/Column.js')
const Task = require('./mongooseModels/Task.js')
const User = require('./mongooseModels/User.js')
const { initializeWebSocketServer, emitEventToRoom } = require('./socket/socketService.js');
const projectRouter = require('./routers/projectRouter.js');
const boardRouter = require('./routers/boardRouter.js');
// Create a Socket.IO instance

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/project', projectRouter)
app.use('/api/board', boardRouter)
const server = http.createServer(app);
initializeWebSocketServer(server)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Папка для загруженных файлов.  Создайте папку 'uploads' в корне проекта.
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017')
    .then(() => {
        console.log('Connected to MongoDB')
        createDefaultAdmin();
        server.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));



const transporter = nodemailer.createTransport({
    port: 465,
    host: 'mail.surgu.ru',
    secure: true,
    auth: {
        user: 'kartushin_is@surgu.ru',
        pass: 'PiePotato120452' // Пароль приложения для Gmail, если включена двухфакторная аутентификация
    }
});

app.post('/api/:projectId/tasks/:taskId/upload', upload.single('file'), async (req, res) => {
    try {
        // ... (authentication/authorization logic, similar to other protected routes)
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не выбран.' });
        }
        console.log(req.params.taskId);

        const task = await Task.findById(req.params.taskId);
        if (!task) {
            // Delete the uploaded file if the task doesn't exist
            fs.unlinkSync(req.file.path); // Remove the file from the server
            return res.status(404).json({ message: 'Задача не найдена.' });
        }
        const projectId = req.params.projectId
        const column = await Column.findById(task.columnId)
        task.attachments = task.attachments || []; // Initialize attachments array if it doesn't exist
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        const nameFile = { filename: req.file.filename, originalname: originalName }
        task.attachments.push(nameFile); // Use originalname for display


        await task.save();
        console.log({ filename: req.file.filename, originalname: originalName });
        emitEventToRoom(projectId, "addAttachmentsFile", { nameFile, taskId: task._id, columnId: column._id });

        res.json({ message: 'Файл успешно загружен.', nameFile });
    } catch (error) {
        // Delete the uploaded file if an error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path); // Remove the file from the server
        }
        console.error('Ошибка при загрузке файла:', error);
        res.status(500).json({ error: 'Ошибка при загрузке файла.' });
    }
});

app.get('/api/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    // res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(req.params.filename)}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Ошибка при отправке файла:", err);
            res.status(404).json({ message: 'Файл не найден.' });
        }
    });
});

app.put('/api/:projectId/:userId', async (req, res) => {
    const updateProject = await Project.findByIdAndUpdate(req.params.projectId, { $pull: { members: { _id: req.params.userId } } }, { new: true })
    // .populate("title")
    console.log(updateProject);
    emitEventToRoom('/project', 'updateProject', updateProject)
})

app.delete('/api/:projectId/tasks/:taskId/attachments/:filename', async (req, res) => {
    try {
        // ... (authentication/authorization logic)

        const projectId = req.params.projectId
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Задача не найдена.' });
        }

        const column = await Column.findById(task.columnId)
        const filename = req.params.filename;

        // Find the attachment index
        const attachmentIndex = task.attachments.findIndex(attachment => attachment.filename === filename);
        if (attachmentIndex === -1) {
            return res.status(404).json({ message: 'Вложение не найдено.' });
        }

        // Remove the attachment from the array
        const removedAttachment = task.attachments.splice(attachmentIndex, 1)[0];
        await task.save();

        // Delete the file from the uploads directory
        const filePath = path.join(__dirname, 'uploads', removedAttachment.filename);
        console.log(filePath);

        fs.unlinkSync(filePath);  // Delete the file
        console.log(filename, removedAttachment);

        emitEventToRoom(projectId, "deleteAttachmentsFile", { removedAttachment, taskId: task._id, columnId: column._id });

        res.json({ message: 'Вложение успешно удалено.' });
    } catch (error) {
        console.error('Ошибка при удалении вложения:', error);
        res.status(500).json({ error: 'Ошибка при удалении вложения.' });
    }
});

//  Register route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        const savedUser = await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // Обработка ошибки дубликата имени пользователя
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {


            // Создаем JWT
            const token = jwt.sign({ userId: user._id, isAdmin: user.role === 'admin' }, 'PiePotato');
            const userData = await User.findOne({ username }, '-password')

            res.json({ ...userData.toObject(), token }); // Возвращаем isAdmin


        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/api/admin/users', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        const decoded = jwt.verify(token, 'PiePotato');
        const currentUser = await User.findById(decoded.userId);

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (currentUser.role !== 'admin') { // Check role instead of isAdmin
            return res.status(403).json({ message: 'Admin privileges required' });
        }

        try {
            const decoded = jwt.verify(token, 'PiePotato');
            if (!decoded.isAdmin) {
                return res.status(403).json({ message: 'Admin privileges required' });
            }
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ ...req.body, password: hashedPassword });

        await newUser.save();
        res.json({ message: 'User created successfully' });

    } catch (error) {
        if (error.code === 11000) { // Обработка ошибки дубликата имени пользователя
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Error creating user' });
    }

});

async function createDefaultAdmin() {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Skipping creation.');
            return;
        }

        const hashedPassword = await bcrypt.hash('pie', 10); // Replace 'admin_password' with a strong password
        const newAdmin = new User({
            username: 'admin',
            password: hashedPassword,
            role: 'admin', // Set the role to 'admin'
            mail: " ",
            firstname: 'a',
            secondname: 'a',
            thirdname: 'a'

        });
        await newAdmin.save();
        console.log('Default admin user created successfully.');
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
}

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username _id nickname firstname secondname thirdname'); // Only retrieve username and _id
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.get('/api/profile', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');

        const user = await User.findById(decoded.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile data' });
    }
});

app.put('/api/profile', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');

        const updatedUser = await User.findByIdAndUpdate(decoded.userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    // ... (authentication/authorization as before)
    try {
        const users = await User.find({}, 'username _id role nickname'); // Include role
        res.json(users);
    } catch (error) {
        console.log(error)
    }
});

app.put('/api/admin/users/:userId/role', async (req, res) => {
    // ... (authentication/authorization as before)
    try {
        console.log(req);

        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.log(error)
    }
});

app.put('/api/admin/users/:userId', async (req, res) => {
    // ... auth
    try {
        const { role, password } = req.body;
        const updateData = { role };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10); // Hash the new password
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });
        res.json(updatedUser);


    } catch (error) {
        console.log(error);
    }
});