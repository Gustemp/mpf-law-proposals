import { PartialType } from '@nestjs/mapped-types';
import { CreateCrewAgentDto } from './create-crew-agent.dto';

export class UpdateCrewAgentDto extends PartialType(CreateCrewAgentDto) {}
