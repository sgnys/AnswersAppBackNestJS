import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerTemplateRes, Template } from 'types';
import { AnswerEntity } from '../answer/answer.entity';
import { UserEntity } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AnswerTemplateEntity
  extends BaseEntity
  implements AnswerTemplateRes
{
  @ApiProperty({
    description: 'Primary uuid of answer template',
    example: 'd35d3d10-fcea-4103-9539-cf2258d4cbbb',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of answer template',
    enum: Template,
    example: 'consultant',
  })
  @Column({
    type: 'enum',
    enum: Template,
  })
  name: Template;

  @ApiProperty({
    description: 'First paragraph',
    maxLength: 200,
    example: 'Dzień Dobry',
  })
  @Column({ length: 200 })
  firstParagraph: string;

  @ApiProperty({
    description: 'Last paragraph',
    maxLength: 300,
    example: 'Pozdrawiamy',
  })
  @Column({ length: 300 })
  lastParagraph: string;

  @ApiProperty({
    description: 'Date of update answer template',
    type: 'string',
    format: 'date',
    example: '2023-02-11T18:33:54.988Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AnswerEntity, (answer) => answer.answerTemplate)
  answers: AnswerEntity[];

  @ManyToOne(() => UserEntity, (user) => user.answerTemplates, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
