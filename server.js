const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Todo = require('./models/Todo'); // Ensure this path matches your file structure

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Create a new Todo
app.post('/todos', async (req, res) => {
    try {
        // Adjust the dueDate to consider the timezone offset
        const dueDate = new Date(req.body.dueDate);
        dueDate.setMinutes(dueDate.getMinutes() + dueDate.getTimezoneOffset());

        const newTodo = new Todo({...req.body, dueDate});
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get all Todos with Sorting
app.get('/todos', async (req, res) => {
    try {
        const sortField = req.query.sort || 'dueDate';
        let sortObj = {};
        sortObj[sortField] = 1; // Ascending order

        const todos = await Todo.find().sort(sortObj);
        res.json(todos);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a Todo
app.put('/todos/:id', async (req, res) => {
    try {
        // Adjust the dueDate to consider the timezone offset for updates as well
        if (req.body.dueDate) {
            const dueDate = new Date(req.body.dueDate);
            dueDate.setMinutes(dueDate.getMinutes() + dueDate.getTimezoneOffset());
            req.body.dueDate = dueDate;
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete a Todo
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
