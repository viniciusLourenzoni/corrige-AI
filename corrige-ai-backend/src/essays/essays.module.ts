import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EssaysController } from './essays.controller';
import { EssaysService } from './essays.service';
import { Essay } from './essays.entity';
import { User } from 'src/account/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Essay, User])],
  controllers: [EssaysController],
  providers: [EssaysService],
  exports: [EssaysService, TypeOrmModule],
})
export class EssaysModule {}
