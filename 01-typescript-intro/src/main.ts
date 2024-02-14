import './style.css'
// import { name, age } from './bases/01-types'
// import { pokemon } from './bases/02-objects'
// import { charmander } from './bases/04-injection'
// import { charmander } from './bases/05-decorators'
import { charmander } from './bases/06-decorators2'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hola ${ charmander.name } ${ charmander.id }</h1>
  </div>
`

console.log(charmander.scream());
console.log(charmander.speak());