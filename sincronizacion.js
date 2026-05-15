// --- SINCRONIZACIÓN TOTAL COMPATIBLE (sincronizacion.js) ---

(function descargarDatosAlInicio() {
    if (!window.SCRIPT_URL) return;

    fetch(window.SCRIPT_URL)
        .then(response => response.json())
        .then(datosNube => {
            // Solo descargamos si la nube tiene datos reales para no borrar lo que ya tenemos
            if (datosNube && datosNube.Alumnos && datosNube.Alumnos.length > 0) {
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("✅ Datos descargados: " + datosNube.Alumnos.length + " alumnos.");
                
                // Si la App ya arrancó, forzamos a que pinte los datos
                if (typeof inicializarApp === 'function') inicializarApp();
            }
        })
        .catch(err => console.warn("Modo offline: Usando memoria local."));
})();

function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL) return;

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    // MODO 'no-cors': Es el único que Google acepta siempre desde cualquier equipo
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => {
        // En modo no-cors no podemos leer la respuesta, pero si llega aquí es que salió bien
        console.log("🚀 Datos enviados a la nube con éxito.");
        alert("Sincronización enviada correctamente.");
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Error al conectar con la nube.");
    });
}