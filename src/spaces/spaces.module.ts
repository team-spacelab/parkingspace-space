import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cars, Orders, Reserves, Spaces, Users, Zones } from 'parkingspace-commons'
import { SpaceController } from './spaces.controller'
import { SpaceService } from './spaces.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Spaces, Zones, Users, Reserves, Orders, Cars])
  ],
  providers: [SpaceService],
  controllers: [SpaceController]
})

export class SpaceModule {}
