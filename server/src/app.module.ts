import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [HotelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
