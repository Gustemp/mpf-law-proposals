import { Module } from '@nestjs/common';
import { CrewTasksService } from './crew-tasks.service';
import { CrewTasksController } from './crew-tasks.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CrewTasksController],
  providers: [CrewTasksService],
  exports: [CrewTasksService],
})
export class CrewTasksModule {}
