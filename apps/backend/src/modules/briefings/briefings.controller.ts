import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BriefingsService } from './briefings.service';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Controller('briefings')
@UseGuards(JwtAuthGuard)
export class BriefingsController {
  constructor(private readonly briefingsService: BriefingsService) {}

  @Post()
  create(@Body() createBriefingDto: CreateBriefingDto, @CurrentUser() user: UserPayload) {
    return this.briefingsService.create(createBriefingDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.briefingsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.briefingsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBriefingDto: UpdateBriefingDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.briefingsService.update(id, updateBriefingDto, user.id, user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.briefingsService.remove(id, user.id, user.role);
  }
}
