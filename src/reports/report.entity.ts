import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { TrafficLight } from '../traffic-lights/traffic-light.entity';
// import { Evidence } from './evidence.entity';
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TrafficLight, (trafficLight) => trafficLight.reports)
  @JoinColumn({ name: 'traffic_light_id' })
  trafficLight: TrafficLight;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ['funcionando', 'dañado', 'intermitente'] })
  status: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('text', { nullable: true })
  comments: string;

  @Column('simple-array', { nullable: true })
  evidences: string[];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  reported_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('text', { nullable: true })
  body: string;

  @Column('enum', { enum: ['vehicular', 'peatonal', 'mixto'], nullable: false })
  type: string;

  @Column('text', { nullable: true })
  url: string;
}
