const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Для хеширования паролей
const jwt = require('jsonwebtoken'); // Для JWT
const http = require('http'); // Import the http module
const socketIO = require('socket.io');

// Create a Socket.IO instance

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", //  или ваш домен/порт клиента
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


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
mongoose.connect('mongodb://localhost:27017', { // Replace 'your_database_name' with your DB name
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB')
        createDefaultAdmin();
        io.on('connection', (socket) => { // Подключение нового клиента
            console.log('Пользователь подключился');

            socket.on('joinBoard', (boardId) => { // Клиент присоединяется к комнате доски
                socket.join(boardId);
                console.log(`Socket ${socket.id} joined room ${boardId}`);
            });
            socket.on('addColumn', (boardId, newColumn) => {
                socket.to(boardId).emit('addColumn', newColumn);
            });
            socket.on('updateColumn', (boardId, updateColumn) => { // Клиент обновил задачу
                socket.to(boardId).emit('updateColumn', updateColumn);
            });
            socket.on('deleteColumn', (boardId, columnId) => { // получаем boardId вместе с columnId
                socket.to(boardId).emit('deleteColumn', columnId);
            });
            socket.on('addTask', (boardId, newTask) => {
                socket.to(boardId).emit('addTask', newTask);
            });
            socket.on('updateTask', (boardId, updateTask) => {
                socket.to(boardId).emit('updateTask', updateTask);
            });
            socket.on('deleteTask', (boardId, taskId) => { // Клиент обновил задачу
                socket.to(boardId).emit('deleteTask', taskId);
            });
            socket.on('addTaskAssing', (boardId, assignedUser) => { // Клиент обновил задачу
                socket.to(boardId).emit('addTaskAssing', assignedUser);
            });
            socket.on('deleteTaskAssing', (boardId, unAssignedUser) => { // Клиент обновил задачу
                socket.to(boardId).emit('deleteTaskAssing', unAssignedUser);
            });
            socket.on('addAttachmentsFile', (boardId, attachmentsFile) => { // Клиент обновил задачу
                socket.to(boardId).emit('addAttachmentsFile', attachmentsFile);
            });
            socket.on('deleteAttachmentsFile', (boardId, deletedAttachmentsFile) => { // Клиент обновил задачу
                socket.to(boardId).emit('deleteAttachmentsFile', deletedAttachmentsFile);
            });
            socket.on('addBoard', (boardId, newBoard) => {
                socket.to(boardId).emit('addBoard', newBoard);
            });
            socket.on('deleteBoard', (boardId, deletedBoard) => {
                socket.to(boardId).emit('deleteBoard', deletedBoard);
            });
            socket.on('disconnect', () => { // Отключение клиента
                console.log('Пользователь отключился');
            });
        });
        server.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Models
const Board = mongoose.model('Board', {
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    column: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }]
});

const Column = mongoose.model('Column', {
    title: { type: String, required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }, // Add boardId
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const Task = mongoose.model('Task', {
    title: String,
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add createdBy field
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  //  New field for assigned user
    attachments: [{ filename: String, originalname: String }]
});

const User = mongoose.model('User', {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String }, // Add nickname field
    secondname: { type: String }, // Add nickname field
    thirdname: { type: String }, // Add nickname field
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' } // Add role field
});

app.post('/api/tasks/:taskId/upload', upload.single('file'), async (req, res) => {
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

        const column = await Column.findById(task.columnId)
        task.attachments = task.attachments || []; // Initialize attachments array if it doesn't exist
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        const nameFile = { filename: req.file.filename, originalname: originalName }
        task.attachments.push(nameFile); // Use originalname for display


        await task.save();
        console.log({ filename: req.file.filename, originalname: originalName });
        io.to(column.boardId.toString()).emit("addAttachmentsFile", { nameFile, taskId: task._id, columnId: column._id });

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

app.delete('/api/tasks/:taskId/attachments/:filename', async (req, res) => {
    try {
        // ... (authentication/authorization logic)


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
        fs.unlinkSync(filePath);  // Delete the file
        console.log(filename, removedAttachment);

        io.to(column.boardId.toString()).emit("deleteAttachmentsFile", { removedAttachment, taskId: task._id, columnId: column._id });

        res.json({ message: 'Вложение успешно удалено.' });
    } catch (error) {
        console.error('Ошибка при удалении вложения:', error);
        res.status(500).json({ error: 'Ошибка при удалении вложения.' });
    }
});

// API routes
app.post('/api/boards', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');
        const currentUser = await User.findById(decoded.userId);

        if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
            return res.status(403).json({ message: 'Нет прав для создания доски.' });
        }

        const newBoard = new Board({
            title: req.body.title,
            createdBy: currentUser._id,
        });
        const savedBoard = await newBoard.save();
        console.log(typeof req.headers.referer);
        
        io.to('\\').emit("addBoard", savedBoard);

        res.json(savedBoard);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании доски.' });
    }
});

app.get('/api/boards', async (req, res) => {
    try {
        const boards = await Board.find().populate('createdBy', 'username'); // Populate username of creator
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении досок.' });
    }
});

