import { Module } from '@nestjs/common';
import { BriefingsService } from './briefings.service';
import { BriefingsController } from './briefings.controller';

@Module({
  controllers: [BriefingsController],
  providers: [BriefingsService],
  exports: [BriefingsService],
})
export class BriefingsModule {}
