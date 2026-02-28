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
import { CrewAgentsService } from './crew-agents.service';
import { CreateCrewAgentDto } from './dto/create-crew-agent.dto';
import { UpdateCrewAgentDto } from './dto/update-crew-agent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('crew-agents')
@UseGuards(JwtAuthGuard)
export class CrewAgentsController {
  constructor(private readonly crewAgentsService: CrewAgentsService) {}

  @Post()
  create(@Body() createDto: CreateCrewAgentDto) {
    return this.crewAgentsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.crewAgentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewAgentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCrewAgentDto) {
    return this.crewAgentsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewAgentsService.remove(id);
  }
}
