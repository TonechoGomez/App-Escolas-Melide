// ==========================================
// MÓDULO: CONFIGURACIÓN E DATOS (datos.js)
// ==========================================

// Variable global para mantener el filtro de mes actual (por defecto el mes actual)
window.mesFiltroActual = new Date().toISOString().substring(0, 7); // Formato "YYYY-MM"

// --- CONFIGURACIÓN GLOBAL Y BASE DE DATOS ---
window.db = JSON.parse(localStorage.getItem('melide_db')) || { 
    Monitores: [], 
    Actividades: [], 
    Aulas: [], 
    Alumnos: [] 
};

// URL de sincronización (Google Script)
window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR675_Y42K8pB8GzB9I_vI_RkZ_N4Fh9D0kR/exec";

/**
 * Guarda los datos en el navegador y activa la sincronización automática
 */
function saveData() {
    // Guardado local tradicional
    localStorage.setItem('melide_db', JSON.stringify(window.db));
    console.log("Datos guardados en memoria local.");
    
    // SINCRONIZACIÓN AUTOMÁTICA: 
    // Llama a la función de envío que está en sincronizacion.js
    if (typeof enviarDatosAWebApp === 'function') {
        enviarDatosAWebApp();
    }
}

/**
 * Función principal de Configuración.
 */
function mostrarDatos() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    const scrDash = document.getElementById('scr-dash');
    const scrEdit = document.getElementById('scr-edit');
    const btnAtras = document.getElementById('btn-atras');

    if (!container || !actions) return;

    if (scrDash) scrDash.style.display = "none";
    if (scrEdit) scrEdit.style.display = "block";
    if (btnAtras) btnAtras.style.display = "block";
    
    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase;">⚙️ CONFIGURACIÓN DO SISTEMA</h2>`;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.style.padding = "20px";

    container.innerHTML = `
        <div onclick="verEstadisticasAsistencia()" style="background:white; color:#005696; padding:30px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <span style="font-size: 3rem;">📊</span>
            <div style="font-weight:bold; margin-top:10px;">ESTADÍSTICAS ASISTENCIA</div>
        </div>
        <div onclick="verGestionCopias()" style="background:white; color:#1e293b; padding:30px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <span style="font-size: 3rem;">💾</span>
            <div style="font-weight:bold; margin-top:10px;">COPIAS DE SEGURIDADE</div>
        </div>
    `;
}

// --- PANEL DE COPIAS (Simplificado para integrarse) ---
function verGestionCopias() {
    const container = document.getElementById('data-container');
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; color:black; padding:30px; border-radius:20px; max-width:500px; margin:auto;">
            <h3 style="text-align:center;">Xestión de Datos</h3>
            <button onclick="exportarDatosJSON()" style="width:100%; background:#16a34a; color:white; padding:15px; border:none; border-radius:12px; margin-bottom:10px; cursor:pointer; font-weight:bold;">📥 EXPORTAR JSON</button>
            <div style="border:2px dashed #ccc; padding:15px; border-radius:12px; text-align:center; margin-bottom:10px;">
                <p style="font-size:0.8rem; color:#666;">IMPORTAR COPIA</p>
                <input type="file" onchange="importarDatosJSON(event)" style="font-size:0.8rem;">
            </div>
            <button onclick="borrarTodaLaBD()" style="width:100%; background:#ef4444; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer; font-size:0.85rem; margin-top:10px;">⚠️ BORRAR TODA A BASE DE DATOS</button>
            <button onclick="mostrarDatos()" style="margin-top:20px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">⬅️ VOLVER</button>
        </div>
    `;
}

function exportarDatosJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.db));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "melide_backup.json");
    link.click();
}

function importarDatosJSON(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm("Isto sobrescribirá todos os datos. Continuar?")) {
                window.db = data;
                saveData();
                location.reload();
            }
        } catch (err) { alert("Archivo non válido."); }
    };
    reader.readAsText(event.target.files[0]);
}

function borrarTodaLaBD() {
    if (confirm("¿ESTÁS SEGURO? Perderás todos os datos deste dispositivo.")) {
        window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
        saveData();
        location.reload();
    }
}