import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';

@Injectable()
export class StylesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStyleDto) {
    return this.prisma.style.create({ data });
  }

  async findAll() {
    return this.prisma.style.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const style = await this.prisma.style.findUnique({ where: { id } });
    if (!style) throw new NotFoundException('Estilo não encontrado');
    return style;
  }

  async update(id: string, data: UpdateStyleDto) {
    await this.findOne(id);
    return this.prisma.style.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.style.delete({ where: { id } });
  }
}
