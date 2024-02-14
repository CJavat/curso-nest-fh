import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uudi } from "uuid";
import { Car } from './interfaces/car.interface';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: uudi(),
      brand: 'Toyota',
      model: 'Corolla'
    },
    {
      id: uudi(),
      brand: 'Honda',
      model: 'Civic'
    },
    {
      id: uudi(),
      brand: 'Jeep',
      model: 'Cherokee'
    },
  ];

  findAll() {
    return this.cars;
  }
  findOneById( id: string ) {
    const car = this.cars.find( car => car.id === id );

    if( !car ) throw new NotFoundException(`Car with id '${id}' not found`);

    return car;
  }

  create( createCarDto: CreateCarDto ) {

    const car = {
      id: uudi(),
      brand: createCarDto.brand,
      model: createCarDto.model
    }

    this.cars.push( car );

    return car
  }

  update( id: string, updateCarDto: UpdateCarDto ) {
    let carDB = this.findOneById( id );

    if( updateCarDto.id && updateCarDto.id !== id ) throw new BadRequestException(`Car id is not valid`);

    this.cars = this.cars.map( car => {
      
      if( car.id === id ) {
        carDB = { ...carDB, ...updateCarDto, id };

        return carDB;
      }
      
      return car; // Regresar el carro actualizado.
    });
    
    return carDB;
  }

  delete( id: string ) {
    this.findOneById( id );
    
    this.cars = this.cars.filter( car => car.id !== id );
  }
}
