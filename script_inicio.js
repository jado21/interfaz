
function validar_campos(){
    localStorage.clear(); // SI dejo el clear fuera de la funcion
    let nombre= document.getElementById("nombre").value.trim();
    let edad = document.getElementById("edad").value.trim();
    let capital = document.getElementById("capital").value.trim();
    let profesion = document.getElementById("profesion").value.trim();

    if (!nombre || !edad || !capital || !profesion) {
      alert("Por favor, completa todos los campos.");
    }
    else{
        localStorage.setItem("nombre_usuario",nombre);
        localStorage.setItem("edad_usuario",edad);
        localStorage.setItem("capital_usuario",capital);
        localStorage.setItem("profesion_usuario",profesion);
        window.location.href = "funcion_recomendacion.html"; 
        // Llegando a este punto la memoria se limpiara y comenzara el codigo desde la linea 1
    }
}

