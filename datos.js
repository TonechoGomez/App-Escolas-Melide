// ==========================================
// MÓDULO: CONFIGURACIÓN E DATOS (datos.js)
// ==========================================

window.mesFiltroActual = new Date().toISOString().substring(0, 7);

function mostrarDatos() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    if (!container || !actions) return;

    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase; font-size:1.4rem;">⚙️ CONFIGURACIÓN DO SISTEMA</h2>`;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.style.padding = "10px";
    container.innerHTML = "";

    // CAJÓN 1: ESTADÍSTICAS
    const cardStats = document.createElement('div');
    cardStats.style.cssText = "background:white; color:#1e293b; padding:30px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2); transition:transform 0.2s;";
    cardStats.innerHTML = `
        <span style="font-size:4rem; display:block; margin-bottom:15px;">📊</span>
        <h3 style="margin:0; font-size:1.5rem; color:#005696;">ESTADÍSTICAS</h3>
        <p style="color:#64748b; font-weight:bold;">Informes de asistencia por mes e actividade</p>
    `;
    cardStats.onclick = () => { if(typeof verPanelEstadisticas === 'function') verPanelEstadisticas(); };

    // CAJÓN 2: XESTIÓN DE DATOS
    const cardAdmin = document.createElement('div');
    cardAdmin.style.cssText = "background:white; color:#1e293b; padding:30px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2); transition:transform 0.2s;";
    cardAdmin.innerHTML = `
        <span style="font-size:4rem; display:block; margin-bottom:15px;">💾</span>
        <h3 style="margin:0; font-size:1.5rem; color:#005696;">XESTIÓN DE DATOS</h3>
        <p style="color:#64748b; font-weight:bold;">Copias de seguridade e mantemento</p>
    `;
    cardAdmin.onclick = () => { abrirConfiguracionDatos(); };

    container.appendChild(cardStats);
    container.appendChild(cardAdmin);
}

function abrirConfiguracionDatos() {
    const container = document.getElementById('data-container');
    container.innerHTML = `
        <div style="background:white; color:#1e293b; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2); grid-column: 1 / -1; max-width:600px; margin:auto;">
            <h3 style="text-align:center; color:#005696; margin-top:0;">ADMINISTRACIÓN DA BASE DE DATOS</h3>
            
            <div style="display:grid; gap:15px; margin-top:20px;">
                <button onclick="exportarDatosJSON()" style="width:100%; padding:15px; background:#005696; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">📥 DESCARGAR COPIA (JSON)</button>
                
                <div style="border:2px dashed #cbd5e1; padding:15px; border-radius:12px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-weight:bold; font-size:0.9rem;">RESTAURAR COPIA</p>
                    <input type="file" id="import-file" onchange="importarDatosJSON(event)" style="font-size:0.8rem;">
                </div>

                <button onclick="borrarTodaLaBD()" style="width:100%; background:#ef4444; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:20px;">⚠️ BORRAR TODA A BASE DE DATOS</button>
                
                <button onclick="mostrarDatos()" style="width:100%; padding:15px; background:#64748b; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px;">⬅️ VOLVER</button>
            </div>
        </div>
    `;
}

function exportarDatosJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.db));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "melide_backup_" + new Date().toISOString().split('T')[0] + ".json");
    link.click();
}

function importarDatosJSON(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm("Atención: Isto sobrescribirá todos os datos actuais. Queres continuar?")) {
                window.db = data;
                saveData();
                location.reload();
            }
        } catch (err) { alert("Erro ao ler o arquivo."); }
    };
    reader.readAsText(event.target.files[0]);
}

function borrarTodaLaBD() {
    if (confirm("⚠️ ¿ESTÁS SEGURO? Esta acción borrará todos os alumnos, actividades, monitores e instalacións permanentemente.")) {
        if (confirm("¿Confirmas que queres baleirar todo o sistema?")) {
            window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
            saveData();
            location.reload();
        }
    }
}