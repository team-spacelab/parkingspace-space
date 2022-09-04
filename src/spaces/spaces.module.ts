import { Module } from '@nestjs/common'
import { SpaceController } from './spaces.controller'
import { SpaceService } from './spaces.service'

@Module({
  providers: [SpaceService],
  controllers: [SpaceController]
})
export class SpaceModule {}
