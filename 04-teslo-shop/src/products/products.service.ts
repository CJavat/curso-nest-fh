import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Product } from './entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,


  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const producto = this.productRepository.create( createProductDto );
      await this.productRepository.save( producto );

      return producto;
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: Relaciones
    });
    
    if( !products ) 
      throw new NotFoundException('Products not found');

    return products; 
  }

  async findOne( term: string ) {

    let product: Product;
    if ( isUUID( term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
    //   product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    // const products = await this.productRepository.findOneBy({ id });
    if( !product ) 
      throw new NotFoundException('Product not found');

    return product; 
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if( !product ) throw new NotFoundException(`Product with id ${id} not found`);
    
    try {
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    const product = await this.findOne( id );

    await this.productRepository.remove( product );

    return `success`;
  }


  private handleExceptions( error: any ) {
    if( error.code === '23505' ) throw new  BadRequestException( error.detail );
      
      this.logger.error( error );
      throw new InternalServerErrorException('Ayuda');
  }
}
