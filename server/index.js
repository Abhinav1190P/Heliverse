const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/heliverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));


const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    avatar: String,
    domain: String,
    available: Boolean
});

const User = mongoose.model('User', userSchema);

app.get('/api/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const filters = req.query.filters;
    const userId = req.query.id;

    try {
        let query = {};

        if (userId) {
            const user = await User.findById(userId).select('first_name last_name avatar available');
            return res.json({ user });
        }

        if (filters) {
            const parsedFilters = JSON.parse(filters);

            if (parsedFilters.domain) {
                query.domain = parsedFilters.domain;
            }
            if (parsedFilters.gender) {
                query.gender = parsedFilters.gender;
            }
            if (parsedFilters.available !== undefined) {
                query.available = parsedFilters.available;
            }
        }

        const users = await User.find(query).skip(skip).limit(limit).select('first_name last_name avatar available');
        const totalUsers = await User.countDocuments(query);

        return res.json({ users, totalUsers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userDataToUpdate = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, userDataToUpdate, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error' });
    }
});







app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.set(req.body);
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
