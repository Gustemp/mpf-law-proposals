import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CrewsService } from './crews.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('crews')
@UseGuards(JwtAuthGuard)
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @Post()
  create(@Request() req: { user: { sub: string } }, @Body() createDto: CreateCrewDto) {
    return this.crewsService.create(req.user.sub, createDto);
  }

  @Get()
  findAll(@Request() req: { user: { sub: string } }) {
    return this.crewsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCrewDto) {
    return this.crewsService.update(id, updateDto);
  }

  @Patch(':id/flow')
  updateFlow(@Param('id') id: string, @Body() body: { flowData: unknown }) {
    return this.crewsService.updateFlowData(id, body.flowData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewsService.remove(id);
  }
}
