import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class TrafficLight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ type: 'enum', enum: ['vehicular', 'peatonal', 'mixto'] })
  type: string;

  @Column()
  department: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Report, (report) => report.trafficLight)  // Relación con Report
  reports: Report[];
}
