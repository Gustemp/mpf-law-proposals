import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrewTaskDto } from './dto/create-crew-task.dto';
import { UpdateCrewTaskDto } from './dto/update-crew-task.dto';

@Injectable()
export class CrewTasksService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCrewTaskDto) {
    const { toolIds, contextTaskIds, ...data } = createDto;

    return this.prisma.crewTask.create({
      data: {
        ...data,
        tools: toolIds?.length
          ? { create: toolIds.map((toolId) => ({ toolId })) }
          : undefined,
        contextFor: contextTaskIds?.length
          ? { create: contextTaskIds.map((id) => ({ dependentTaskId: id })) }
          : undefined,
      },
      include: {
        agent: true,
        tools: { include: { tool: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.crewTask.findMany({
      where: { isActive: true },
      include: {
        agent: true,
        tools: { include: { tool: true } },
        _count: { select: { crewTasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.crewTask.findUnique({
      where: { id },
      include: {
        agent: true,
        tools: { include: { tool: true } },
        contextFor: { include: { dependentTask: true } },
        contextFrom: { include: { contextTask: true } },
      },
    });

    if (!task) {
      throw new NotFoundException(`CrewTask with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateDto: UpdateCrewTaskDto) {
    await this.findOne(id);

    const { toolIds, contextTaskIds, ...data } = updateDto;

    if (toolIds !== undefined) {
      await this.prisma.crewTaskTool.deleteMany({ where: { taskId: id } });
    }

    if (contextTaskIds !== undefined) {
      await this.prisma.crewTaskContext.deleteMany({
        where: { contextTaskId: id },
      });
    }

    return this.prisma.crewTask.update({
      where: { id },
      data: {
        ...data,
        tools:
          toolIds !== undefined
            ? { create: toolIds.map((toolId) => ({ toolId })) }
            : undefined,
        contextFor:
          contextTaskIds !== undefined
            ? { create: contextTaskIds.map((tid) => ({ dependentTaskId: tid })) }
            : undefined,
      },
      include: {
        agent: true,
        tools: { include: { tool: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.crewTask.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
