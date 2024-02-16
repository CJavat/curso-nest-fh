import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name, // Nombre de la clase que está en el Entity.
        schema: PokemonSchema, // Nombre del esquema que estamos exportando en la clase del Entity.
      }
    ]),
  ],
  exports: [ MongooseModule ]
})
export class PokemonModule {}
