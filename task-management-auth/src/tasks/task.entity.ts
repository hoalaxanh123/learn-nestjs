import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status';
import { AuthEntity } from '../auth/auth.entity';
import { Exclude } from 'class-transformer';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 1500 })
  description: string;

  @Column({ default: TaskStatus.OPEN })
  status: TaskStatus;

  @ManyToOne(() => AuthEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: AuthEntity;
}
