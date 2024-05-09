// Creo mi array de carrito que contendrá los productos seleccionados por el cliente.
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Definir la lista de productos disponibles en la tienda. Creo mi array con objetos
let productos = []


//Fetch
fetch("/data/productos.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(function(producto) {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-img" src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>S/${producto.precio}</p>
            `;
        
            const btn = document.createElement("button");
            btn.classList.add("producto-btn");
            btn.innerText = "Agregar al carrito";
        
            btn.addEventListener("click", function() {
                agregarAlCarrito(producto); // Llamar a la función agregarAlCarrito cuando se hace clic en el botón
            })
        
            div.append(btn);
            contenedorProductos.append(div);
        });
    });


//DOM - Queryls
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciar = document.querySelector("#vaciar");
const confirmar = document.querySelector("#confirmar");
const botonesVaciarConfirmar = document.querySelectorAll(".btnvaciarconfirmar");
const numerito = document.querySelector("#numerito");


// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
      // Verifico si el producto ya está en el carrito
    const itemEncontrado = carrito.find(function(item) {
        return item.nombre === producto.nombre;
    });
    // Si ya está en el carrito, incrementa la cantidad; de lo contrario, agrega uno nuevo
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }
    // Después de agregar un producto al carrito, actualizar la interfaz del carrito
    actualizarCarrito();

    /* Uso de Libreria  */
    Toastify({
        text: "Producto Agregado",
        duration: 1000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

// // Mostrar productos en la página === SE PASO AL FETCH
// productos.forEach(function(producto) {
//     const div = document.createElement("div");
//     div.classList.add("producto");
//     div.innerHTML = `
//         <img class="producto-img" src="${producto.imagen}" alt="${producto.nombre}">
//         <h3>${producto.nombre}</h3>
//         <p>S/${producto.precio}</p>
//     `;

//     const btn = document.createElement("button");
//     btn.classList.add("producto-btn");
//     btn.innerText = "Agregar al carrito";

//     btn.addEventListener("click", function() {
//         agregarAlCarrito(producto); // Llamar a la función agregarAlCarrito cuando se hace clic en el botón
//     })

//     div.append(btn);
//     contenedorProductos.append(div);
// })

// Función para actualizar el carrito
function actualizarCarrito() {
    if (carrito.length === 0) {
         // Si el carrito está vacío, mostrar un mensaje y ocultar la sección de productos
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciar.classList.add("d-none");
        confirmar.classList.add("d-none");
    } else {
        // Si hay productos en el carrito, mostrar la sección de productos
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciar.classList.remove("d-none");
        confirmar.classList.remove("d-none");

        // Limpiar el contenido actual del contenedor de productos en el carrito
        carritoProductos.innerHTML = "";

        // Crear elementos HTML para cada producto en el carrito 
        carrito.forEach(function(producto) {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
                <p>Subt: S/${producto.cantidad * producto.precio}</p>
            `;

            // Crear un botón para sumar productos del carrito
            const btnSumar = document.createElement("button");
            btnSumar.classList.add("carrito-producto-btn");
            btnSumar.innerText = "➕";
            btnSumar.addEventListener("click", function() {
                sumarDelCarrito(producto);
                actualizarCarrito(); // Llamar a la función actualizarCarrito después de sumar un producto al carrito
            });
            div.append(btnSumar);

            // Crear un botón para restar productos del carrito
            const btnRestar = document.createElement("button");
            btnRestar.classList.add("carrito-producto-btn");
            btnRestar.innerText = "➖";
            btnRestar.addEventListener("click", function() {
                restarDelCarrito(producto);
                actualizarCarrito(); // Llamar a la función actualizarCarrito después de restar un producto del carrito
            });
            div.append(btnRestar);

            // Crear un botón para eliminar el producto del carrito
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("carrito-producto-btn");
            btnEliminar.innerText = "❎";
            btnEliminar.addEventListener("click", function() {
                borrarDelCarrito(producto);
                actualizarCarrito(); // Llamar a la función actualizarCarrito después de eliminar un producto del carrito
            });
            div.append(btnEliminar);

            // Agregar el elemento al contenedor de productos en el carrito
            carritoProductos.append(div);
        })
    }
    actualizarTotal();
    calcularNumerito (); // aquí 07_05

    // Guardar el estado del carrito en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para borrar un producto del carrito
function borrarDelCarrito(producto) {
    const prodIndex = carrito.findIndex(function(item) {
        return item.nombre === producto.nombre;
    });
    carrito.splice(prodIndex, 1);
    actualizarCarrito();
}

// Función para sumar un producto en el carrito
function sumarDelCarrito(producto) {
    producto.cantidad++;
    actualizarCarrito();
}

// Función para restar un producto en el carrito
function restarDelCarrito(producto) {
    if (producto.cantidad === 1) {
        borrarDelCarrito(producto);
    } else {
        producto.cantidad--;
    }
    actualizarCarrito();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    // Calcular el total sumando los precios de todos los productos en el carrito
    const total = carrito.reduce(function(acumulador, producto) {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);
    // Mostrar el total en la interfaz del carrito
    carritoTotal.innerText = `S/${total.toFixed(2)}`;
}

//Función calcular el número del carrito
const calcularNumerito = () => {
    const numeritoTotal = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    numerito.innerText = numeritoTotal;
    }

botonesVaciarConfirmar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        const targetId = e.target.id;
        Swal.fire({
            title: targetId === "vaciar" ? "¿Deseas vaciar los " + " productos de tu carrito?" : "¿Deseas confirmar tu compra?",
            showCancelButton: true,
            confirmButtonText: targetId === "vaciar" ? "¡Sí!" : "¡Si!",
            cancelButtonText: "¡No!"
          }).then((result) => {
            if (result.isConfirmed) {
              carrito.length = 0;
              actualizarCarrito();
              Swal.fire({
                title: targetId === "vaciar" ? "¡Carrito vaciado!" : "¡Compra confirmada!",
                icon: "success"
              });
            }
          });
    })
})


// Llamar a la función actualizarCarrito para inicializar la interfaz del carrito
actualizarCarrito();

