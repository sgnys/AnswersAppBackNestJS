import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerRes, CategoryCreateAnswer, Template } from 'types';
import { AnswerTemplateEntity } from '../answer-template/answer-template.entity';
import { UserEntity } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerUserResDto } from './dto/answer-user.res.dto';

@Entity()
export class AnswerEntity extends BaseEntity implements AnswerRes {
  @ApiProperty({
    description: 'Primary uuid of answer',
    example: 'd35d3d10-fcea-4103-9539-cf2258d4c668',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Main content of the answer',
    maxLength: 3000,
    example: 'Lorem ipsum',
  })
  @Column({ length: 3000 })
  text: string;

  @ApiProperty({
    description: 'Category of answer',
    enum: CategoryCreateAnswer,
    example: 'telco',
  })
  @Column({ type: 'enum', enum: CategoryCreateAnswer })
  category: CategoryCreateAnswer;

  @ApiProperty({
    description: 'Count of clicks on the copy button',
    type: 'integer',
    example: 2,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  copyBtnCount: number;

  @ApiProperty({
    description: 'Name of answer template',
    enum: Template,
    example: 'customer',
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: Template,
    nullable: true,
  })
  template: Template | null;

  @ApiProperty({
    description: 'Date of creation answer',
    type: 'string',
    format: 'date',
    example: '2023-02-08T18:33:54.988Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date of update answer',
    type: 'string',
    format: 'date',
    example: '2023-02-08T18:33:54.988Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'One of the user answer',
    type: AnswerUserResDto,
  })
  @ManyToOne(() => UserEntity, (user) => user.answers, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ApiProperty({
    type: () => AnswerTemplateEntity,
    description: 'Template for answer',
  })
  @ManyToOne(() => AnswerTemplateEntity, (template) => template.answers, {
    onDelete: 'SET NULL',
  })
  answerTemplate: AnswerTemplateEntity;
}
