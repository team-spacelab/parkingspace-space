import { IsNumber, IsPositive, Max, Min } from 'class-validator'

export class QuerySpaceDto {
  @IsNumber()
  @Max(39)
  @Min(32)
  public readonly lat: number

  @IsNumber()
  @Max(129)
  @Min(124)
  public readonly lng: number

  @IsNumber()
  @IsPositive()
  @Max(0.01)
  public readonly w: number

  @IsNumber()
  @IsPositive()
  @Max(0.01)
  public readonly h: number
}
