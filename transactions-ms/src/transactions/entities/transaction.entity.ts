import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const TRANSACTION_TABLE_NAME = 'transactions';
@Entity({ name: TRANSACTION_TABLE_NAME })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', name: 'to_id' })
  to: string;

  @Column({ type: 'varchar', name: 'from_id', nullable: true })
  from: string;
}
