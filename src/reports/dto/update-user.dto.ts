import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(['pending_validation', 'validated'])
  @IsOptional()
  status?: string;
}
