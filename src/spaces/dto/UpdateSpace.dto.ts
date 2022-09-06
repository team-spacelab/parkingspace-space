import { IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateSpaceDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsOptional()
  public readonly name?: string

  @IsString()
  @IsOptional()
  @MaxLength(300)
  public readonly description?: string

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public readonly defaultCost?: number

  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsIn([10, 30, 60])
  @IsOptional()
  public readonly timeUnit: number
}
