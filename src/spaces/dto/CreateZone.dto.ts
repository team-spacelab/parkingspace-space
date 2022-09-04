import { IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateZoneDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  public readonly name: string

  @IsNumber()
  @IsInt()
  @IsOptional()
  public readonly costDiffrence?: number
}
