'use strict'

//evento load para que se espere a cargar la pagina
window.addEventListener('load', function () {
    // Selecciona el formulario
    let formulario = document.querySelector("#contenedor-inputs");
    let resultado = document.querySelector('#resultado')
    let contenedor = document.querySelector('#Numerorandom');
    contenedor.style.display= "none";

    //perdir valor de los inputs
    formulario.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se recargue
        console.log('evento submit')

        let n1 = document.querySelector('#n1').value;
        let n2 = document.querySelector('#n2').value;
        n1.replace(/e/i, "")
        n2.replace(/e/i, "")

        function generarnumero(min, max){
            min = Math.ceil(min);
            max = Math.floor(max);
            contenedor.style.display= "flex";
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const numeroAleatorio = generarnumero(n1, n2)
        resultado.innerHTML = numeroAleatorio;
        console.log(numeroAleatorio)

        //desplazerse suavemente hacia abajo
        contenedor.scrollIntoView({
            behavior: 'smooth',
            block: 'center' //opcional
        });
    });
});