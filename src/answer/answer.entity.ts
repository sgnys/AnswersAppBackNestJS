import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { CategoryCreateAnswer, Template } from 'types';

@Entity()
export class AnswerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(3, 3000)
  text: string;

  @Column({ type: 'enum', enum: CategoryCreateAnswer })
  category: CategoryCreateAnswer;

  @Column({ default: 0 })
  copyBtnCount: number;

  @Column({
    type: 'enum',
    enum: Template,
    nullable: true,
  })
  template: Template | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
