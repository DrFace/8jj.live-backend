import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto, UpdateMatchDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';

@Controller('matches')
export class MatchesController {
  constructor(private matches: MatchesService) {}

  @Get()
  list() {
    return this.matches.list();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.matches.get(id);
  }

  // Admin: create match
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matches.create({
      sport: dto.sport,
      title: dto.title,
      startsAt: new Date(dto.startsAt),
      streamPlaybackUrl: dto.streamPlaybackUrl ?? null,
      chatEnabled: dto.chatEnabled ?? true,
      slowModeSeconds: dto.slowModeSeconds ?? 0,
    });
  }

  // Admin: update match, set live, chat settings
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMatchDto) {
    return this.matches.update(id, {
      ...dto,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
    });
  }
}
