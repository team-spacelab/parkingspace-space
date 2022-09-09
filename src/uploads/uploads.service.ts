import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { SpaceFiles, SpaceFileType, Spaces } from 'parkingspace-commons'
import { CreateFileDto } from 'src/spaces/dto/CreateFile.dto'
import { QueryFilesDto } from 'src/spaces/dto/QueryFiles.dto'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Injectable()
export class UploadService {
  private readonly files: Repository<SpaceFiles>
  private readonly spaces: Repository<Spaces>
  private readonly s3Client: S3Client
  private readonly configService: ConfigService

  constructor (
    @InjectRepository(SpaceFiles) files: Repository<SpaceFiles>,
    @InjectRepository(Spaces) spaces: Repository<Spaces>,
      configService: ConfigService) {
    this.files = files
    this.spaces = spaces
    this.s3Client = new S3Client({ region: 'ap-northeast-2' })
    this.configService = configService
  }

  public async getSpaceFiles (userId: number, spaceId: number, body: QueryFilesDto) {
    const space = await this.spaces.findOneBy({ id: spaceId })
    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (body.type === SpaceFileType[SpaceFileType.SPACE_OWNERSHIP_DOCS] && space.managerId !== userId) {
      throw new ForbiddenException('USER_IS_NOT_A_MANAGER')
    }

    return this.files.findBy({ spaceId, type: SpaceFileType[body.type] })
  }

  public async createFileUploadUrl (userId: number, spaceId: number, body: CreateFileDto) {
    const space = await this.spaces.findOneBy({ id: spaceId })
    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (space.managerId !== userId) {
      throw new ForbiddenException('SPACE_NOT_OWNED')
    }

    const key = `uploads/${uuid()}/${body.filename}`

    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: key,
      Body: 'BODY'
    })

    await this.files.insert({
      uploaderId: userId,
      spaceId,
      type: body.type,
      url: '/' + key
    })

    return await getSignedUrl(this.s3Client, command)
  }

  public async deleteFile (userId: number, spaceId: number, fileId: number) {
    const space = await this.spaces.findOneBy({ id: spaceId })
    if (!space) {
      throw new NotFoundException('SPACE_ID_NOT_FOUND')
    }

    if (space.managerId !== userId) {
      throw new ForbiddenException('SPACE_NOT_OWNED')
    }

    const file = await this.files.findOneBy({ id: fileId })
    if (!file) {
      throw new NotFoundException('FILE_ID_NOT_FOUND')
    }

    if (file.spaceId !== space.id) {
      throw new ForbiddenException('NOT_SAME_SPACE')
    }

    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: file.url.replace('/', '')
    })

    await this.s3Client.send(command)
    await this.files.delete({ id: fileId })
  }
}
