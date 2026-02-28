import { Module } from '@nestjs/common';
import { CrewAgentsService } from './crew-agents.service';
import { CrewAgentsController } from './crew-agents.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CrewAgentsController],
  providers: [CrewAgentsService],
  exports: [CrewAgentsService],
})
export class CrewAgentsModule {}
