import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Spaces, SpaceStatus, SpaceType, Zones, ZoneStatus, Reviews, Reserves } from 'parkingspace-commons'
import { Utils } from 'src/utils'
import { Between, IsNull, Like, Repository } from 'typeorm'
import { CreateReviewDto } from './dto/createReview.dto'
import { CreateSpaceDto } from './dto/CreateSpace.dto'
import { CreateZoneDto } from './dto/CreateZone.dto'
import { QuerySpaceDto } from './dto/QuerySpace.dto'
import { UpdateSpaceDto } from './dto/UpdateSpace.dto'

@Injectable()
export class SpaceService {
  private readonly spaces: Repository<Spaces>
  private readonly zones: Repository<Zones>
  private readonly reviews: Repository<Reviews>
  private readonly reserves: Repository<Reserves>

  constructor (
    @InjectRepository(Spaces) spaces: Repository<Spaces>,
    @InjectRepository(Zones) zones: Repository<Zones>,
    @InjectRepository(Reviews) reviews: Repository<Reviews>,
    @InjectRepository(Reserves) reserves: Repository<Reserves>) {
    this.spaces = spaces
    this.zones = zones
    this.reviews = reviews
    this.reserves = reserves
  }

  public querySpaceNearBy (body: QuerySpaceDto) {
    return this.spaces.find({
      where: {
        ...(body.h !== undefined ? { lat: Between(body.lat - body.h / 2, body.lat + body.h / 2) } : {}),
        ...(body.w !== undefined ? { lng: Between(body.lng - body.w / 2, body.lng + body.w / 2) } : {}),
        status: SpaceStatus.ENABLED,
        childrenZones: [{
          status: ZoneStatus.ENABLED
        }],
        ...(body.search !== undefined ? { name: Like(`%${body.search}%`) } : {})
      },
      relations: {
        childrenZones: true
      },
      ...(body.search !== undefined ? { take: 5 } : {})
    })
  }

  public async getSpace (spaceId: number) {
    const space = await this.spaces.findOne({
      where: {
        id: spaceId
      },
      relations: {
        childrenZones: true
      }
    })

    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    const avgRating = await this.reviews
      .createQueryBuilder('reviews')
      .select('AVG(reviews.rating)', 'avgRating')
      .where('reviews.spaceId = :spaceId', { spaceId })
      .andWhere('reviews.deletedAt IS NULL')
      .getRawOne()

    return { ...space, ...avgRating }
  }

  public async getMySpaces (userId: number) {
    const spaces = await this.spaces.findBy([
      { managerId: userId, status: SpaceStatus.ENABLED },
      { managerId: userId, status: SpaceStatus.PENDING_APPROVE }
    ])

    return spaces
  }

  public async createSpace (userId: number, body: CreateSpaceDto) {
    const { generatedMaps } = await this.spaces.insert({
      ...body,
      type: SpaceType[body.type],
      managerId: userId
    })

    return generatedMaps[0] as Spaces
  }

  public async updateSpace (userId: number, spaceId: number, body: UpdateSpaceDto) {
    const space = await this.spaces.findOneBy({ id: spaceId })

    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (space.managerId !== userId) {
      throw new ForbiddenException('SPACE_NOT_OWNED')
    }

    const { generatedMaps } = await this.spaces.update({ id: spaceId }, {
      ...Utils.delUndef(body)
    })

    return generatedMaps[0] as Spaces
  }

  public async deleteSpace (userId: number, spaceId: number) {
    const space = await this.spaces.findOneBy({ id: spaceId })

    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (space.managerId !== userId) {
      throw new ForbiddenException('SPACE_NOT_OWNED')
    }

    const { generatedMaps } = await this.spaces.update({ id: spaceId }, {
      status: SpaceStatus.DELETED
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
      spaceId,
      managerId: userId,
      ...body
    })

    return generatedMaps[0] as Zones
  }

  public async getReviews (spaceId: number) {
    const reviews = await this.reviews.find({ where: { spaceId, deletedAt: IsNull() } })
    return reviews
  }

  public async createReview (userId: number, spaceId: number, body: CreateReviewDto) {
    const space = await this.spaces.findOne({ where: { id: spaceId }, relations: { childrenZones: true } })
    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    const reserve = await this.reserves.findOne({ where: { userId, zoneId: space.childrenZones[0].id } })
    if (!reserve) {
      throw new ForbiddenException('RESERVE_NOT_FOUND')
    }

    const review = await this.reviews.findOne({ where: { userId, spaceId, deletedAt: IsNull() } })
    if (review) {
      throw new ForbiddenException('REVIEW_ALREADY_EXIST')
    }

    const { generatedMaps } = await this.reviews.insert({
      spaceId,
      userId,
      ...body
    })

    return generatedMaps[0] as Reviews
  }

  public async deleteReview (userId: number, spaceId: number, reviewId: number) {
    const review = await this.reviews.findOneBy({ id: reviewId, spaceId })
    if (!review) {
      throw new NotFoundException('REVIEW_ID_NOT_FOUND')
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('REVIEW_NOT_OWNED')
    }

    const { generatedMaps } = await this.reviews.update({ id: reviewId }, {
      deletedAt: new Date()
    })

    return generatedMaps[0] as Reviews
  }
}
