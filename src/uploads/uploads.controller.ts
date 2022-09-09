import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ClientGuard, ResponseBody, SpaceFiles } from 'parkingspace-commons'
import { CreateFileDto } from 'src/spaces/dto/CreateFile.dto'
import { QueryFilesDto } from 'src/spaces/dto/QueryFiles.dto'
import { UploadService } from './uploads.service'

@Controller('spaces/:spaceId/files')
export class UploadController {
  private readonly uploadService: UploadService

  constructor (uploadService: UploadService) {
    this.uploadService = uploadService
  }

  @Get()
  @UseGuards(ClientGuard)
  public async getSpaceFiles (@Param('spaceId') spaceId: number, @Query() body: QueryFilesDto, @Res({ passthrough: true }) res): Promise<ResponseBody<{files: SpaceFiles[] }>> {
    const files = await this.uploadService.getSpaceFiles(res.locals.userId, spaceId, body)

    return {
      success: true,
      data: {
        files
      }
    }
  }

  @Post()
  @UseGuards(ClientGuard)
  public async createFileUploadUrl (@Param('spaceId') spaceId: number, @Res({ passthrough: true }) res, @Body() body: CreateFileDto): Promise<ResponseBody<{ url: string }>> {
    const url = await this.uploadService.createFileUploadUrl(res.locals.userId, spaceId, body)

    return {
      success: true,
      data: {
        url
      }
    }
  }

  @Delete(':fileId')
  @UseGuards(ClientGuard)
  public async deleteFile (@Param('spaceId') spaceId: number, @Param('fileId') fileId: number, @Res({ passthrough: true }) res): Promise<ResponseBody> {
    await this.uploadService.deleteFile(res.locals.userId, spaceId, fileId)

    return {
      success: true
    }
  }
}
