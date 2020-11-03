import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { Role } from './Role';

@Entity()
@Unique(['username', 'email'])
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @ManyToOne((type) => Role, (role) => role.utilisateurs, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  constructor(username: string, email: string, role: Role, id?: number) {
    this.username = username;
    this.email = email;
    this.role = role;
    this.id = id;
  }
}
