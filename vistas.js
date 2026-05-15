// ==========================================
// MÓDULO: VISTAS Y ESTADÍSTICAS (vistas.js)
// ==========================================

function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    if (!container || !actions) return;

    actions.innerHTML = `<h2 style="color:white; margin:0;">📊 ESTADÍSTICAS DE ASISTENCIA</h2>`;
    
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; color:black; padding:25px; border-radius:20px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <div style="margin-bottom:20px; display:flex; gap:15px; align-items:center; justify-content:center;">
                <label style="font-weight:bold;">Seleccionar Mes:</label>
                <input type="month" id="mes-stats" value="${window.mesFiltroActual}" onchange="window.mesFiltroActual=this.value; verPanelEstadisticas()" style="padding:10px; border-radius:10px; border:1px solid #ddd;">
            </div>
            <div id="stats-render">Calculando...</div>
            <button onclick="mostrarConfiguracion()" style="margin-top:20px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">⬅️ VOLVER</button>
        </div>
    `;
    
    renderizarTablaStats();
}

function renderizarTablaStats() {
    const render = document.getElementById('stats-render');
    const mes = window.mesFiltroActual;
    const alumnos = window.db.Alumnos || [];
    
    if (alumnos.length === 0) {
        render.innerHTML = "<p style='text-align:center;'>Non hai alumnos rexistrados.</p>";
        return;
    }

    // Agrupar estadísticas por actividad
    const stats = {};
    alumnos.forEach(al => {
        const act = al.act || "SEN ACTIVIDADE";
        if (!stats[act]) stats[act] = { totales: 0, presentes: 0 };
        
        const asistencias = al.asistencias || {};
        let asistio = false;
        
        Object.keys(asistencias).forEach(fecha => {
            if (fecha.startsWith(mes) && asistencias[fecha] === true) {
                asistio = true;
            }
        });

        stats[act].totales++;
        if (asistio) stats[act].presentes++;
    });

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
        const porc = ((stats[act].presentes / stats[act].totales) * 100).toFixed(0);
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
    render.innerHTML = html;
}