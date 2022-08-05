const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");




const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener("submit", validarFormulario);
}
const validarFormulario = (e) => {
    e.preventDefault();
    const terminoBusqueda = document.querySelector("#termino").value;
    if (terminoBusqueda === "") {
        mostrarAlerta("Agrega un término de búsqueda")
        return;
    }
    buscarImagenes();
}
const mostrarAlerta = (mensaje) => {

    const existeAlerta = document.querySelector(".bg-red-100");

    if (!existeAlerta) {
        const alerta = document.createElement("p");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-70", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

};
async function buscarImagenes (paginaActual) {

    const termino = document.querySelector("#termino").value;

    const key = "28345720-93a65bf0141e4902229306cfd";//La usan para llevar un registro y luego cobrarte!
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&${registrosPorPagina}&page=${paginaActual}`;
    console.log(url);
    // fetch(url).then(resp => resp.json()).then(resultado => {
    //     console.log(resultado);
    //     totalPaginas = calcularPaginas(resultado.totalHits);
    //     console.log(totalPaginas);
    //     mostrarImagenes(resultado.hits)
    // })
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits)
        
    } catch (error) {
        console.log(error);
    }
}

//Generador que va a registar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
    //Iterar sobre el arreglo de imagenes y construir el html
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/4 p-3 ,mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}"</img>
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me Gusta</span> </p>
                        <p class="font-bold">${views}<span class="font-light"> Veces vista</span> </p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank">Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
            `
    });
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    imprimirIterador();
}

function imprimirIterador() {
    iterador = crearPaginador(totalPaginas);
    while (true) {
        const { value, done } = iterador.next();
        if (done) return;
        //Caso contraio, genera un boton por cada elemento en el generador
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("siguiente", "bg-yellow-400", "px-4", "py-1", "mr-2", "font-bold", "mb-10", "rounded");
        
        boton.onclick = ()=>{
            paginaActual = value;
            buscarImagenes(paginaActual);
        }

        paginacionDiv.appendChild(boton);


    }
}