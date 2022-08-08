import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Spaces, SpaceStatus } from 'parkingspace-commons'
import { ZoneStatus } from 'parkingspace-commons/dist/entity/Zones'
import { Between, Repository } from 'typeorm'
import { QuerySpaceDto } from './dto/QuerySpace.dto'

@Injectable()
export class SpaceService {
  private readonly spaces: Repository<Spaces>

  constructor (@InjectRepository(Spaces) spaces: Repository<Spaces>) {
    this.spaces = spaces
  }

  public querySpaceNearBy (body: QuerySpaceDto) {
    return this.spaces.find({
      where: {
        lat: Between(body.lat - body.h / 2, body.lat + body.h / 2),
        lng: Between(body.lng - body.w / 2, body.lng + body.w / 2),
        status: SpaceStatus.ENABLED,
        childrenZones: [{
          status: ZoneStatus.ENABLED
        }]
      },
      relations: {
        childrenZones: true
      }
    })
  }
}
