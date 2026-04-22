const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarritoHTML = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
  document.addEventListener( 'DOMContentLoaded', () => {
    //Recuperar los valores del carrito de LocalStorage
    articulosCarrito = JSON.parse(localStorage.getItem('carrito'));
    carritoHTML();
  })
  listaCursos.addEventListener("click", agregarCurso);

  carrito.addEventListener("click", eliminarCurso);

  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //Eliminamnos todos los elementos del Array

    limpiarCarrito(); // Imprimimos en el HTML el carrito vacio
  });
}

// Funciones
function agregarCurso(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const boton = e.target; // Referencia al botón clicado
    const curso = boton.parentElement.parentElement;

    // --- EFECTO VISUAL ---
    const textoOriginal = boton.textContent;
    boton.textContent = '¡Añadido!';
    boton.classList.add('btn-success');
    
    // Quitamos el foco manualmente para solucionar tu problema del color pegado
    boton.blur(); 

    // Revertir el estado tras 1 segundo
    setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.classList.remove('btn-success');
    }, 1000);
    // ---------------------

    leerDatosCursos(curso);
  }
}

//Creamos un objeto con el curso seleccionado y lo agregamos al array de cursos
function leerDatosCursos(curso) {
  const cursoHTML = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //.some devuelve true o false en base a la condición
  const existe = articulosCarrito.some((curso) => curso.id === cursoHTML.id);

  if (existe) {
    const carritoConCursoRepetido = articulosCarrito.map((cursoRepetido) => {
      if (cursoRepetido.id === cursoHTML.id) {
        ++cursoRepetido.cantidad;
        return cursoRepetido;
      } else {
        return cursoRepetido;
      }
    });
    articulosCarrito = [...carritoConCursoRepetido];
  } else {
    articulosCarrito = [...articulosCarrito, cursoHTML];
  }
  carritoHTML();
}

//Guardar los valores del carrito en LocalStorage
function sincronizarStorage() {
  localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}

function carritoHTML() {
  //Limpiamos los articulos del carrito antes de mostrarlo en el HTML
  limpiarCarrito();

  articulosCarrito.forEach((articulo) => {
    const { imagen, titulo, precio, cantidad, id } = articulo;
    const row = document.createElement("tr");

    row.innerHTML = `
        
            <td> <img src='${imagen}' width='100'> </td> 
            <td>${titulo}</td>
            <td>${precio}</td> 
            <td>${cantidad}</td>
            <td> 
                <a href="#" class= "borrar-curso" data-id= '${id}'>X</a> 
            </td>

        `;
    contenedorCarritoHTML.appendChild(row);
  });
  sincronizarStorage();

}

function limpiarCarrito() {
  //Forma lenta de limpiar el carrito en el HTML
  //contenedorCarritoHTML.innerHTML = ``;

  //Mejor performance de limpiar el carrito en el HTML

  while (contenedorCarritoHTML.firstChild) {
    contenedorCarritoHTML.removeChild(contenedorCarritoHTML.firstChild);
  }
}

function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoBorrado = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter(
      (curso) => curso.id !== cursoBorrado,
    );
  }
  carritoHTML();
}
