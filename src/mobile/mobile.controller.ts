import { Controller, Get, Param, UseGuards, Res } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mobile')
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Get('agent-info/:uuid')
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('uuid') uuid, @Res() res) {
    const data = await this.mobileService.getAgentInfo(uuid);
    return res.status(data.code).json(data);
  }
}
