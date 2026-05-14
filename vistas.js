// ==========================================
// MÓDULO: VISTAS Y ESTADÍSTICAS (vistas.js)
// ==========================================

function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    if (!container || !actions) return;

    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase;">📊 ESTADÍSTICAS E RENDEMENTO</h2>`;
    
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; color:black; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2); max-width: 100%; box-sizing: border-box;">
            <div style="margin-bottom:20px; display:flex; gap:15px; align-items:center; justify-content:center; flex-wrap: wrap;">
                <label style="font-weight:bold;">Seleccionar Mes:</label>
                <input type="month" id="mes-stats" value="${window.mesFiltroActual}" onchange="window.mesFiltroActual=this.value; verPanelEstadisticas()" style="padding:10px; border-radius:10px; border:1px solid #ddd;">
            </div>
            <div id="stats-render" style="overflow-x: auto;">Calculando...</div>
            <button onclick="mostrarDatos()" style="margin-top:20px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">⬅️ VOLVER</button>
        </div>
    `;

    setTimeout(renderizarStatsAsistencia, 100);
}

function renderizarStatsAsistencia() {
    const render = document.getElementById('stats-render');
    if (!render) return;

    const alumnos = window.db.Alumnos || [];
    const actividades = window.db.Actividades || [];
    const mes = window.mesFiltroActual;

    let html = `
        <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size: 0.9rem;">
            <thead>
                <tr style="background:#f1f5f9;">
                    <th style="padding:10px; border:1px solid #ddd; text-align:left;">ACTIVIDADE</th>
                    <th style="padding:10px; border:1px solid #ddd;">ALUMNOS</th>
                    <th style="padding:10px; border:1px solid #ddd;">ASISTENCIA (%)</th>
                </tr>
            </thead>
            <tbody>
    `;

    actividades.forEach(act => {
        const inscritos = alumnos.filter(al => al.act === act.nome && (al.status || al.estado || "").toLowerCase().includes("admiti"));
        if (inscritos.length > 0) {
            html += `
                <tr>
                    <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">${act.nome}</td>
                    <td style="padding:10px; border:1px solid #ddd; text-align:center;">${inscritos.length}</td>
                    <td style="padding:10px; border:1px solid #ddd; text-align:center;">-</td>
                </tr>
            `;
        }
    });

    html += `</tbody></table>`;
    render.innerHTML = html;
}

// Sobrescribimos mostrarDatos para que salgan los dos cajones en Configuración
function mostrarDatos() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    if (!container || !actions) return;

    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase;">⚙️ CONFIGURACIÓN DO SISTEMA</h2>`;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.style.padding = "20px";

    container.innerHTML = `
        <div style="background:white; color:black; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align:center; box-sizing: border-box;">
            <h3 style="margin-top:0; color:#005696;">COPIAS DE SEGURIDADE</h3>
            <button onclick="exportarDatosJSON()" style="width:100%; padding:15px; background:#005696; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; margin-bottom:10px;">📥 DESCARGAR COPIA (JSON)</button>
            <div style="margin:15px 0; border-top:1px solid #eee; padding-top:15px;">
                <input type="file" id="importFile" onchange="importarDatosJSON(event)" style="font-size:0.8rem; width:100%;">
            </div>
            <button onclick="borrarTodaLaBD()" style="width:100%; background:#ef4444; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer; font-size:0.85rem;">⚠️ BORRAR TODO</button>
        </div>

        <div style="background:white; color:black; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align:center; box-sizing: border-box;">
            <h3 style="margin-top:0; color:#005696;">ESTADÍSTICAS</h3>
            <p style="font-size:0.9rem; color:#64748b; margin-bottom:20px;">Consulta o rendemento e a asistencia das actividades.</p>
            <button onclick="verPanelEstadisticas()" style="width:100%; padding:15px; background:#f59e0b; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">📊 VER ESTADÍSTICAS</button>
        </div>
    `;
}