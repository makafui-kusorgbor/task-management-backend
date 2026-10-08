import {
  Bind,
  Body,
  Controller,
  Delete,
  Dependencies,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  validateCreate,
  validateUpdate,
  validateStatus,
  validatePriority,
  validateQuery,
} from './task.validation';


@Controller('tasks')
@Dependencies(TasksService)
export class TasksController {
  constructor(tasksService) {
    this.tasksService = tasksService;
  }

  @Post()
  @Bind(Body())
  create(body) {
    return this.tasksService.create(validateCreate(body));
  }

  @Get()
  @Bind(Query())
  findAll(query) {
    return this.tasksService.findAll(validateQuery(query));
  }

  @Get('stats')
  stats() {
    return this.tasksService.stats();
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Bind(Param('id'), Body())
  update(id, body) {
    return this.tasksService.update(id, validateUpdate(body));
  }

  @Patch(':id/status')
  @Bind(Param('id'), Body())
  updateStatus(id, body) {
    return this.tasksService.updateStatus(id, validateStatus(body));
  }

  @Patch(':id/priority')
  @Bind(Param('id'), Body())
  updatePriority(id, body) {
    return this.tasksService.updatePriority(id, validatePriority(body));
  }

  @Delete(':id')
  @HttpCode(200)
  @Bind(Param('id'))
  remove(id) {
    return this.tasksService.remove(id);
  }
}
