import { PartialType } from '@nestjs/mapped-types';
import { CreateAiDto } from './create-ai.dto';

export class UpdateAiDto extends PartialType(CreateAiDto) {}
