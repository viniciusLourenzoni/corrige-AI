import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

const supabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: async () => {
    const supabase = await import('@supabase/supabase-js');
    return supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AccountController],
  providers: [AccountService, supabaseProvider],
  exports: [AccountService],
})
export class AccountModule {}
