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
        .then(response => response.json())
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object') {
                // Guardamos lo que viene de la nube en la memoria del navegador
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Sincronización inicial completada con éxito.");
                
                // Si estamos en una pantalla que muestra datos, la refrescamos
                if (typeof renderizarListaActividades === 'function') renderizarListaActividades();
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

    // Enviamos los datos "en segundo plano"
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("Copia de seguridade enviada á nube automaticamente."))
    .catch(err => console.error("Erro ao sincronizar:", err));
}

/**
 * Función por si quieres forzar la subida manualmente (opcional)
 */
function forzarSincro() {
    console.log("Forzando subida...");
    enviarDatosAWebApp();
}