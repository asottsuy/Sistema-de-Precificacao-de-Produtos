import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ingredients') // Nome da tabela no Postgres
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costPrice: number; // Preço de custo para o BI calcular o lucro

  @Column()
  unit: string; // ex: 'kg', 'g', 'unidade'
}
