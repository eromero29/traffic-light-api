import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  otp_code: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
