import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsModule } from './hotels/hotels.module';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';
import { FlightsModule } from './flights/flights.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    HotelsModule,
    PlanModule,
    UserModule,
    FlightsModule,
    MongooseModule.forRoot(process.env.DB_URI as string)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
