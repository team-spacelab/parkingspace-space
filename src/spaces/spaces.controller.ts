import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ClientGuard, ResponseBody, Reviews, Spaces, Zones } from 'parkingspace-commons'
import { CreateReviewDto } from './dto/createReview.dto'
import { CreateSpaceDto } from './dto/CreateSpace.dto'
import { CreateZoneDto } from './dto/CreateZone.dto'
import { QuerySpaceDto } from './dto/QuerySpace.dto'
import { UpdateSpaceDto } from './dto/UpdateSpace.dto'
import { SpaceService } from './spaces.service'

@Controller('spaces')
export class SpaceController {
  private readonly spaceService: SpaceService

  constructor (spaceService: SpaceService) {
    this.spaceService = spaceService
  }

  @Get()
  public async querySpaceNearby (@Query() query: QuerySpaceDto): Promise<ResponseBody<{ spaces: Spaces[] }>> {
    const spaces = await this.spaceService.querySpaceNearBy(query)

    return {
      success: true,
      data: {
        spaces
      }
    }
  }

  @Get('@me')
  @UseGuards(ClientGuard)
  public async getMySpaces (@Res({ passthrough: true }) res): Promise<ResponseBody<{ spaces: Spaces[] }>> {
    const spaces = await this.spaceService.getMySpaces(res.locals.userId)

    return {
      success: true,
      data: {
        spaces
      }
    }
  }

  @Get(':spaceId')
  public async getSpace (@Param('spaceId') spaceId: number): Promise<ResponseBody<{ space: Spaces }>> {
    const space = await this.spaceService.getSpace(spaceId)

    return {
      success: true,
      data: {
        space
      }
    }
  }

  @Post()
  @UseGuards(ClientGuard)
  public async createSpace (@Body() body: CreateSpaceDto, @Res({ passthrough: true }) res): Promise<ResponseBody<{ space: Spaces }>> {
    const space = await this.spaceService.createSpace(res.locals.userId, body)

    return {
      success: true,
      data: {
        space
      }
    }
  }

  @Put(':spaceId')
  @UseGuards(ClientGuard)
  public async updateSpace (@Param('spaceId') spaceId: number, @Body() body: UpdateSpaceDto, @Res({ passthrough: true }) res): Promise<ResponseBody<{ space: Spaces }>> {
    const space = await this.spaceService.updateSpace(res.locals.userId, spaceId, body)

    return {
      success: true,
      data: {
        space
      }
    }
  }

  @Delete(':spaceId')
  @UseGuards(ClientGuard)
  public async deleteSpace (@Param('spaceId') spaceId: number, @Res({ passthrough: true }) res): Promise<ResponseBody<{ space: Spaces }>> {
    const space = await this.spaceService.deleteSpace(res.locals.userId, spaceId)

    return {
      success: true,
      data: {
        space
      }
    }
  }

  @Post(':spaceId/zones')
  @UseGuards(ClientGuard)
  public async createZone (@Param('spaceId') spaceId: number, @Body() body: CreateZoneDto, @Res({ passthrough: true }) res): Promise<ResponseBody<{ zone: Zones }>> {
    const zone = await this.spaceService.createZone(res.locals.userId, spaceId, body)

    return {
      success: true,
      data: {
        zone
      }
    }
  }

  @Get(':spaceId/review')
  public async getSpaceReviews (@Param('spaceId') spaceId: number): Promise<ResponseBody<{ reviews: Reviews[] }>> {
    const reviews = await this.spaceService.getReviews(spaceId)

    return {
      success: true,
      data: {
        reviews
      }
    }
  }

  @Post(':spaceId/review')
  @UseGuards(ClientGuard)
  public async createSpaceReview (@Param('spaceId') spaceId: number, @Body() body: CreateReviewDto, @Res({ passthrough: true }) res): Promise<ResponseBody<{ review: Reviews }>> {
    const review = await this.spaceService.createReview(res.locals.userId, spaceId, body)

    return {
      success: true,
      data: {
        review
      }
    }
  }

  @Delete(':spaceId/review/:reviewId')
  @UseGuards(ClientGuard)
  public async deleteSpaceReview (@Param('spaceId') spaceId: number, @Param('reviewId') reviewId: number, @Res({ passthrough: true }) res): Promise<ResponseBody<{ review: Reviews }>> {
    const review = await this.spaceService.deleteReview(res.locals.userId, spaceId, reviewId)

    return {
      success: true,
      data: {
        review
      }
    }
  }
}
