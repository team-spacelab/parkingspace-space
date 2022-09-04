import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Spaces, SpaceStatus, Zones, ZoneStatus } from 'parkingspace-commons'
import { Between, Repository } from 'typeorm'
import { CreateSpaceDto } from './dto/CreateSpace.dto'
import { CreateZoneDto } from './dto/CreateZone.dto'
import { QuerySpaceDto } from './dto/QuerySpace.dto'

@Injectable()
export class SpaceService {
  private readonly spaces: Repository<Spaces>
  private readonly zones: Repository<Zones>

  constructor (
    @InjectRepository(Spaces) spaces: Repository<Spaces>,
    @InjectRepository(Zones) zones: Repository<Zones>) {
    this.spaces = spaces
    this.zones = zones
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

  public async createSpace (userId: number, body: CreateSpaceDto) {
    const { generatedMaps } = await this.spaces.insert({
      ...body,
      managerId: userId
    })

    return generatedMaps[0] as Spaces
  }

  public async createZone (userId: number, spaceId: number, body: CreateZoneDto) {
    const space = await this.spaces.findOneBy({ id: spaceId })

    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (space.managerId !== userId) {
      throw new ForbiddenException('SPACE_NOT_OWNED')
    }

    const { generatedMaps } = await this.zones.insert({
      ...body
    })

    return generatedMaps[0] as Zones
  }
}
