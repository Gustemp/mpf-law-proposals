import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';

@Injectable()
export class BriefingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBriefingDto: CreateBriefingDto, userId: string) {
    return this.prisma.briefing.create({
      data: {
        ...createBriefingDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where = role === 'ADMIN' ? {} : { userId };
    
    return this.prisma.briefing.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        proposals: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const briefing = await this.prisma.briefing.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        proposals: true,
      },
    });

    if (!briefing) {
      throw new NotFoundException('Briefing não encontrado');
    }

    if (role !== 'ADMIN' && briefing.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return briefing;
  }

  async update(id: string, updateBriefingDto: UpdateBriefingDto, userId: string, role: string) {
    await this.findOne(id, userId, role);

    return this.prisma.briefing.update({
      where: { id },
      data: updateBriefingDto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    await this.findOne(id, userId, role);

    await this.prisma.briefing.delete({ where: { id } });
    return { message: 'Briefing removido com sucesso' };
  }
}
