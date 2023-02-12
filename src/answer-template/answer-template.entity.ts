import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Template } from 'types';
import { AnswerEntity } from '../answer/answer.entity';
import { UserEntity } from '../user/user.entity';

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

  @OneToMany(() => AnswerEntity, (answer) => answer.answerTemplate)
  answers: AnswerEntity[];

  @ManyToOne(() => UserEntity, (user) => user.answerTemplates, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
