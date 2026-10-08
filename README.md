# Task Management System: Backend

REST API for a simple Task Management System, built with **NestJS** (JavaScript).
Users can create, view, edit, and delete tasks, and update a task's status and priority.

> **Status:** Backend complete. The **Next.js frontend is coming soon** and will live in a separate folder or repo.

## Features
- Create, view, edit, and delete tasks
- Update task status (`pending`, `in_progress`, `completed`)
- Update task priority (`low`, `medium`, `high`)
- Search tasks by title or description
- Filter by status or priority
- Sort by due date, priority, status, title, or created date
- Dashboard statistics endpoint
- Input validation with clear error messages (400) and not-found handling (404)

## Tech
- NestJS (JavaScript, compiled with Babel)
- In-memory storage (no database yet, tasks reset when the server restarts)

## Run it
1. Install Node.js 20 or newer
2. `npm install --legacy-peer-deps`
3. `npm run start:dev`
4. Open http://localhost:3000/tasks

## API Endpoints
| Method | URL | What it does(You too smart to read this. This is for us beginners. Do you have a neat way to format this part??????????????) |
| POST | `/tasks` | Create a task (`title` required; `description`, `priority`, `status`, `dueDate` optional) |
| GET | `/tasks` | List tasks (supports `?search=` `?status=` `?priority=` `?sortBy=` `?order=asc\|desc`) |
| GET | `/tasks/stats` | Dashboard statistics |
| GET | `/tasks/:id` | Get one task |
| PATCH | `/tasks/:id` | Edit title, description, or due date |
| PATCH | `/tasks/:id/status` | Body: `{"status": "pending" \| "in_progress" \| "completed"}` |
| PATCH | `/tasks/:id/priority` | Body: `{"priority": "low" \| "medium" \| "high"}` |
| DELETE | `/tasks/:id` | Delete a task |

Dates use the format `YYYY-MM-DD`.

### Example
```
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Write report","priority":"high","dueDate":"2026-10-20"}'
```

## Project structure
```
src/
├─ main.js                  starts the server, enables CORS
├─ app.module.js            root module
└─ tasks/
   ├─ tasks.controller.js   routes
   ├─ tasks.service.js      logic and in-memory data
   ├─ task.validation.js    request validation
   ├─ task.constants.js     allowed status and priority values
   └─ tasks.module.js
```

## Roadmap
- [ ] Next.js frontend
- [ ] Database (PostgreSQL or MongoDB)
- [ ] Automated tests
- [ ] Authentication