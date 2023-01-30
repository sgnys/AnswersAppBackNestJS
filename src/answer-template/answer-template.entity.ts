import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Template } from 'types';

@Entity()
export class AnswerTemplateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Template,
  })
  name: Template;

  @Column({ length: 200 })
  firstParagraph: string;

  @Column({ length: 300 })
  lastParagraph: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
