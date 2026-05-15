// --- MÓDULO DE SINCRONIZACIÓN AUTOMÁTICA CORREXIDO (sincronizacion.js) ---

(function descargarDatosAlInicio() {
    if (!window.SCRIPT_URL) return;

    console.log("Conectando coa nube...");

    fetch(window.SCRIPT_URL)
        .then(response => response.json())
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object') {
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Sincronización inicial OK");
                
                // Forzamos que la pantalla se dibuje se xa estamos dentro
                if (typeof inicializarApp === 'function') inicializarApp();
            }
        })
        .catch(err => console.warn("Modo offline activo."));
})();

function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL) return;

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    // CAMBIO CLAVE: Eliminamos 'no-cors' para que Google non nos bloquee
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => console.log("Garda con éxito:", res))
    .catch(err => console.error("Erro ao sincronizar:", err));
}

function forzarSincro() {
    enviarDatosAWebApp();
}