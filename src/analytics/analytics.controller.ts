import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Get('match/:id/summary')
  summary(@Param('id', ParseIntPipe) id: number) {
    return this.analytics.getMatchSummary(id);
  }

  @Get('match/:id/peak-offpeak')
  peakOffPeak(@Param('id', ParseIntPipe) id: number) {
    return this.analytics.getPeakOffPeak(id);
  }
}
