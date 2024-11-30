import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from './account.entity';
import { CreateUserDto } from './account.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, role, name, surname, phone, cep } = createUserDto;
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (error) throw error;

    if (!data?.user) {
      throw new Error(
        'Falha ao criar usuário no Supabase, tente novamente mais tarde!',
      );
    }

    const newUser = this.userRepository.create({
      id: data.user.id,
      email,
      password,
      role,
      name,
      surname,
      phone,
      cep,
    });

    await this.userRepository.save(newUser);

    return {
      supabaseUser: data.user,
      backendUser: newUser,
    };
  }

  async loginUser(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error('Falha ao autenticar usuário: ' + error.message);

    const supabaseUser = data.user;

    if (!supabaseUser) {
      throw new Error('Usuário não encontrado no Supabase.');
    }

    const backendUser = await this.userRepository.findOneBy({
      id: supabaseUser.id,
    });

    if (!backendUser) {
      throw new Error('Usuário não encontrado no banco de dados.');
    }

    return {
      session: data.session,
      user: {
        id: backendUser.id,
        email: backendUser.email,
        role: backendUser.role,
        name: backendUser.name,
        surname: backendUser.surname,
        phone: backendUser.phone,
        cep: backendUser.cep,
      },
    };
  }

  async getCurrentUser(): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data;
  }

  async resendConfirmation(email: string): Promise<any> {
    const { data, error } = await this.supabase.auth.resend({
      email,
      type: 'signup',
    });
    if (error) throw error;

    return { message: 'Email de confirmação reenviado', data };
  }
}
