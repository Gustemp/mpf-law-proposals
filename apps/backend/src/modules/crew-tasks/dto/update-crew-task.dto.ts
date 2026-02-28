import { PartialType } from '@nestjs/mapped-types';
import { CreateCrewTaskDto } from './create-crew-task.dto';

export class UpdateCrewTaskDto extends PartialType(CreateCrewTaskDto) {}
