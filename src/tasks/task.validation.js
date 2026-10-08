import { BadRequestException } from '@nestjs/common';
import { STATUSES, PRIORITIES } from './task.constants';

function fail(errors) {
  throw new BadRequestException(errors);
}

const isText = (v) => typeof v === 'string' && v.trim().length > 0;
const isDate = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export function validateCreate(body = {}) {
  const errors = [];
  if (!isText(body.title)) errors.push('title is required and must be text');
  if (body.description !== undefined && typeof body.description !== 'string')
    errors.push('description must be text');
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority))
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  if (body.status !== undefined && !STATUSES.includes(body.status))
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  if (body.dueDate !== undefined && !isDate(body.dueDate))
    errors.push('dueDate must be a valid date like 2026-10-05');
  if (errors.length) fail(errors);

  const { title, description, priority, status, dueDate } = body;
  return { title: title.trim(), description, priority, status, dueDate };
}

export function validateUpdate(body = {}) {
  const errors = [];
  if (body.title !== undefined && !isText(body.title))
    errors.push('title must be non-empty text');
  if (body.description !== undefined && typeof body.description !== 'string')
    errors.push('description must be text');
  if (body.dueDate !== undefined && !isDate(body.dueDate))
    errors.push('dueDate must be a valid date like 2026-10-05');
  if (errors.length) fail(errors);

  const { title, description, dueDate } = body;
  return { title: title?.trim(), description, dueDate };
}

export function validateStatus(body = {}) {
  if (!STATUSES.includes(body.status))
    fail([`status must be one of: ${STATUSES.join(', ')}`]);
  return body.status;
}

export function validatePriority(body = {}) {
  if (!PRIORITIES.includes(body.priority))
    fail([`priority must be one of: ${PRIORITIES.join(', ')}`]);
  return body.priority;
}

export function validateQuery(query = {}) {
  const errors = [];
  const sortFields = ['dueDate', 'priority', 'status', 'createdAt', 'title'];
  if (query.status !== undefined && !STATUSES.includes(query.status))
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  if (query.priority !== undefined && !PRIORITIES.includes(query.priority))
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  if (query.sortBy !== undefined && !sortFields.includes(query.sortBy))
    errors.push(`sortBy must be one of: ${sortFields.join(', ')}`);
  if (query.order !== undefined && !['asc', 'desc'].includes(query.order))
    errors.push('order must be asc or desc');
  if (errors.length) fail(errors);

  const { search, status, priority, sortBy, order } = query;
  return { search, status, priority, sortBy, order };
}
