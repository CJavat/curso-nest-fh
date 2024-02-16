import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  
  // DI - Dependency injection
  constructor(

    @InjectModel( Pokemon.name ) // Se agrega esto para poder injectar modelos al servicio.
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoDB
    if( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }


    if( !pokemon ) throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );
    try {
      if( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      
      await pokemon.updateOne( updatePokemonDto, { new: true } );
      
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({ _id: id });
    if( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }

    return;
  }

  private handleExceptions( error: any ) {
    if( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);

    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }
}
