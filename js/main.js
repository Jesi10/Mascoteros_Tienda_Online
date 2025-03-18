document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("productos.json");
        const productos = await response.json();
        mostrarProductos(productos);
        generarFiltros(productos);

        const buscador = document.getElementById("buscador");
        buscador.addEventListener("input", () => aplicarFiltros(productos));

        const btnBuscar = document.querySelector(".hero-search button");
        btnBuscar.addEventListener("click", (event) => {
            event.preventDefault();
            aplicarFiltros(productos);
        });

        document.getElementById("filtros-container").addEventListener("change", () => aplicarFiltros(productos));

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }

    inicializarEventos();
    cargarCarritoDesdeLocalStorage();
    actualizarCarritoNavbar();
    iniciarAnuncio();
});


function generarFiltros(productos) {
    const filtrosContainer = document.getElementById("filtros-container");
    filtrosContainer.innerHTML = "";

    const categoriasUnicas = new Set();
    productos.forEach(producto => {
        producto.categoria.forEach(cat => categoriasUnicas.add(cat));
    });

    categoriasUnicas.forEach(categoria => {
        const div = document.createElement("div");
        div.classList.add("form-check", "d-flex", "align-items-center");

        div.innerHTML = `
            <input class="form-check-input border-secondary me-2" type="checkbox" value="${categoria}" id="${categoria}">
            <label class="form-check-label" for="${categoria}">${categoria}</label>
        `;

        filtrosContainer.appendChild(div);
    });

    document.querySelectorAll("#filtros-container input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", () => aplicarFiltros(productos));
    });
}


function aplicarFiltros(productos) {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const checkboxes = document.querySelectorAll("#filtros-container input[type='checkbox']:checked");
    const categoriasSeleccionadas = Array.from(checkboxes).map(checkbox => checkbox.value);

    let productosFiltrados = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(texto) &&
        (categoriasSeleccionadas.length === 0 || producto.categoria.some(cat => categoriasSeleccionadas.includes(cat)))
    );

    mostrarProductos(productosFiltrados);

    if (productosFiltrados.length > 0) {
        const seccionProductos = document.getElementById("productos-container"); 
        seccionProductos.scrollIntoView({ behavior: "smooth" });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Producto no encontrado",
            text: "Lo sentimos, no hay coincidencias 😢",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: "top-end"
        });
    }
}


const iconoCarrito = document.getElementById("icono-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const carritoElement = document.getElementById("carrito");
const carritoItemsContainer = document.querySelector(".carrito-items");

let carrito = [];

iconoCarrito.addEventListener("click", hacerVisibleCarrito);

function mostrarProductos(productos) {
    let contenedor = document.querySelector(".contenedor-items");
    contenedor.innerHTML = "";

    productos.forEach(({ titulo, imagen, precio }) => {
        let item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = `
            <span class="titulo-item">${titulo}</span>
            <img src="${imagen}" alt="" class="img-item">
            <span class="precio-item">${precio}</span>
            <button class="boton-item">Agregar al Carrito</button>
        `;
        item.querySelector(".boton-item").addEventListener("click", () => agregarItemAlCarrito(titulo, precio, imagen));
        contenedor.appendChild(item);
    });
}

function inicializarEventos() {
    document.querySelector(".btn-pagar").addEventListener("click", pagarClicked);
    document.querySelector(".cerrar-carrito").addEventListener("click", ocultarCarrito);
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    let existe = carrito.find(item => item.titulo === titulo);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ titulo, precio, imagen: imagenSrc, cantidad: 1 });
    }

    actualizarCarrito();
    actualizarTotalCarrito();
    guardarCarritoEnLocalStorage();

    Swal.fire({
        title: "¡Agregado!",
        text: `${titulo} añadido al carrito.`,
        icon: "success",
        toast: true, 
        position: "top-end",
        showConfirmButton: false,
        timer: 1500
    });
}


function eliminarItemDelCarrito(titulo) {
    carrito = carrito.filter(item => item.titulo !== titulo);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();

    Swal.fire({
        title: "Producto eliminado",
        text: `${titulo} fue eliminado del carrito.`,
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500
    });
}

