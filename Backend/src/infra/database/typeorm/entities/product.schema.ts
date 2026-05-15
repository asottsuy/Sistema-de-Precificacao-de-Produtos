import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IngredientSchema } from './ingredient.schema';
@Entity('products')
export class ProductSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice?: number;

  // Relação com a Ficha Técnica
  @OneToMany(() => ProductItemSchema, (item) => item.product, { cascade: true })
  items!: ProductItemSchema[];
}

@Entity('product_items')
export class ProductItemSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductSchema, (product) => product.items)
  @JoinColumn({ name: 'product_id' })
  product!: ProductSchema;

  // 1. A RELAÇÃO (O ID do ingrediente vai aqui)
  @ManyToOne(() => IngredientSchema)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient!: IngredientSchema;

  // 2. O VALOR (A quantidade vai aqui, separada da relação)
  @Column('decimal', { precision: 10, scale: 3 })
  quantity!: number;

  // 3. O PREÇO SNAPSHOT (Conforme sugerido antes para o TCC)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'price_per_unit_at_time',
  })
  pricePerUnit!: number;
}
