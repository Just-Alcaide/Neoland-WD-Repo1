/*
json es una forma de estrucutar la información, cojeremos esa información con javascript, la pasaremos a una lista de objetos y trabajaremos con ella en javascript

en el html solo hay un elemento en la lista, un li con pokemon card
la imagen está linkeada al json de pokemon

abrimos el json y copiamos el primer objeto
creamos una variable constante y lo pegamos ahí
*/



  /*
  asi se carga "BULBASAUR" cada vez que cargamos la página
 
  obtener la información que tenemos de la carpeta pokemon/pokedex.json
  como vamos a meter esa información en nuestro javascript?
  dos maneras, una sencilla y una más compleja. la sencilla es la avanzada.
  */
 /*ponemos type="module" en la script de java de html
 eso hace algo supermoderno, como 15 años de javascript
 module. estamos usando una librería externa. a partir de este javascript puede alimentarse de otros modulos, de otras librerías.
 ponemos importe punto punto barra y la carpeta de la pokedex
 para traernos los pokemon de la pokedex
podemos borrar a bulbasaur
 */
//solución rápida y moderna pero no es eficiente

//petición síncrona
/*
vamos a rellenar la tabla. vamos a hablar del tiempo de ejecución, de cuando sucede cada cosa en js
hemos creado una dependencia. tenemos que tener en cuenta que todo esto es codigo que va a ir cargando a la página.
*/
/*
si empezamos a añadir código, irá en orden de línea a línea
ahora no importa el import, porque pesa poco, pero luego pesará mucho y congelará la carga de la página.
El problema está en la ejecución de la js.
vamos a empezar a generar una esctructura de código que tenga sentido.
vamos a intentar escribir el código estructuradito, que tenga sentido e impacte lo menos posible.
*/
/*
leemos los datos de POKEMONS y cpon ellos construimos la tabla en HTML
*/
/*
function readPokemonList (){
    //Por cada elemento en la lista de pokemons, 
    //añadimos un nuevo elemento a la lista
    for (let i = 0; i < POKEMONS.length; i++){
        //comprobar el nombre del pokemon
        console.log(POKEMONS[i].name.english)
    }
}
*/
//ejecutar un método. arriba solo declaramos el método
//readPokemonList()
//pero está mal estructurado, lo estamos ejecutando según se carga el código. también estamos haciendo el código spaguetti(código sin orden)
//vamos a usar tecnica de HOISTING: las declaraciones deben estar al principio del código, pero las funciones se pueden declarar al final del código
//ponemos la declaración al principio y la función al final:
import POKEMONS from '../pokemon/pokedex.json' with { type: 'json' }

console.log('Datos de Pokemons', POKEMONS)

readPokemonList()

