import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @IsIn(['cricket', 'football', 'basketball'])
  sport: string;

  @IsString()
  title: string;

  @IsDateString()
  startsAt: string;

  @IsOptional()
  @IsString()
  streamPlaybackUrl?: string;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  slowModeSeconds?: number;
}

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  streamPlaybackUrl?: string;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @IsOptional()
  @IsBoolean()
  chatEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  slowModeSeconds?: number;
}
