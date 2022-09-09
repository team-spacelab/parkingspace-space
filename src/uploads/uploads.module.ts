import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpaceFiles, Spaces, Users, Zones } from 'parkingspace-commons'
import { UploadController } from './uploads.controller'
import { UploadService } from './uploads.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceFiles, Spaces, Users, Zones]),
    ConfigModule
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
