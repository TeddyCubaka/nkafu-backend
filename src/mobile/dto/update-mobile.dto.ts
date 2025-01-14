import { PartialType } from '@nestjs/mapped-types';
import { CreateMobileDto } from './create-mobile.dto';

export class UpdateMobileDto extends PartialType(CreateMobileDto) {}
