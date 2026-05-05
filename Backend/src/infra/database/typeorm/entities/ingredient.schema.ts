import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingredients')
export class IngredientSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice: number;

  @Column()
  unit: string;
}
