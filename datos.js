// ==========================================
// MÓDULO: CONFIGURACIÓN E DATOS (datos.js)
// ==========================================

window.mesFiltroActual = new Date().toISOString().substring(0, 7); 

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
        <div onclick="verPanelEstadisticas()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">📊</span>
            <div style="font-weight:900; font-size:1.5rem;">ESTADÍSTICAS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Ocupación e asistencia mensual</div>
        </div>

        <div onclick="mostrarGestionDatos()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">💾</span>
            <div style="font-weight:900; font-size:1.5rem;">DATOS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Copias de seguridade e JSON</div>
        </div>
    `;
}

function mostrarGestionDatos() {
    const container = document.getElementById('data-container');
    container.innerHTML = `
        <div style="background:white; padding:30px; border-radius:25px; color:#333; max-width:600px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
            <h3 style="margin-top:0; color:#005696; border-bottom:2px solid #f1f5f9; padding-bottom:15px;">XESTIÓN DE COPIAS</h3>
            
            <div style="margin-bottom:25px;">
                <p style="font-weight:bold; margin-bottom:10px; font-size:0.9rem;">1. COPIA DE SEGURIDADE (JSON)</p>
                <button onclick=\"exportarDatosJSON()\" style=\"width:100%; padding:15px; background:#005696; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-bottom:10px;\">DESCARGAR ARCHIVO JSON</button>
                <input type=\"file\" id=\"import-file\" onchange=\"importarDatosJSON(event)\" style=\"display:none;\">
                <button onclick=\"document.getElementById('import-file').click()\" style=\"width:100%; padding:15px; background:#f1f5f9; color:#005696; border:1px solid #005696; border-radius:12px; font-weight:bold; cursor:pointer;\">RESTAURAR DESDE ARCHIVO</button>
            </div>

            <div style="background:#fee2e2; padding:20px; border-radius:15px; border:1px solid #fecaca;">
                <p style="color:#dc2626; font-weight:bold; margin:0 0 10px; font-size:0.8rem;">ZONA DE PERIGO</p>
                <button onclick=\"if(confirm('¿BORRAR TODO?')){ localStorage.clear(); location.reload(); }\" style=\"width:100%; padding:12px; background:#ef4444; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer; font-size:0.85rem;\">⚠️ BORRAR TODA A BASE DE DATOS</button>
            </div>

            <button onclick=\"mostrarDatos()\" style=\"margin-top:30px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;\">⬅️ VOLVER</button>
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
                if (typeof saveData === 'function') saveData();
                location.reload();
            }
        } catch (err) { alert("Archivo non válido."); }
    };
    reader.readAsText(event.target.files[0]);
}