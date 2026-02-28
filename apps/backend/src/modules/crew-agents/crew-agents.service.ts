import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrewAgentDto } from './dto/create-crew-agent.dto';
import { UpdateCrewAgentDto } from './dto/update-crew-agent.dto';

@Injectable()
export class CrewAgentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCrewAgentDto) {
    const { toolIds, ...data } = createDto;

    return this.prisma.crewAgent.create({
      data: {
        ...data,
        tools: toolIds?.length
          ? {
              create: toolIds.map((toolId) => ({ toolId })),
            }
          : undefined,
      },
      include: {
        tools: { include: { tool: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.crewAgent.findMany({
      where: { isActive: true },
      include: {
        tools: { include: { tool: true } },
        _count: { select: { tasks: true, crewAgents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.crewAgent.findUnique({
      where: { id },
      include: {
        tools: { include: { tool: true } },
        tasks: true,
      },
    });

    if (!agent) {
      throw new NotFoundException(`CrewAgent with ID ${id} not found`);
    }

    return agent;
  }

  async update(id: string, updateDto: UpdateCrewAgentDto) {
    await this.findOne(id);

    const { toolIds, ...data } = updateDto;

    if (toolIds !== undefined) {
      await this.prisma.crewAgentTool.deleteMany({ where: { agentId: id } });
    }

    return this.prisma.crewAgent.update({
      where: { id },
      data: {
        ...data,
        tools:
          toolIds !== undefined
            ? {
                create: toolIds.map((toolId) => ({ toolId })),
              }
            : undefined,
      },
      include: {
        tools: { include: { tool: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.crewAgent.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async hardDelete(id: string) {
    await this.findOne(id);
    return this.prisma.crewAgent.delete({ where: { id } });
  }
}
