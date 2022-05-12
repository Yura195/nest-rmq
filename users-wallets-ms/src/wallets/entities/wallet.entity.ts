import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export const WALLET_TABLE_NAME = 'wallets';
@Entity({ name: WALLET_TABLE_NAME })
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'float', default: 0 })
  incoming: number;

  @Column({ type: 'float', default: 0 })
  outgoing: number;

  @Column({ type: 'boolean', name: 'account_closed', default: false })
  accountClosed: boolean;

  @Column({ type: 'boolean', name: 'account_lock', default: false })
  accountLocked: boolean;

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  get actuallyBalance(): number {
    return this.incoming - this.outgoing;
  }
}
