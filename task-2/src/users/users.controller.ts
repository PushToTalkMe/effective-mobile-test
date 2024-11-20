import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('resolve-problems')
  async resolveProblems() {
    const result = await this.usersService.resolveProblems();
    return {
      message: `Флаг 'hasProblems' был обновлен для ${result.updatedCount} пользователей.`,
      totalProblemsBefore: result.updatedCount,
    };
  }
}
