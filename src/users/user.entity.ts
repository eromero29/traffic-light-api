import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';
import { OTP } from '../auth/otp.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ type: 'enum', enum: ['pending_validation', 'validated'], default: 'pending_validation' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => OTP, (otp) => otp.user)  // Relación con OTP
  otps: OTP[];

  @OneToMany(() => Report, (report) => report.user)  // Relación con Report
  reports: Report[];
}
