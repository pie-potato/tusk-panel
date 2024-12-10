const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Для хеширования паролей
const jwt = require('jsonwebtoken'); // Для JWT


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', { // Replace 'your_database_name' with your DB name
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB')
        createDefaultAdmin();
        app.listen(port, () => console.log(`Server listening on port ${port}`));
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
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  //  New field for assigned user
});

const User = mongoose.model('User', {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String }, // Add nickname field
    secondname: { type: String }, // Add nickname field
    thirdname: { type: String }, // Add nickname field
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' } // Add role field
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

        if (currentUser.role !== 'admin' || currentUser.role !== 'manager') { // Check if current user is admin or the creator of the board
            return res.status(403).json({ message: 'Нет прав для редактирования этой доски.' });
        }

        board.title = req.body.title;
        const updatedBoard = await board.save();

        res.json(updatedBoard);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении доски.' });
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
        res.json(savedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании колонки' });
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

        await Column.findByIdAndUpdate(req.body.columnId, { $push: { tasks: savedTask._id } });
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

app.delete('/api/columns/:id', async (req, res) => {
    try {
        // First, delete all associated tasks:
        await Task.deleteMany({ columnId: req.params.id });
        // Then, delete the column:
        await Column.findByIdAndDelete(req.params.id);
        res.json({ message: 'Column and associated tasks deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting column' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: task._id } });
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

app.put('/api/columns/:id', async (req, res) => {
    try {
        const updatedColumn = await Column.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
        res.json(updatedColumn);
    } catch (error) {
        res.status(500).json({ error: 'Error updating column' });
    }
});


app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
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

        const { username, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, role });

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
        const users = await User.find({}, 'username _id nickname'); // Only retrieve username and _id
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Add a new route to handle task assignment
app.put('/api/tasks/:taskId/assign', async (req, res) => {
    try {
        const { userId } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { assignedTo: userId },
            { new: true }
        ).populate('createdBy').populate('assignedTo', 'username'); // Populate after updating
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error assigning task' });
    }
});

app.put('/api/tasks/:taskId/assign', async (req, res) => {
    try {
        const { userId } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { assignedTo: userId }, // Use userId directly (can be null to unassign)
            { new: true }
        ).populate('createdBy').populate('assignedTo', 'username');

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error assigning/unassigning task' });
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

        const updatedUser = await User.findByIdAndUpdate(decoded.userId, { nickname: req.body.nickname }, { new: true });
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