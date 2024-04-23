// Defino de la clase Producto
class Producto {
    constructor(nombre, precio, imagen, categoría) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.categoría = categoría;
    }
}

// Creo los productos disponibles
const taza = new Producto("Taza", 20, "./imagen/merc_1.png", "Taza");
const polo = new Producto("Polo", 30, "./imagen/merc_2.png", "Ropa");
const camisa = new Producto("Camisa", 50, "./imagen/merc_3.png", "Ropa");
const estampa = new Producto("Estampa", 5, "./imagen/merc_4.png", "Estampa");

// Defino la lista de productos disponibles en la tienda
const productos = [taza, polo, camisa, estampa];

//DOM - Queryls
const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");

//Función agregarAlCarrito
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
    actualizarCarrito();
}


// Itera sobre los productos disponibles y los muestra en la interfaz
productos.forEach(function(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>S/${producto.precio}</p>
    `;

    // Botón Agregar al Carrito
    const btn = document.createElement("button");
    btn.classList.add("producto-btn");
    btn.innerText = "Agregar al carrito";

    btn.addEventListener("click", function() {
        agregarAlCarrito(producto);
    })

    div.append(btn);
    contenedorProductos.append(div);
})


//Función actualizarCarrito
function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");

        carritoProductos.innerHTML = "";

        carrito.forEach(function(producto) {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
                <p>Subt: S/${producto.cantidad * producto.precio}</p>
            `;

            // Boton sumar
            const btnSumar = document.createElement("button");
            btnSumar.classList.add("carrito-producto-btn");
            btnSumar.innerText = "➕";
            btnSumar.addEventListener("click", function() {
                sumarDelCarrito(producto);
                actualizarCarrito();
            });
            div.append(btnSumar);

            // Boton Restar
            const btnRestar = document.createElement("button");
            btnRestar.classList.add("carrito-producto-btn");
            btnRestar.innerText = "➖";
            btnRestar.addEventListener("click", function() {
                restarDelCarrito(producto);
                actualizarCarrito();
            });
            div.append(btnRestar);

            // Boton Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("carrito-producto-btn");
            btnEliminar.innerText = "❎";
            btnEliminar.addEventListener("click", function() {
                borrarDelCarrito(producto);
                actualizarCarrito();
            });
            div.append(btnEliminar);

            carritoProductos.append(div);
        })
    }
    actualizarTotal();

     // Guardo el carrito en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Función borrarDelCarrito
function borrarDelCarrito(producto) {
    const prodIndex = carrito.findIndex(function(item) {
        return item.nombre === producto.nombre;
    });
    carrito.splice(prodIndex, 1);
    actualizarCarrito();
}

// Función sumarDelCarrito
function sumarDelCarrito(producto) {
    producto.cantidad++;
    actualizarCarrito();
}

//Función restarDelCarrito
function restarDelCarrito(producto) {
    if (producto.cantidad === 1) {
        borrarDelCarrito(producto);
    } else {
        producto.cantidad--;
    }
    actualizarCarrito();
}

// Función actualizarTotal - Me da el total.
function actualizarTotal() {
    const total = carrito.reduce(function(acumulador, producto) {
        return acumulador + (producto.precio * producto.cantidad);
    }, 0);
    carritoTotal.innerText = `S/${total.toFixed(2)}`;
}

// Carga el carrito desde el storage cuando se carga la página
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
actualizarCarrito();
