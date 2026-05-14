// ==========================================
// MÓDULO: VISTAS Y ESTADÍSTICAS (vistas.js)
// ==========================================

function mostrarConfiguracion() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    if (!container || !actions) return;

    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase;">⚙️ CONFIGURACIÓN DO SISTEMA</h2>`;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.innerHTML = `
        <div onclick="verPanelEstadisticas()" style="background:white; padding:30px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2); transition:transform 0.2s;">
            <div style="font-size:4rem; margin-bottom:15px;">📊</div>
            <h3 style="color:#005696; margin:0; font-size:1.5rem;">ESTADÍSTICAS</h3>
            <p style="color:#64748b;">Consulta de asistencia e participación mensual.</p>
        </div>

        <div onclick="mostrarGestionDatos()" style="background:white; padding:30px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2); transition:transform 0.2s;">
            <div style="font-size:4rem; margin-bottom:15px;">💾</div>
            <h3 style="color:#005696; margin:0; font-size:1.5rem;">DATOS</h3>
            <p style="color:#64748b;">Copias de seguridade e importación JSON.</p>
        </div>
    `;
}

function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    actions.innerHTML = `<h2 style="color:white; margin:0;">📊 ESTADÍSTICAS DE ASISTENCIA</h2>`;
    
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; color:black; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <div style="margin-bottom:20px; display:flex; gap:15px; align-items:center; justify-content:center;">
                <label style="font-weight:bold;">Seleccionar Mes:</label>
                <input type="month" id="mes-stats" value="${window.mesFiltroActual || new Date().toISOString().substring(0, 7)}" onchange="window.mesFiltroActual=this.value; verPanelEstadisticas()" style="padding:10px; border-radius:10px; border:1px solid #ddd;">
            </div>
            <div id="stats-render">Calculando...</div>
            <button onclick="mostrarConfiguracion()" style="margin-top:20px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">⬅️ VOLVER</button>
        </div>
    `;

    setTimeout(renderizarStats, 100);
}

function renderizarStats() {
    const div = document.getElementById('stats-render');
    if (!div) return;

    const mes = window.mesFiltroActual || new Date().toISOString().substring(0, 7);
    const alumnos = window.db.Alumnos || [];
    let stats = {};

    alumnos.forEach(al => {
        if (!al.act) return;
        if (!stats[al.act]) stats[al.act] = { totales: 0, presentes: 0 };
        
        stats[al.act].totales++;
        
        if (al.asistencias) {
            Object.keys(al.asistencias).forEach(fecha => {
                if (fecha.startsWith(mes) && al.asistencias[fecha] === true) {
                    stats[al.act].presentes++;
                }
            });
        }
    });

    if (Object.keys(stats).length === 0) {
        div.innerHTML = "<p style='text-align:center;'>Non hai datos para este mes.</p>";
        return;
    }

    let html = `
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
                <tr style="background:#f1f5f9;">
                    <th style="padding:10px; border:1px solid #ddd; text-align:left;">ACTIVIDADE</th>
                    <th style="padding:10px; border:1px solid #ddd;">ALUMNOS</th>
                    <th style="padding:10px; border:1px solid #ddd;">ASISTENCIA (%)</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.keys(stats).forEach(act => {
        const porc = stats[act].totales > 0 ? ((stats[act].presentes / stats[act].totales) * 100).toFixed(0) : 0;
        html += `
            <tr>
                <td style="padding:10px; border:1px solid #ddd; font-weight:bold;">${act}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">${stats[act].totales}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">
                    <div style="background:#e2e8f0; border-radius:10px; height:20px; width:100%; position:relative;">
                        <div style="background:#005696; height:100%; border-radius:10px; width:${porc}%;"></div>
                        <span style="position:absolute; top:0; left:50%; transform:translateX(-50%); font-size:0.7rem; color:${porc > 50 ? 'white' : 'black'}; font-weight:bold;">${porc}%</span>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    div.innerHTML = html;
}

// Vinculamos la función de Datos que estaba en datos.js para que el cajón funcione
function mostrarGestionDatos() {
    if (typeof mostrarDatos === 'function') {
        mostrarDatos();
    } else {
        alert("Erro: O módulo de datos non está cargado.");
    }
}