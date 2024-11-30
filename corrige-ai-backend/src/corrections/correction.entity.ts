import { User } from 'src/account/account.entity';
import { Essay } from 'src/essays/essays.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('corrections')
export class Correction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Essay, (essay) => essay.id)
  @JoinColumn({ name: 'essay_id' })
  essay: Essay;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column('text', { name: 'correction_text', nullable: true })
  correctionText?: string;

  @Column('text', { nullable: true, name: 'ai_feedback' })
  aiFeedback?: string;

  @Column('float', { nullable: true, name: 'ai_score' })
  aiScore?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
