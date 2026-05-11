// --- MÓDULO DE SINCRONIZACIÓN CON LA NUBE (GOOGLE SHEETS) ---

/**
 * 1. DESCARGA AUTOMÁTICA AL INICIO
 * Este bloque hace que la App busque los datos en la nube nada más abrirse.
 */
(function cargarDatosAlInicio() {
    // Si no hay URL configurada, no hacemos nada
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;

    console.log("Sincronizando con la nube...");
    
    fetch(window.SCRIPT_URL)
        .then(response => response.json())
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object') {
                // Guardamos lo que viene de la nube en el dispositivo
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Base de datos actualizada desde la nube con éxito.");
            }
        })
        .catch(err => console.warn("Modo offline: No se pudo conectar con la nube.", err));
})();

/**
 * Envía la base de datos completa a la Web App de Google
 */
function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) {
        console.warn("Sincronización desactivada: Falta la URL de Google Script.");
        return;
    }

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole,
        fecha: new Date().toLocaleString()
    };

    // Usamos 'fetch' para enviar los datos de forma invisible
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Para evitar problemas de permisos entre dominios
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("Sincronización enviada con éxito."))
    .catch(err => console.error("Error en la sincronización:", err));
}

/**
 * Función especial para la sección de Configuración
 */
function mostrarPanelNube() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    actions.innerHTML = `<h2 style="color:white; margin:0;">☁️ SINCRONIZACIÓN NUBE</h2>`;
    
    container.style.display = "block"; 
    container.innerHTML = `
        <div style="background:white; color:#1e293b; padding:30px; border-radius:20px; max-width:500px; margin:auto; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
            <h3 style="color:#005696; margin-top:0;">Estado de la Conexión</h3>
            <p style="font-size:0.9rem; color:#64748b;">Usa el botón azul para enviar las parroquias y datos de este ordenador a todos los monitores.</p>
            
            <button onclick="forzarSincro()" style="width:100%; background:#0284c7; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1.1rem; margin-bottom:10px;">☁️ SUBIR A LA NUBE AHORA</button>
            
            <button onclick="exportarCopiaSeguridad()" style="width:100%; background:#64748b; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer; margin-bottom:20px;">Descargar copia manual (JSON)</button>
            
            <div style="border-top:1px solid #eee; pt:20px; margin-top:20px;">
                <h3 style="color:#ef4444; font-size:1rem;">Zona Peligrosa</h3>
                <button onclick="borrarTodo()" style="width:100%; background:#fee2e2; color:#ef4444; padding:10px; border:1px solid #fca5a5; border-radius:12px; cursor:pointer; font-weight:bold;">BORRAR TODO ESTE DISPOSITIVO</button>
            </div>
        </div>
    `;
}
function forzarSincro() {
    alert("Iniciando subida a Google Sheets...");
    enviarDatosAWebApp();
}

function exportarCopiaSeguridad() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "copia_seguridad_melide.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function borrarTodo() {
    if (confirm("¿ESTÁS SEGURO? Esto borrará todos los alumnos, monitores y actividades de este dispositivo.")) {
        if (confirm("¿De verdad? Esta acción no se puede deshacer.")) {
            window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
            saveData();
            location.reload();
        }
    }
}

console.log("Módulo de sincronización cargado.");
