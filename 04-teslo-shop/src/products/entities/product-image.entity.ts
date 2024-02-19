import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne( // FORMA DE RELACIONAR LAS TABLAS DEBE DE TENER EL MISMO TIPO EN LAS DOS TABLAS QUE SE VAN A RELACIONAR
    () => Product,
    (product) => product.images,
    {}
  )
  product: Product;
}