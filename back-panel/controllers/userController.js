const jwt = require('jsonwebtoken');
const User = require("../mongooseModels/User");
const bcrypt = require('bcrypt');

class userController {
    async getUserData(req, res) {
        try {
            const users = await User.find({}, 'username _id nickname firstname secondname thirdname'); // Only retrieve username and _id
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    async getUserProfile(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');

            const user = await User.findById(decoded.userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching profile data' });
        }
    }

    async getAllUserData(req, res) {
        // ... (authentication/authorization as before)
        try {
            const users = await User.find({}, '-__v -password'); // Include role
            res.json(users);
        } catch (error) {
            console.log(error)
        }
    }

    async loginUser(req, res) {
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
                const userData = await User.findOne({ username }, '-_id -password -__v')
                const response = { ...userData.toObject(), token }
                res.json(response); // Возвращаем isAdmin
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    }

    async adminUser(req, res) {
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
    }

    async changeUserData(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const decoded = jwt.verify(token, 'PiePotato');

            const updatedUser = await User.findByIdAndUpdate(decoded.userId, req.body, { new: true });
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Error updating profile' });
        }
    }

    async changeUserRole(req, res) {
        // ... (authentication/authorization as before)
        try {
            console.log(req);

            const { role } = req.body;
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true });
            res.json(updatedUser);
        } catch (error) {
            console.log(error)
        }
    }

    async updateUserData(req, res) {
        try {
            const { role, password } = req.body;
            const updateData = req.body;
console.log(req.body);

            if (updateData.password) {
                updateData.password = await bcrypt.hash(password, 10); // Hash the new password
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });
            res.json(updatedUser);


        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new userController()