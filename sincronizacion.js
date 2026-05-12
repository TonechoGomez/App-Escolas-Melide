// --- MÓDULO DE SINCRONIZACIÓN AUTOMÁTICA ---

(function cargarDatosAlInicio() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;
    fetch(window.SCRIPT_URL).then(r => r.json()).then(datos => {
        if (datos) {
            window.db = datos;
            localStorage.setItem('melide_db', JSON.stringify(window.db));
            console.log("Nube cargada.");
        }
    }).catch(e => console.warn("Modo offline."));
})();

function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: "updateDB", db: window.db, user: window.userRole, fecha: new Date().toLocaleString() })
    });
}

function mostrarPanelNube() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    actions.innerHTML = `<h2 style="color:white; margin:0;">⚙️ CONFIGURACIÓN DO SISTEMA</h2>`;
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.style.padding = "20px";

    container.innerHTML = `
        <div onclick="verPanelEstadisticas()" style="background:white; color:#005696; padding:40px 20px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <span style="font-size: 4rem;">📊</span>
            <div style="font-weight:bold; font-size:1.4rem; margin-top:15px;">ESTADÍSTICAS</div>
            <p style="font-size:0.9rem; color:#64748b;">Asistencia e ocupación</p>
        </div>

        <div style="background:white; color:#1e293b; padding:30px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align:center;">
            <span style="font-size: 3rem;">☁️</span>
            <h3 style="color:#005696; margin:10px 0;">Sincronización Nube</h3>
            <button onclick="forzarSincro()" style="width:100%; background:#0284c7; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-bottom:10px;">SUBIR Á NUBE AGORA</button>
            <button onclick="verPanelDatos()" style="width:100%; background:#64748b; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer;">Xestión de Copias JSON</button>
        </div>
    `;
}

function forzarSincro() {
    alert("Subindo datos a Google Sheets...");
    enviarDatosAWebApp();
}
