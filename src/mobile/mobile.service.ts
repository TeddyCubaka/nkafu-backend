import { Injectable } from '@nestjs/common';
import { CreateMobileDto } from './dto/create-mobile.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';

@Injectable()
export class MobileService {
  create(createMobileDto: CreateMobileDto) {
    return 'This action adds a new mobile';
  }

  findAll() {
    return `This action returns all mobile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mobile`;
  }

  update(id: number, updateMobileDto: UpdateMobileDto) {
    return `This action updates a #${id} mobile`;
  }

  remove(id: number) {
    return `This action removes a #${id} mobile`;
  }
}
