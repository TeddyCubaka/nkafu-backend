import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CoreController],
  providers: [CoreService, JwtService, JwtAuthGuard],
})
export class CoreModule {}
