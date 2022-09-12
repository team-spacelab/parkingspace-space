import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cars, Orders, Reserves, SpaceFiles, Spaces, Users, Zones } from 'parkingspace-commons'
import { UploadController } from './uploads.controller'
import { UploadService } from './uploads.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceFiles, Spaces, Users, Zones, Reserves, Orders, Cars]),
    ConfigModule
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
