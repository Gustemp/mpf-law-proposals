import { PartialType } from '@nestjs/mapped-types';
import { CreateCrewToolDto } from './create-crew-tool.dto';

export class UpdateCrewToolDto extends PartialType(CreateCrewToolDto) {}
