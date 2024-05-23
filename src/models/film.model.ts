import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('film')
export class FilmModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000 })
  introduction: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  genre: string;

  @Column({ length: 255 })
  direction: string;

  @Column('int')
  time: number;

  @Column('boolean')
  is3d: boolean;

  @Column('boolean')
  dubbed: boolean;

  @Column('boolean')
  subtitled: boolean;
}
