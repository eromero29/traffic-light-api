import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';  // Si el admin también puede tener reportes, incluye esta relación
import { User } from '../users/user.entity';  // Si es necesario vincular administradores a usuarios

@Entity()
export class AdminUser {
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

  @Column({ type: 'enum', enum: ['super_admin', 'admin'], default: 'admin' })
  role: string;  // El rol del administrador (super_admin o admin)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Si quieres asociar el admin con los reportes o usuarios:
  @OneToMany(() => Report, (report) => report.user)  // Si los administradores pueden ver los reportes
  reports: Report[];

  @OneToMany(() => User, (user) => user.id)  // Si el admin tiene usuarios asociados
  users: User[];
}
