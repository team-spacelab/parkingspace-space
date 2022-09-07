import { IsNumber, IsOptional, IsPositive, IsString, Max, Min, MinLength } from 'class-validator'

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
  @IsOptional()
  public readonly w?: number

  @IsNumber()
  @IsPositive()
  @Max(0.01)
  @IsOptional()
  public readonly h?: number

  @IsString()
  @IsOptional()
  @MinLength(2)
  public readonly search?: string
}
