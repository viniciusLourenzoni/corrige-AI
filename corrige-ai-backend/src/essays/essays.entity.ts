import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { StatusCorrectionEnum } from './essays.interface';
import { User } from 'src/account/account.entity';

@Entity('essays')
export class Essay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: StatusCorrectionEnum,
    default: StatusCorrectionEnum.PENDING,
  })
  status: StatusCorrectionEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
