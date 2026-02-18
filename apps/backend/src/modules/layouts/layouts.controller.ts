import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LayoutsService } from './layouts.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('layouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LayoutsController {
  constructor(private readonly layoutsService: LayoutsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createLayoutDto: CreateLayoutDto) {
    return this.layoutsService.create(createLayoutDto);
  }

  @Get()
  findAll() {
    return this.layoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.layoutsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateLayoutDto: UpdateLayoutDto) {
    return this.layoutsService.update(id, updateLayoutDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.layoutsService.remove(id);
  }
}
