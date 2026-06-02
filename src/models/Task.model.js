import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'],
      default: 'PENDING'
    },

    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    startedAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    },

    dueDate: {
      type: Date,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model('Task', taskSchema);
export default Task;