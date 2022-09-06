import { IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { SpaceType } from 'parkingspace-commons'

export class CreateSpaceDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  public readonly name: string

  @IsNumber()
  @Max(39)
  @Min(32)
  public readonly lat: number

  @IsNumber()
  @Max(129)
  @Min(124)
  public readonly lng: number

  @IsNumber()
  @IsInt()
  @IsPositive()
  public readonly defaultCost: number

  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsIn([SpaceType.MANUALLY, SpaceType.AUTOMATICALLY])
  public readonly type: SpaceType

  @IsString()
  @IsOptional()
  @MaxLength(300)
  public readonly description?: string

  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsIn([10, 30, 60])
  public readonly timeUnit: number
}
