# Mascoteros Tienda Online 🐾🛍️✨

Este proyecto consiste en una tienda online de productos para mascotas.

El sitio permite a los usuarios simular el proceso de compra:buscar productos, agregarlos, eliminar productos y modificar la cantidad de los mismos. Si el usuario decide comprar, aparece un mensaje de confirmación para **aceptar** o **cancelar**. En caso de aceptar, se muestra un **spinner** indicando que la compra está en proceso, seguido de un **mensaje de agradecimiento**. 

Además,en la sección Contacto, el proyecto incorpora un **formulario de contacto** que permite a los usuarios realizar consultas. EmailJS se conecta con el formulario usando su API y facilita el envío del mensaje. 

## 🚀 Demo  
Podés ver el proyecto en vivo aquí: [Mascoteros Tienda Online](https://jesi10.github.io/Mascoteros_Tienda_Online/)

## Características

- **Petición asíncrona para obtener productos**: Los datos de los productos para mascotas se cargan de manera asíncrona desde un archivo JSON utilizando `fetch` con `async` y `await`, lo que permite una carga dinámica y eficiente de los productos y filtros en la página.

- **Búsqueda de productos**: Los usuarios pueden buscar productos específicos por nombre y filtrar los resultados por categorías.

- **Carrito de compras**: Funcionalidades para agregar productos al carrito, eliminar artículos y modificar la cantidad de productos.

- **Persistencia con LocalStorage**: El carrito de compras se guarda en el **LocalStorage**, lo que permite que la información del carrito persista entre sesiones.

- **Formulario de contacto e EmailJS**: Se validan los campos del formulario y, si todo es correcto, usa EmailJS para enviarlo.

- **Alertas interactivas**: El proyecto utiliza **Sweet-Alert2** para mostrar alertas personalizadas y mejorar la interacción con el usuario.

## Tecnologías utilizadas

- **HTML5** ,**CSS** ,**JavaScript** , **Bootstrap** , **Sweet-Alert2** ,**Font Awesome** , **EmailJS**

## Estructura del proyecto

El proyecto consta de los siguientes archivos y carpetas:

### Archivos

- **index.html**
- **productos.json** (contiene los datos de los productos)

### Carpetas

- **html**: Contiene el archivo `contacto.html` con el formulario de contacto.
- **js**: Contiene los archivos `main.js` y `validar.js`.
- **assets**: Contiene las imágenes de los productos, el logo y demás recursos visuales.
- **css**: Contiene el archivo `styles.css` con los estilos personalizados para el diseño del sitio.

Gracias por visitar mi proyecto 😊

Jésica Llanos