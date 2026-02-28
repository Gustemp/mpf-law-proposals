import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrewToolDto } from './dto/create-crew-tool.dto';
import { UpdateCrewToolDto } from './dto/update-crew-tool.dto';

@Injectable()
export class CrewToolsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCrewToolDto) {
    return this.prisma.crewTool.create({ data: createDto });
  }

  async findAll() {
    return this.prisma.crewTool.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tool = await this.prisma.crewTool.findUnique({ where: { id } });
    if (!tool) {
      throw new NotFoundException(`CrewTool with ID ${id} not found`);
    }
    return tool;
  }

  async update(id: string, updateDto: UpdateCrewToolDto) {
    await this.findOne(id);
    return this.prisma.crewTool.update({ where: { id }, data: updateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.crewTool.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
