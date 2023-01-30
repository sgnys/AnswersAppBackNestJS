import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryCreateAnswer, Template } from 'types';
import { AnswerTemplateEntity } from '../answer-template/answer-template.entity';

@Entity()
export class AnswerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 3000 })
  text: string;

  @Column({ type: 'enum', enum: CategoryCreateAnswer })
  category: CategoryCreateAnswer;

  @Column({ type: 'int', default: 0 })
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

  @ManyToOne(() => AnswerTemplateEntity, (template) => template.answers)
  answerTemplate: AnswerTemplateEntity;
}
