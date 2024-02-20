import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(

    @Inject(ProductsService)
    private readonly productService: ProductsService,

  ) {}

  async runSeed() {

    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productService.create( product ) );
    });

    await Promise.all( insertPromises );

    return true;
  }
}
