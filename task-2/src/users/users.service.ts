import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async resolveProblems(): Promise<{
    updatedCount: number;
  }> {
    const result = await this.usersRepository.update(
      { hasProblems: true },
      { hasProblems: false },
    );

    return { updatedCount: result.affected };
  }
}