function readPokemonList (){
    //Por cada elemento en la lista de pokemons, 
    //añadimos un nuevo elemento a la lista
    const LISTA = document.getElementsByClassName('pokemon-gallery')[0]
    for (let i = 0; i < POKEMONS.length; i++){
        let pokemonId = POKEMONS[i].id
        //creamos un nuevo nodo li
        let liElement = document.createElement('li')
        liElement.className = 'pokemon-card'
        //creamos linkb(hay que poner ? para siga el flujo por el html (QUERY STRING))
        let aElement = document.createElement('a')
        aElement.href = './ficha.html?id=' + pokemonId
        //creamos figure
        let figureElement = document.createElement('figure')
        //creamos la imagen
        let imgElement = document.createElement('img')
        //arreglamos los ids que están mal
        if (pokemonId === 662) {
            pokemonId = pokemonId + 'r'
          }
        if (pokemonId === 740) {
        pokemonId = pokemonId + 'le'
        }
        const numeroImagen = String(pokemonId).padStart(3, 0)
        imgElement.src = '../pokemon/images/' + numeroImagen + '.png'

        //añadimos imagen al figure
        figureElement.appendChild(imgElement)
        // figcaption
        let figcaptionElement = document.createElement('figcaption')
        figcaptionElement.innerText = 'Nº ' + numeroImagen.padStart(4, '0')
        //añadir el figcaption
        liElement.appendChild(figcaptionElement)
        //añadir el figure al link
        aElement.appendChild(figureElement)
        //añadimos link al li
        liElement.appendChild(aElement)
        //añadimos el nombre del pokemon
        let h1Element = document.createElement('h1')
        h1Element.innerText = POKEMONS[i].name.english
        //añadir el nombre al li
        liElement.appendChild(h1Element)
        // creamos el elemento p
        let tagListElement = document.createElement('p')
        //crear lista de tags
        tagListElement.className = 'taglist'
        //creamos los tags con bucle for
        for (let j = 0; j < POKEMONS[i].type.length; j++) {
          let tagItemElement = document.createElement('em')
          let pokemonType = POKEMONS[i].type[j]
          // añadimos los tags
          tagItemElement.className = 'tag ' + pokemonType.toLowerCase()
          tagItemElement.innerText = pokemonType
          tagListElement.appendChild(tagItemElement)
        }
        //añadimos la lista de tags al li
        liElement.appendChild(tagListElement)


        
        //tipos de pokemon
        /*
        let typePokemon;
        for (let j = 0; j < POKEMONS[i].type.length; j++ ){
        typePokemon = document.createElement('em')
        typePokemon.innerText = POKEMONS [i].type[j];
        //crear el p
        let pElement = document.createElement('p')
        pElement.appendChild(typePokemon)
        }*/
        // NO ENTIENDO NADA T_T
        

        
        
          //crear los tags
          //añadir los tags
          //añadir la lista de tags
          //añadir el li a la lista
        
       LISTA.appendChild(liElement)
      /*
      for (let baseValue in POKEMONS[i].base) {
        console.log(baseValue)
      }
      
      for (let typeIndex in POKEMONS[i].type) {
        let typeValue = POKEMONS[i].type[typeIndex]
        console.log(typeIndex, typeValue)
      }
      */

    }
}
//declaración de metodos abajo y ejecución imperativa arriba
//imperativa = el navegador va a hacer lo que nosotros le digamos
//seguimos trabajando en el método
/*
sabemos que son tres digitos y se rellenan de ceros por la izquierda
crear imagen:
let imgELement = document.createElement(img)
imgElment.src = ../pokemon/images/001.png

queremos rellenarlo con ceros teniendo en cuenta el identificador
const pokemonId = POKEMONS[i].id
const numeroImagen = String(pokemonId).padStart(3, '0')
imgElment.src = '../pokemon/images/' + numeroImagen + 'png'
liElement.appendChild(imgElement)
LISTA.appendChild(liElement)

padStart, metodo que a una cadena de texto le añade ceros por delante
*/
//arreglamos problemas de pokemon mal definidos


// CONTEXTO DE EJECUCIÓN
/*
cuando tenemos algo con {}, eso está dentro del contexto, solo se puede utilizar dentro del contexto.
si declaramos una variable dentro de una función, no la vamos a poder usar fuera
var se salta los contextos y da a errores. 
let solo vive dentro del contexto, cuando te sales del bucle (por ej) no funciona, como pasó con typePokemon
declaraciones al principio de la página
en la función, al principio de la función
en bucle, al principio del bucle

*/
/* BUCLES
hemos visto el for
para el while:
let i = 0
while (i < 20) {
  i++
}
  la condición tiene que hacerse antes, la pregunta en la línea y luego el bucle
  es fácil olvidar poner el i++ para parar el bucle, se puede hacerse un bucle infinito
  es util para cuando la condición no es númerica

  let condicion = ''
  while (condicion !== 'he terminado') {
    //lanzar peticion
    condicion API.getCondicion('https://API_URL)
  }

dentro de la familia del bucle for, hay dos variantes
for in for of
ejemplo, en pokemons, base es un objeto
for (let baseValue in POKEMONS[i].base]) {
  console.log(baseValue)
}

for (let typeIndex in POKEMONS[i].type) {
  let typeValue = POKEMONS[i].type[typeIndex]
  console.log(typeIndex, typeValue)
}
TODO: REVISA LO DE ARRIBA QUE NO ESTÁ BIEN DEL TODO, ESTA BIEN EN LA DOCUMENTACION



*/
