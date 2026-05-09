import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IngredientSchema } from './ingredient.schema';
@Entity('products')
export class ProductSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice!: number;

  // Relação com a Ficha Técnica
  @OneToMany(() => ProductItemSchema, (item) => item.product, { cascade: true })
  items!: ProductItemSchema[];
}

@Entity('product_items')
export class ProductItemSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductSchema, (product) => product.items)
  product!: ProductSchema;

  @ManyToOne(() => IngredientSchema)
  ingredient!: IngredientSchema;

  @Column('decimal', { precision: 10, scale: 3 }) // 3 casas para gramas (ex: 0.150kg)
  quantity!: number;
}
