import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from './entities/groups.entity';
import { GroupsRepository } from './groups.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Groups])],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
