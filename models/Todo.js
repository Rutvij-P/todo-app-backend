const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    title: String,
    completed: { type: Boolean, default: false }
});

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    labels: [String],
    subtasks: [subtaskSchema],
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', todoSchema);
