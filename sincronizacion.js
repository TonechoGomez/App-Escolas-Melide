// --- MÓDULO DE SINCRONIZACIÓN AUTOMÁTICA (sincronizacion.js) ---

/**
 * Esta función se ejecuta sola al cargar la página.
 * Busca los datos en la nube y actualiza la App automáticamente.
 */
(function descargarDatosAlInicio() {
    // Si no hay URL configurada, no hace nada
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;

    console.log("Conectando coa nube para descargar datos...");

    fetch(window.SCRIPT_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erro na resposta del servidor");
            return response.json();
        })
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object' && Object.keys(datosNube).length > 0) {
                // Guardamos lo que viene de la nube en la memoria del navegador
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Sincronización inicial completada con éxito.");
                
                // Refrescamos la interfaz llamando a la función de dibujo que esté activa
                if (typeof render === 'function') {
                    render();
                } else if (typeof renderizarListaActividades === 'function') {
                    renderizarListaActividades();
                }
            }
        })
        .catch(err => console.warn("Modo offline: Usando datos gardados no navegador."));
})();

/**
 * Envía los datos a Google Sheets de forma transparente.
 */
function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    // Enviamos como texto plano para saltar las restricciones de CORS de forma limpia
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("Copia de seguridade enviada á nube automaticamente."))
    .catch(err => console.error("Erro ao sincronizar:", err));
}

/**
 * Función para forzar la subida manualmente desde la consola del navegador
 */
function forzarSincro() {
    console.log("Forzando subida...");
    enviarDatosAWebApp();
}