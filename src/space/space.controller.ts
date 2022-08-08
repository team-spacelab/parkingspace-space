import { Body, Controller, Get } from '@nestjs/common'
import { ResponseBody, Spaces } from 'parkingspace-commons'
import { QuerySpaceDto } from './dto/QuerySpace.dto'
import { SpaceService } from './space.service'

@Controller('space')
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
}
