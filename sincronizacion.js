// --- MÓDULO DE SINCRONIZACIÓN CON LA NUBE (GOOGLE SHEETS) ---

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
function mostrarConfiguracion() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    actions.innerHTML = "";
    
    container.innerHTML = `
        <div class="menu-card" style="text-align:left;">
            <h3 style="color:var(--melide-primary);">Estado de la Nube</h3>
            <p style="font-size:0.8rem;">Los datos se guardan automáticamente en este dispositivo.</p>
            
            <button onclick="forzarSincro()" style="background:#0ea5e9;">Subir a la nube ahora</button>
            <button onclick="exportarCopiaSeguridad()" style="background:#64748b;">Descargar copia (JSON)</button>
            
            <hr style="margin:20px 0; opacity:0.2;">
            
            <h3 style="color:#ef4444;">Zona Peligrosa</h3>
            <button onclick="borrarTodo()" style="background:#ef4444;">BORRAR TODOS LOS DATOS</button>
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