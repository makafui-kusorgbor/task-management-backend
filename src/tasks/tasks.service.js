import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TaskStatus, TaskPriority, STATUSES, PRIORITIES } from './task.constants';

const PRIORITY_RANK = { low: 1, medium: 2, high: 3 };
const STATUS_RANK = { pending: 1, in_progress: 2, completed: 3 };

@Injectable()
export class TasksService {
  tasks = [];

  create(data) {
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? '',
      priority: data.priority ?? TaskPriority.MEDIUM,
      status: data.status ?? TaskStatus.PENDING,
      dueDate: data.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  findAll({ search, status, priority, sortBy, order = 'asc' } = {}) {
    let result = [...this.tasks];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    if (status) result = result.filter((t) => t.status === status);
    if (priority) result = result.filter((t) => t.priority === priority);

    if (sortBy) {
      const dir = order === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let x, y;
        if (sortBy === 'priority') {
          x = PRIORITY_RANK[a.priority];
          y = PRIORITY_RANK[b.priority];
        } else if (sortBy === 'status') {
          x = STATUS_RANK[a.status];
          y = STATUS_RANK[b.status];
        } else if (sortBy === 'dueDate') {
          // tasks without a due date go last
          x = a.dueDate ?? '9999';
          y = b.dueDate ?? '9999';
        } else {
          x = a[sortBy];
          y = b[sortBy];
        }
        return x < y ? -dir : x > y ? dir : 0;
      });
    }
    return result;
  }

  findOne(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  update(id, data) {
    const task = this.findOne(id);
    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  updateStatus(id, status) {
    const task = this.findOne(id);
    task.status = status;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  updatePriority(id, priority) {
    const task = this.findOne(id);
    task.priority = priority;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  remove(id) {
    this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return { message: 'Task deleted' };
  }

  stats() {
    const countBy = (values, key) =>
      Object.fromEntries(
        values.map((v) => [v, this.tasks.filter((t) => t[key] === v).length]),
      );
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: this.tasks.length,
      byStatus: countBy(STATUSES, 'status'),
      byPriority: countBy(PRIORITIES, 'priority'),
      overdue: this.tasks.filter(
        (t) =>
          t.dueDate !== null &&
          t.dueDate.slice(0, 10) < today &&
          t.status !== TaskStatus.COMPLETED,
      ).length,
    };
  }
}
