import { IsEnum, IsOptional } from 'class-validator';
import { TeamRole } from '../enums/team-role.enum';

export class UpdateTeamMemberDto {
  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;
}