function actualizarCarrito() {
    carritoItemsContainer.innerHTML = "";
    carrito.forEach(({ titulo, precio, imagen, cantidad }) => {
        let item = document.createElement("div");
        item.classList.add("carrito-item");
        item.innerHTML = `
            <img src="${imagen}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="${cantidad}" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar"><i class="fa-solid fa-trash"></i></button>
        `;

        item.querySelector(".btn-eliminar").addEventListener("click", () => eliminarItemDelCarrito(titulo));
        item.querySelector(".sumar-cantidad").addEventListener("click", () => modificarCantidad(titulo, 1));
        item.querySelector(".restar-cantidad").addEventListener("click", () => modificarCantidad(titulo, -1));

        carritoItemsContainer.appendChild(item);
    });

    actualizarTotalCarrito();
    actualizarContadorCarrito();
}

function modificarCantidad(titulo, cantidad) {
    let item = carrito.find(producto => producto.titulo === titulo);
    if (item) {
        item.cantidad = Math.max(1, item.cantidad + cantidad);
        actualizarCarrito();
        guardarCarritoEnLocalStorage();
    }
}


function actualizarTotalCarrito() {
    let total = 0;
    let cantidadProductos = 0;

    document.querySelectorAll(".carrito-item").forEach(item => {
        let precioTexto = item.querySelector(".carrito-item-precio").innerText
            .replace("$", "").replace(/\./g, "").replace(",", ".");
        let precio = parseFloat(precioTexto) || 0;
        let cantidad = parseInt(item.querySelector(".carrito-item-cantidad").value) || 0;

        total += precio * cantidad;
        cantidadProductos += cantidad;
    });

    document.querySelector(".carrito-precio-total").innerText = 
        `$${total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    let contadorCarrito = document.querySelector("#contador-carrito");
    contadorCarrito.innerText = cantidadProductos;
    contadorCarrito.style.display = cantidadProductos > 0 ? "inline-block" : "none";

}

function hacerVisibleCarrito() {
    carritoElement.classList.add("visible");
}

function ocultarCarrito() {
    carritoElement.classList.remove("visible");
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    let carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function actualizarContadorCarrito() {
    let totalItems = carrito.reduce((sum, { cantidad }) => sum + cantidad, 0);
    contadorCarrito.innerText = totalItems;
}

function pagarClicked() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "¡Carrito vacío! 🛒",
            text: "En este momento tu carrito está vacío.",
            icon: "warning", 
            showConfirmButton: true,
            confirmButtonColor: "#ff9f68",
            confirmButtonText: "Entendido",
            timer: 3000, 
            timerProgressBar: true,
           
        });
        return;
    }

    Swal.fire({
        title: "¿Confirmar compra?",
        text: "No podrás deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: "confirm-alert",
            icon: "confirm-warning-icon"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Procesando pago...",
                html: `
                    <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p style="margin-top:10px; color:#ff7f50;">Por favor, espera unos segundos.</p>
                `,
                showConfirmButton: false,
                allowOutsideClick: false
            });

            setTimeout(() => {
                Swal.fire({
                    title: "¡Compra realizada!",
                    text: "Gracias por comprar en Mascoteros.",
                    icon: "success",
                    confirmButtonColor: "#ffffff",
                    confirmButtonText: "OK",
                    customClass: {
                        popup: "custom-alert",
                        confirmButton: "custom-ok-button"
                    }
                });
                carrito = [];
                actualizarCarrito();
                guardarCarritoEnLocalStorage();
            }, 2000);
        }
    });
}


function actualizarCarritoNavbar() {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const cantidadTotal = carritoGuardado.reduce((total, producto) => total + producto.cantidad, 0);
    const contadorCarrito = document.getElementById('contador-carrito');
    if (cantidadTotal > 0) {
        contadorCarrito.textContent = cantidadTotal;
        contadorCarrito.style.display = "inline-block";
    } else {
        contadorCarrito.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", actualizarCarritoNavbar);


function iniciarAnuncio() {
    const mensajeElemento = document.getElementById("mensaje");
    if (!mensajeElemento) return;

    const mensajes = ["🐶 Conocé la temporada Otoño-Invierno 🧣","🎉 Promociones por el día del Animal todo el mes de Abril 🎉","📦 Próximamente envíos a todo el país",];

    let index = 0;

    function cambiarMensaje() {
        mensajeElemento.style.opacity = 0;
        setTimeout(() => {
            mensajeElemento.textContent = mensajes[index];
            mensajeElemento.style.opacity = 1;
            index = (index + 1) % mensajes.length;
        }, 500);
    }

    cambiarMensaje();
    setInterval(cambiarMensaje, 3000);
}



document.addEventListener("DOMContentLoaded", function () {
    let paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual === "") {
        paginaActual = "index.html";
    }
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    navLinks.forEach(link => {
        if (link.getAttribute("href").includes(paginaActual)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});



















