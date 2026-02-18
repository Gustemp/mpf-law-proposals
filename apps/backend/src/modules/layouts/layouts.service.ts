import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLayoutDto } from './dto/create-layout.dto';
import { UpdateLayoutDto } from './dto/update-layout.dto';

@Injectable()
export class LayoutsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLayoutDto) {
    return this.prisma.layout.create({ data });
  }

  async findAll() {
    return this.prisma.layout.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const layout = await this.prisma.layout.findUnique({ where: { id } });
    if (!layout) throw new NotFoundException('Layout não encontrado');
    return layout;
  }

  async update(id: string, data: UpdateLayoutDto) {
    await this.findOne(id);
    return this.prisma.layout.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.layout.delete({ where: { id } });
  }
}
