import { IsString, IsNotEmpty, IsNumber, Max, Min, IsDateString, IsOptional } from 'class-validator';

export class CreateTradeScheduleDto {
  @IsString()
  @IsNotEmpty()
  public symbol: string;

  @IsNumber()
  @IsNotEmpty()
  public quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Max(1)
  @Min(0)
  public riskRewardRatio: number;

  @IsDateString()
  @IsOptional()
  public validUntil: Date;
}
