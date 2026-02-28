import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Injectable()
export class CrewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateCrewDto) {
    const { agentIds, taskIds, ...data } = createDto;

    return this.prisma.crew.create({
      data: {
        ...data,
        userId,
        agents: agentIds?.length
          ? {
              create: agentIds.map((agentId, index) => ({
                agentId,
                order: index,
              })),
            }
          : undefined,
        tasks: taskIds?.length
          ? {
              create: taskIds.map((taskId, index) => ({
                taskId,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        agents: { include: { agent: true }, orderBy: { order: 'asc' } },
        tasks: { include: { task: true }, orderBy: { order: 'asc' } },
      },
    });
  }

  async findAll(userId?: string) {
    return this.prisma.crew.findMany({
      where: {
        isActive: true,
        ...(userId ? { userId } : {}),
      },
      include: {
        agents: { include: { agent: true }, orderBy: { order: 'asc' } },
        tasks: { include: { task: true }, orderBy: { order: 'asc' } },
        _count: { select: { executions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const crew = await this.prisma.crew.findUnique({
      where: { id },
      include: {
        agents: {
          include: { agent: { include: { tools: { include: { tool: true } } } } },
          orderBy: { order: 'asc' },
        },
        tasks: {
          include: { task: { include: { tools: { include: { tool: true } } } } },
          orderBy: { order: 'asc' },
        },
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!crew) {
      throw new NotFoundException(`Crew with ID ${id} not found`);
    }

    return crew;
  }

  async update(id: string, updateDto: UpdateCrewDto) {
    await this.findOne(id);

    const { agentIds, taskIds, ...data } = updateDto;

    if (agentIds !== undefined) {
      await this.prisma.crewCrewAgent.deleteMany({ where: { crewId: id } });
    }

    if (taskIds !== undefined) {
      await this.prisma.crewCrewTask.deleteMany({ where: { crewId: id } });
    }

    return this.prisma.crew.update({
      where: { id },
      data: {
        ...data,
        agents:
          agentIds !== undefined
            ? {
                create: agentIds.map((agentId, index) => ({
                  agentId,
                  order: index,
                })),
              }
            : undefined,
        tasks:
          taskIds !== undefined
            ? {
                create: taskIds.map((taskId, index) => ({
                  taskId,
                  order: index,
                })),
              }
            : undefined,
      },
      include: {
        agents: { include: { agent: true }, orderBy: { order: 'asc' } },
        tasks: { include: { task: true }, orderBy: { order: 'asc' } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.crew.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateFlowData(id: string, flowData: unknown) {
    await this.findOne(id);
    return this.prisma.crew.update({
      where: { id },
      data: { flowData: flowData as never },
    });
  }
}
