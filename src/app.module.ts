import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { MobileModule } from './mobile/mobile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    CoreModule,
    MobileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
