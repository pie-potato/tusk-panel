const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const nodemailer = require('nodemailer');
const User = require('./mongooseModels/User.js')
const { initializeWebSocketServer } = require('./socket/socketService.js');
const projectRouter = require('./routers/projectRouter.js');
const boardRouter = require('./routers/boardRouter.js');
const columnRouter = require('./routers/columnRouter.js');
const taskRouter = require('./routers/taskRouter.js');
const userRouter = require('./routers/userRouter.js');
const decodedUserId = require('./middleware/decodedUserId.js');
const errorMiddleware = require('./middleware/error.js')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/project', decodedUserId, projectRouter)
app.use('/api/board', decodedUserId, boardRouter) 
app.use('/api/column', decodedUserId, columnRouter)
app.use('/api/task', taskRouter)
app.use('/api/user', userRouter)
app.use(errorMiddleware) 
const server = http.createServer(app);
initializeWebSocketServer(server) 

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
    host: '',
    secure: true,
    auth: {
        user: '',
        pass: '' // Пароль приложения для Gmail, если включена двухфакторная аутентификация
    }
});

async function createDefaultAdmin() {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Skipping creation.');
            return;
        }

        const hashedPassword = await bcrypt.hash('pie', 10);
        const newAdmin = new User({
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword,
            role: 'admin',
            mail: process.env.ADMIN_FIRSTNAME || " ",
            firstname: process.env.ADMIN_FIRSTNAME, 
            secondname: process.env.ADMIN_SECONDNAME,
            thirdname: process.env.ADMIN_THIRDNAME

        });
        await newAdmin.save();
        console.log('Default admin user created successfully.');
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
}