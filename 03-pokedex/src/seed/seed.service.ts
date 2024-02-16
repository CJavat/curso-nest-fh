import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel( Pokemon.name ) // (Es propio de Mongoose) Se agrega esto para poder injectar modelos al servicio. Pero en este caso como es otro módulo, se debe de exportar primero y luego importarlo en este modulo
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[ segments.length - 2 ];

      // const pokemon = this.pokemonModel.create({ no, name });
      pokemonToInsert.push({ no, name });
    });

    await this.pokemonModel.insertMany( pokemonToInsert );
    
    return 'Seed Executed';
  }
}
