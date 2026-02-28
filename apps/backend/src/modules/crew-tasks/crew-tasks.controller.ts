import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CrewTasksService } from './crew-tasks.service';
import { CreateCrewTaskDto } from './dto/create-crew-task.dto';
import { UpdateCrewTaskDto } from './dto/update-crew-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('crew-tasks')
@UseGuards(JwtAuthGuard)
export class CrewTasksController {
  constructor(private readonly crewTasksService: CrewTasksService) {}

  @Post()
  create(@Body() createDto: CreateCrewTaskDto) {
    return this.crewTasksService.create(createDto);
  }

  @Get()
  findAll() {
    return this.crewTasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewTasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCrewTaskDto) {
    return this.crewTasksService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewTasksService.remove(id);
  }
}