app.put('/api/boards/:boardId', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');
        const currentUser = await User.findById(decoded.userId);
        const board = await Board.findById(req.params.boardId);

        if (!board) {
            return res.status(404).json({ message: 'Доска не найдена.' });
        }

        if (currentUser.role === 'admin' && currentUser.role !== 'manager' || currentUser.role !== 'admin' && currentUser.role === 'manager') { // Check if current user is admin or the creator of the board
            return res.status(403).json({ message: 'Нет прав для редактирования этой доски.' });
        }

        board.title = req.body.title;
        const updatedBoard = await board.save();

        res.json(updatedBoard);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении доски.' });
    }
});

app.delete('/api/boards/:boardId', async (req, res) => {
    try {
        // First, delete all associated tasks:
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');
        const currentUser = await User.findById(decoded.userId);
        if (currentUser.role !== 'admin' && currentUser.role !== 'manager') { // Check if current user is admin or the creator of the board
            return res.status(403).json({ message: 'Нет прав для редактирования этой доски.' });
        }

        const fetchAllColumns = await Column.find({ boardId: req.params.boardId })
        fetchAllColumns.forEach(async (e) => await Task.deleteMany({ columnId: e._id }))

        await Column.deleteMany({ boardId: req.params.boardId });
        // Then, delete the column:
        const deletedBoard = await Board.findByIdAndDelete(req.params.boardId);
        console.log(req.headers.referer);
        
        io.to('\\').emit("deleteBoard", deletedBoard);
        res.json({ message: 'Column and associated tasks deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting column' });
    }
});

app.get('/api/columns', async (req, res) => {
    try {
        const columns = await Column.find().populate({
            path: 'tasks',
            populate: {
                path: 'createdBy assignedTo' // Populate both createdBy and assignedTo
            }
        });
        res.json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching columns' });
    }
});

app.post('/api/columns', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');
        const currentUser = await User.findById(decoded.userId);
        const { title, boardId } = req.body;  // Get boardId from request


        // Check if the user has permission to create a column on this board
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Доска не найдена' });
        }


        // Only admin or the board creator can create columns
        if (currentUser.role !== 'admin' && board.createdBy.toString() !== currentUser._id.toString()) {
            return res.status(403).json({ message: 'Нет прав для создания колонки на этой доске' });
        }


        const newColumn = new Column({ title, boardId });
        const savedColumn = await newColumn.save();
        // await Board.findById(req.body.boardId, { $push: { column: savedColumn._id } })
        const populatedColumn = await Column.findById(savedColumn._id).populate('tasks');
        console.log(boardId);

        // console.log(populatedColumn);

        io.to(boardId).emit("addColumn", populatedColumn);

        res.json(populatedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании колонки' });
    }
});

app.delete('/api/columns/:id', async (req, res) => {
    try {

        const column = await Column.findById(req.params.id);

        if (!column) {
            return res.status(404).json({ message: 'Колонка не найдена.' });
        }

        await Task.deleteMany({ columnId: req.params.id }); // Удаляем все задачи в колонке
        await Column.findByIdAndDelete(req.params.id);
        io.to(column.boardId.toString()).emit('deleteColumn', req.params.id);
        res.json({ message: 'Колонка успешно удалена.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting column' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'PiePotato');

        const newTask = new Task({
            title: req.body.title,
            columnId: req.body.columnId,
            createdBy: decoded.userId // Store the ID of the user who created the task
        });

        const savedTask = await newTask.save();
        const column = await Column.findById(req.body.columnId)
        await Column.findByIdAndUpdate(req.body.columnId, { $push: { tasks: savedTask._id } });
        io.to(column.boardId.toString()).emit('addTask', savedTask);

        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error adding task' });
    }
});

app.get('/api/boards/:boardId/columns', async (req, res) => {
    try {
        const columns = await Column.find({ boardId: req.params.boardId }).populate({
            path: 'tasks',
            populate: {
                path: 'createdBy assignedTo' // Populate both createdBy and assignedTo
            }
        });
        res.json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении колонок' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const column = await Column.findById(task.columnId)
        await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: task._id } });
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        io.to(column.boardId.toString()).emit('deleteTask', deletedTask)
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

app.put('/api/columns/:id', async (req, res) => {
    try {
        const updatedColumn = await Column.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
        console.log(updatedColumn);
        io.to(updatedColumn.boardId.toString()).emit('updateColumn', updatedColumn)
        res.json(updatedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Error updating column' });
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
            .populate('createdBy')
            .populate('assignedTo', 'username');
        const column = await Column.findById(updatedTask.columnId)
        if (!updatedTask) {
            return res.status(404).json({ message: 'Задача не найдена.' });

        }
        io.to(column.boardId.toString()).emit('updateTask', updatedTask);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
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
        //  Замените 'PiePotato' на реальный секретный ключ
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
            role: 'admin' // Set the role to 'admin'
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

// Add a new route to handle task assignment
app.put('/api/tasks/:taskId/assign', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { assignedTo: userId },
            { new: true }
        ).populate('createdBy').populate('assignedTo', 'username'); // Populate after updating
        const column = await Column.findById(updatedTask.columnId)
        if (userId) {
            const assignedUser = await User.findById(updatedTask.assignedTo._id)
            io.to(column.boardId.toString()).emit('addTaskAssing', { taskId: updatedTask._id, columnId: updatedTask.columnId, assignedTo: assignedUser });
        } else {
            io.to(column.boardId.toString()).emit('deleteTaskAssing', updatedTask);
        }

        console.log(updatedTask);

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error assigning task' });
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