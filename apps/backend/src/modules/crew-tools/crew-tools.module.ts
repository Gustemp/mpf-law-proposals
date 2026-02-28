import { Module } from '@nestjs/common';
import { CrewToolsService } from './crew-tools.service';
import { CrewToolsController } from './crew-tools.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CrewToolsController],
  providers: [CrewToolsService],
  exports: [CrewToolsService],
})
export class CrewToolsModule {}
