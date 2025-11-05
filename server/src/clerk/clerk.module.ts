import { Module } from '@nestjs/common';
import { ClerkController } from './clerk.controller';
import { ClerkService } from './clerk.service';

@Module({
  controllers: [ClerkController],
  providers: [ClerkService]
})
export class ClerkModule {}
