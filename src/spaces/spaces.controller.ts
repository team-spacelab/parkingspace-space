import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ClientGuard, ResponseBody, Spaces, Zones } from 'parkingspace-commons'
import { CreateSpaceDto } from './dto/CreateSpace.dto'
import { CreateZoneDto } from './dto/CreateZone.dto'
import { QuerySpaceDto } from './dto/QuerySpace.dto'
import { SpaceService } from './spaces.service'

@Controller('spaces')
export class SpaceController {
  private readonly spaceService: SpaceService

  constructor (spaceService: SpaceService) {
    this.spaceService = spaceService
  }

  @Get()
  public async querySpaceNearby (@Body() body: QuerySpaceDto): Promise<ResponseBody<{ spaces: Spaces[] }>> {
    const spaces = await this.spaceService.querySpaceNearBy(body)

    return {
      success: true,
      data: {
        spaces
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

  @Post('/:spaceId/zones')
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
}
