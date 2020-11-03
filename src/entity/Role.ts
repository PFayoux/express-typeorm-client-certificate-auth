import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Utilisateur } from './Utilisateur';

@Entity()
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany((type) => Utilisateur, (utilisateur) => utilisateur.role)
  utilisateurs: Utilisateur[];

  constructor(name: string) {
    this.name = name;
  }
}
