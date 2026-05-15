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
        <div onclick="verPanelEstadisticas()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2); transition: transform 0.2s;">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">📊</span>
            <div style="font-weight:900; font-size:1.5rem;">ESTADÍSTICAS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Gráficas de rendemento e asistencia</div>
        </div>

        <div onclick="verPanelDatos()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2); transition: transform 0.2s;">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">💾</span>
            <div style="font-weight:900; font-size:1.5rem;">DATOS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Gardar, exportar e importar copias</div>
        </div>
    `;
}

function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actividades = window.db.Actividades || [];
    const alumnos = window.db.Alumnos || [];

    let sumaTotalPosibles = 0;
    let sumaTotalAsistidos = 0;

    alumnos.forEach(al => {
        if (al.asistencias) {
            Object.keys(al.asistencias).forEach(fecha => {
                if (fecha.startsWith(window.mesFiltroActual)) {
                    sumaTotalPosibles++;
                    if (al.asistencias[fecha] === true) sumaTotalAsistidos++;
                }
            });
        }
    });

    const porcenGeneral = sumaTotalPosibles > 0 ? Math.round((sumaTotalAsistidos / sumaTotalPosibles) * 100) : 0;
    const dashArray = `${porcenGeneral}, 100`;

    // Configuración Gráfica de Línea
    const anchoSvg = 300;
    const altoSvg = 120;
    let puntosLinea = "";
    let etiquetasX = "";

    if (actividades.length > 0) {
        const pasoX = anchoSvg / (actividades.length > 1 ? actividades.length - 1 : 1);
        actividades.forEach((act, i) => {
            const alumnosDeAct = alumnos.filter(al => (al.act || al.actividad) === act.nome);
            let actPos = 0, actAsis = 0;
            alumnosDeAct.forEach(al => {
                if (al.asistencias) {
                    Object.keys(al.asistencias).forEach(f => {
                        if (f.startsWith(window.mesFiltroActual)) {
                            actPos++; if (al.asistencias[f] === true) actAsis++;
                        }
                    });
                }
            });
            const p = actPos > 0 ? Math.round((actAsis / actPos) * 100) : 0;
            const x = i * pasoX;
            const y = altoSvg - (p * (altoSvg / 100));
            puntosLinea += `${x},${y} `;
            etiquetasX += `<text x="${x}" y="${altoSvg + 20}" font-size="9" text-anchor="middle" fill="#64748b" font-weight="bold">${act.nome.substring(0,3).toUpperCase()}</text>`;
        });
    } else {
        puntosLinea = `0,${altoSvg} ${anchoSvg},${altoSvg}`;
        etiquetasX = `<text x="${anchoSvg/2}" y="${altoSvg + 20}" font-size="10" text-anchor="middle" fill="#94a3b8">Sen actividades rexistradas</text>`;
    }

    container.style.display = "block";
    container.innerHTML = `
        <div style="max-width:1000px; margin: 0 auto 25px auto; background:#005696; padding:15px; border-radius:15px; display:flex; align-items:center; justify-content:center; gap:15px; color:white;">
            <span style="font-weight:bold; font-size:0.9rem;">FILTRAR MES:</span>
            <input type="month" id="input-mes-stats" value="${window.mesFiltroActual}" 
                onchange="window.mesFiltroActual = this.value; verPanelEstadisticas();"
                style="padding:10px; border-radius:10px; border:none; font-family:inherit; font-weight:bold;">
        </div>

        <div style="max-width:1000px; margin:auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:25px;">
            
            <div style="background:white; padding:35px; border-radius:30px; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
                <h3 style="margin:0 0 25px 0; color:#64748b; font-size:0.9rem; text-transform:uppercase; font-weight:900;">Asistencia Total</h3>
                <div style="position:relative; width:180px; height:180px; margin:0 auto;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" stroke-width="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#005696" stroke-width="3" stroke-dasharray="${dashArray}" stroke-linecap="round" style="transition: stroke-dasharray 0.5s;" />
                    </svg>
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:2.5rem; font-weight:900; color:#005696;">${porcenGeneral}%</div>
                </div>
            </div>
            
            <div style="background:white; padding:35px; border-radius:30px; box-shadow:0 10px 20px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
                <h3 style="margin:0 0 25px 0; color:#64748b; font-size:0.9rem; text-transform:uppercase; font-weight:900; text-align:center;">Asistencia por Actividade</h3>
                <div style="padding:10px 0;">
                    <svg viewBox="-10 -10 ${anchoSvg + 20} ${altoSvg + 40}" style="width:100%; height:auto; overflow:visible;">
                        <line x1="0" y1="0" x2="0" y2="${altoSvg}" stroke="#cbd5e1" stroke-width="1" />
                        <line x1="0" y1="${altoSvg}" x2="${anchoSvg}" y2="${altoSvg}" stroke="#cbd5e1" stroke-width="1" />
                        <polyline fill="none" stroke="#005696" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="${puntosLinea}" style="transition: points 0.5s;" />
                        ${etiquetasX}
                    </svg>
                </div>
                <p style="text-align:center; font-size:0.8rem; color:#94a3b8; margin-top:15px; font-weight:bold;">Progreso do 0% ao 100%</p>
            </div>

        </div>
        <button onclick="mostrarDatos()" style="width:100%; max-width:1000px; display:block; margin:30px auto; padding:18px; background:#475569; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer;">⬅️ VOLVER Á CONFIGURACIÓN</button>
    `;
}

function verPanelDatos() {
    const container = document.getElementById('data-container');
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; padding:40px; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); max-width:500px; margin:auto;">
            <h3 style="margin:0 0 25px 0; color:#1e293b; text-align:center; font-size:1.4rem;">XESTIÓN DE DATOS</h3>
            <div style="display:flex; flex-direction:column; gap:15px;">
                <button onclick="exportarDatosJSON()" style="padding:20px; background:#16a34a; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer;">📥 GARDAR COPIA SEGURIDADE</button>
                <div style="border:2px dashed #cbd5e1; padding:20px; border-radius:15px; text-align:center; background:#f8fafc;">
                    <input type="file" id="file-import-json" style="font-size:0.8rem;" onchange="importarDatosJSON(event)">
                </div>
                <button onclick="borrarTodaLaBD()" style="padding:15px; background:#ef4444; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer;">⚠️ BORRAR TODO</button>
            </div>
            <button onclick="mostrarDatos()" style="margin-top:30px; width:100%; padding:15px; background:#475569; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">⬅️ VOLVER</button>
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
            if (confirm("Sobrescribir datos?")) {
                window.db = data;
                saveData();
                location.reload();
            }
        } catch (err) { alert("Archivo non válido."); }
    };
    reader.readAsText(event.target.files[0]);
}

function borrarTodaLaBD() {
    if (confirm("¿ELIMINAR TODO?")) {
        window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
        saveData();
        location.reload();
    }
}