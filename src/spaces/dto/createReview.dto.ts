import { IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateReviewDto {
  @IsString()
  public readonly content: string

  @IsNumber()
  @Max(5)
  @Min(1)
  public readonly rating: number
}
