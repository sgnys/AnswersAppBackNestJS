import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from 'types';
import { AnswerEntity } from '../answer/answer.entity';
import { AnswerTemplateEntity } from '../answer-template/answer-template.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @Column({
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  resetLinkToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AnswerEntity, (answer) => answer.user, {
    onDelete: 'CASCADE',
  })
  answers: AnswerEntity[];

  @OneToMany(
    () => AnswerTemplateEntity,
    (answerTemplate) => answerTemplate.user,
  )
  answerTemplates: AnswerTemplateEntity[];
}
