import { IsUUID, IsEnum } from 'class-validator';
import { TeamRole } from '../enums/team-role.enum';

export class CreateTeamMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(TeamRole)
  role: TeamRole;
}