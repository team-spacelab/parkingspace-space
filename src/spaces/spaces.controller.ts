import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ClientGuard, ResponseBody, Spaces, Zones } from 'parkingspace-commons'
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
}
