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
import { CrewToolsService } from './crew-tools.service';
import { CreateCrewToolDto } from './dto/create-crew-tool.dto';
import { UpdateCrewToolDto } from './dto/update-crew-tool.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('crew-tools')
@UseGuards(JwtAuthGuard)
export class CrewToolsController {
  constructor(private readonly crewToolsService: CrewToolsService) {}

  @Post()
  create(@Body() createDto: CreateCrewToolDto) {
    return this.crewToolsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.crewToolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewToolsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCrewToolDto) {
    return this.crewToolsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewToolsService.remove(id);
  }
}
