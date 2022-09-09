import { IsIn, IsInt, IsNumber, IsPositive, IsString } from 'class-validator'
import { SpaceFileType } from 'parkingspace-commons'

export class CreateFileDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsIn([SpaceFileType.SPACE_PICTURE, SpaceFileType.SPACE_OWNERSHIP_DOCS])
  public readonly type: SpaceFileType

  @IsString()
  public readonly filename: string
}
