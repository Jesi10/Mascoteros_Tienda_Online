const btn = document.getElementById("button");
const form = document.getElementById("form");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCampo(input) {
    let value = input.value.trim();
    let isValid = true;

    if (value === "") {
        isValid = false;
    } else if (input.id === "email" && !emailRegex.test(value)) {
        isValid = false;
    }

    if (isValid) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    return isValid;
}


document.querySelectorAll("[data-validate]").forEach((input) => {
    input.addEventListener("input", () => validarCampo(input));
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValidForm = true;
    let firstErrorField = null;

    document.querySelectorAll("[data-validate]").forEach((input) => {
        if (!validarCampo(input)) {
            isValidForm = false;
            if (!firstErrorField) firstErrorField = input;
        }
    });

    if (!isValidForm) {
        Swal.fire({
            icon: "error",
            title: "Error al completar el formulario",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        firstErrorField.focus();
        return;
    }

   
    btn.value = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_y0fc6pq';


    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.value = "Enviar";

            Swal.fire({
                icon: "success",
                title: "¡Formulario enviado!",
                text: "Gracias por comunicarte. Te responderemos a la brevedad 🐾",
                confirmButtonColor: "#ffffff",
                confirmButtonText: "OK",
                timer: 3000,
                timerProgressBar: true,
                allowOutsideClick: false,
                customClass: {
                    popup: "custom-alert",
                    confirmButton: "custom-ok-button"
                }
            });

            form.reset();
            document.querySelectorAll(".is-valid").forEach((input) => {
                input.classList.remove("is-valid");
            });

        }, (err) => {
            btn.value = "Enviar";

            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "Hubo un problema al enviar el mensaje. Intenta nuevamente.",
                confirmButtonColor: "#d33",
                confirmButtonText: "Cerrar"
            });

            console.error("Error:", err);
        });
});


