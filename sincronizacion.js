// --- MÓDULO DE SINCRONIZACIÓN AUTOMÁTICA (MELIDE) ---

/**
 * 1. DESCARGA AUTOMÁTICA AL INICIO
 */
(function cargarDatosAlInicio() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;
    
    fetch(window.SCRIPT_URL)
        .then(response => response.json())
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object') {
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Datos sincronizados desde la nube.");
            }
        })
        .catch(err => console.warn("Modo offline o error de conexión."));
})();

/**
 * 2. FUNCIÓN DE ENVÍO
 */
function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("Nube actualizada."))
    .catch(err => console.error("Error al subir:", err));
}

/**
 * 3. PANEL VISUAL (BOTÓN AZUL)
 */
function mostrarPanelNube() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    actions.innerHTML = `<h2 style="color:white; margin:0;">☁️ SINCRONIZACIÓN NUBE</h2>`;
    container.style.display = "block"; 
    container.innerHTML = `
        <div style="background:white; color:#1e293b; padding:30px; border-radius:20px; max-width:500px; margin:20px auto; box-shadow:0 10px 25px rgba(0,0,0,0.3); text-align:center;">
            <h3 style="color:#005696; margin-top:0;">Estado da Conexión</h3>
            <p style="font-size:0.9rem; color:#64748b; margin-bottom:20px;">Usa o botón azul para enviar as parroquias e datos deste ordenador á nube.</p>
            
            <button onclick="forzarSincro()" style="width:100%; background:#0284c7; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1.1rem; margin-bottom:10px;">☁️ SUBIR Á NUBE AGORA</button>
            
            <button onclick="exportarCopiaSeguridad()" style="width:100%; background:#64748b; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer; margin-bottom:10px;">Descargar copia manual (JSON)</button>
            
            <button onclick="if(typeof mostrarDatos === 'function') mostrarDatos()" style="width:100%; background:#475569; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer;">Ver Estadísticas</button>

            <div style="border-top:1px solid #eee; padding-top:20px; margin-top:20px;">
                <h3 style="color:#ef4444; font-size:1rem;">Zona Perigosa</h3>
                <button onclick="borrarTodo()" style="width:100%; background:#fee2e2; color:#ef4444; padding:10px; border:1px solid #fca5a5; border-radius:12px; cursor:pointer; font-weight:bold;">BORRAR TODO ESTE DISPOSITIVO</button>
            </div>
        </div>
    `;
}

function forzarSincro() {
    alert("Subindo datos a Google Sheets...");
    enviarDatosAWebApp();
}

function exportarCopiaSeguridad() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.db));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "melide_backup.json");
    link.click();
}

function borrarTodo() {
    if (confirm("¿ESTÁS SEGURO? Se borrarán los datos LOCALES.")) {
        window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
        saveData();
        location.reload();
    }
}
