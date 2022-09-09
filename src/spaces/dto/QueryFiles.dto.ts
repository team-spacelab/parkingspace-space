import { IsIn, IsString } from 'class-validator'
import { SpaceFileType } from 'parkingspace-commons'

export class QueryFilesDto {
  @IsString()
  @IsIn([SpaceFileType[SpaceFileType.SPACE_PICTURE], SpaceFileType[SpaceFileType.SPACE_OWNERSHIP_DOCS]])
  public readonly type: keyof typeof SpaceFileType
}
