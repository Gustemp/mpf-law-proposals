import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProposalDto: CreateProposalDto, userId: string) {
    return this.prisma.proposal.create({
      data: {
        ...createProposalDto,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        briefing: { select: { id: true, title: true } },
        template: { select: { id: true, name: true } },
        style: { select: { id: true, name: true } },
        layout: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where = role === 'ADMIN' ? {} : { userId };

    return this.prisma.proposal.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        briefing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        briefing: true,
        template: true,
        style: true,
        layout: true,
        documents: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    if (role !== 'ADMIN' && proposal.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return proposal;
  }

  async update(id: string, updateProposalDto: UpdateProposalDto, userId: string, role: string) {
    await this.findOne(id, userId, role);

    return this.prisma.proposal.update({
      where: { id },
      data: updateProposalDto,
      include: {
        user: { select: { id: true, name: true, email: true } },
        briefing: { select: { id: true, title: true } },
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    await this.findOne(id, userId, role);

    await this.prisma.proposal.delete({ where: { id } });
    return { message: 'Proposta removida com sucesso' };
  }

  async updateStatus(id: string, status: string, userId: string, role: string) {
    await this.findOne(id, userId, role);

    return this.prisma.proposal.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
