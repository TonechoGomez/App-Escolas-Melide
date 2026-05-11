// ==========================================
// MÓDULO: CONFIGURACIÓN E DATOS (datos.js)
// ==========================================

// Variable global para mantener el filtro de mes actual (por defecto el mes actual)
window.mesFiltroActual = new Date().toISOString().substring(0, 7); // Formato "YYYY-MM"

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
        <div onclick="verPanelEstadisticas()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2); transition: transform 0.2s;">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">📊</span>
            <div style="font-weight:900; font-size:1.5rem;">ESTADÍSTICAS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Ocupación xeral e por actividade</div>
        </div>

        <div onclick="verPanelDatos()" style="background:white; color:#005696; padding:50px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 25px rgba(0,0,0,0.2); transition: transform 0.2s;">
            <span style="font-size: 4.5rem; display:block; margin-bottom:15px;">💾</span>
            <div style="font-weight:900; font-size:1.5rem;">DATOS</div>
            <div style="font-size:0.9rem; color:#64748b; margin-top:5px;">Gardar, exportar e importar copias</div>
        </div>
    `;
}

function mostrarConfiguracion() {
    mostrarDatos();
}

/**
 * PANEL INTERNO: ESTADÍSTICAS
 * Incluye selector de mes y filtrado dinámico de datos reales.
 */
function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actividades = window.db.Actividades || [];
    const alumnos = window.db.Alumnos || [];

    // --- FILTRADO POR MES ---
    let sumaTotalPosibles = 0;
    let sumaTotalAsistidos = 0;

    alumnos.forEach(al => {
        if (al.asistencias) {
            Object.keys(al.asistencias).forEach(fecha => {
                // Comprobamos si la fecha empieza por el año-mes seleccionado (YYYY-MM)
                if (fecha.startsWith(window.mesFiltroActual)) {
                    sumaTotalPosibles++;
                    if (al.asistencias[fecha] === true) sumaTotalAsistidos++;
                }
            });
        }
    });

    const porcenGeneral = sumaTotalPosibles > 0 ? Math.round((sumaTotalAsistidos / sumaTotalPosibles) * 100) : 0;

    container.style.display = "block";
    
    // --- GENERAR GRÁFICAS POR ACTIVIDAD ---
    let htmlGraficasActividad = "";
    if (actividades.length === 0) {
        htmlGraficasActividad = `<p style="color:#94a3b8; text-align:center; font-style:italic; padding:20px;">Non hai actividades para analizar.</p>`;
    } else {
        htmlGraficasActividad = actividades.map(act => {
            const alumnosDeAct = alumnos.filter(al => al.act === act.nome || al.actividad === act.nome);
            let actPosibles = 0;
            let actAsistidos = 0;

            alumnosDeAct.forEach(al => {
                if (al.asistencias) {
                    Object.keys(al.asistencias).forEach(fecha => {
                        if (fecha.startsWith(window.mesFiltroActual)) {
                            actPosibles++;
                            if (al.asistencias[fecha] === true) actAsistidos++;
                        }
                    });
                }
            });

            const p = actPosibles > 0 ? Math.round((actAsistidos / actPosibles) * 100) : 0;
            const colorBarra = p === 0 ? "#cbd5e1" : (p < 50 ? "#ef4444" : (p < 85 ? "#f59e0b" : "#10b981"));

            return `
                <div style="margin-bottom: 25px; padding-bottom: 10px; border-bottom: 1px solid #f8fafc;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-size:1rem; font-weight:bold; color:#1e293b;">${act.nome.toUpperCase()}</span>
                        <div>
                            <span style="font-size:0.8rem; color:#94a3b8; margin-right:10px;">(${actAsistidos}/${actPosibles})</span>
                            <span style="font-size:1rem; font-weight:bold; color:${p === 0 ? '#94a3b8' : colorBarra}">${p}%</span>
                        </div>
                    </div>
                    <div style="width:100%; background:#f1f5f9; height:12px; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                        <div style="width:${p}%; background:${colorBarra}; height:100%; transition: width 0.5s ease;"></div>
                    </div>
                </div>`;
        }).join('');
    }

    container.innerHTML = `
        <div style="max-width:1000px; margin: 0 auto 25px auto; background:#005696; padding:15px; border-radius:15px; display:flex; align-items:center; justify-content:center; gap:15px; color:white;">
            <span style="font-weight:bold; font-size:0.9rem;">FILTRAR POR MES:</span>
            <input type="month" id="input-mes-stats" value="${window.mesFiltroActual}" 
                onchange="window.mesFiltroActual = this.value; verPanelEstadisticas();"
                style="padding:8px 15px; border-radius:10px; border:none; font-family:inherit; font-weight:bold; cursor:pointer;">
        </div>

        <div style="max-width:1000px; margin:auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap:25px;">
            
            <div style="background:white; padding:30px; border-radius:25px; border:1px solid #e2e8f0; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 20px 0; color:#64748b; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Asistencia Total (${window.mesFiltroActual})</h3>
                
                <div style="position:relative; width:180px; height:180px; margin:0 auto 20px auto; display:flex; align-items:center; justify-content:center;">
                    <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" stroke-width="3" />
                        <path stroke-dasharray="${porcenGeneral}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#005696" stroke-width="3" stroke-linecap="round" style="transition: stroke-dasharray 0.8s ease;" />
                    </svg>
                    <div style="position:absolute; font-size:2.5rem; font-weight:900; color:#005696;">${porcenGeneral}%</div>
                </div>
                <p style="margin:0; color:#94a3b8; font-size:0.85rem;">Datos baseados en ${sumaTotalPosibles} rexistros totais</p>
            </div>
            
            <div style="background:white; padding:30px; border-radius:25px; border:1px solid #e2e8f0; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
                <h3 style="margin:0 0 20px 0; color:#64748b; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; text-align:center;">Detalle do Mes</h3>
                <div style="max-height:400px; overflow-y:auto; padding-right:10px;">
                    ${htmlGraficasActividad}
                </div>
            </div>

        </div>
        <button onclick="mostrarDatos()" style="width:100%; max-width:1000px; display:block; margin:25px auto; padding:15px; background:#475569; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer;">⬅️ VOLVER</button>
    `;
}

/**
 * PANEL INTERNO: DATOS
 */
function verPanelDatos() {
    const container = document.getElementById('data-container');
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; padding:40px; border-radius:25px; box-shadow:0 10px 30px rgba(0,0,0,0.1); max-width:500px; margin:auto;">
            <h3 style="margin:0 0 25px 0; color:#1e293b; text-align:center; font-size:1.4rem;">XESTIÓN DE DATOS</h3>
            
            <div style="display:flex; flex-direction:column; gap:15px;">
                <button onclick="exportarDatosJSON()" style="padding:20px; background:#16a34a; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer; font-size:1rem;">📥 GARDAR COPIA SEGURIDADE (JSON)</button>
                
                <div style="border:2px dashed #cbd5e1; padding:20px; border-radius:15px; text-align:center; background:#f8fafc;">
                    <p style="margin:0 0 10px 0; font-weight:bold; color:#64748b; font-size:0.85rem;">IMPORTAR COPIA ANTERIOR</p>
                    <input type="file" id="file-import-json" style="font-size:0.8rem;" onchange="importarDatosJSON(event)">
                </div>

                <button onclick="borrarTodaLaBD()" style="padding:15px; background:#ef4444; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer; font-size:0.85rem; margin-top:10px;">⚠️ BORRAR TODA A BASE DE DATOS</button>
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
            if (confirm("Isto sobrescribirá todos os datos. Continuar?")) {
                window.db = data;
                if (typeof saveData === 'function') saveData();
                location.reload();
            }
        } catch (err) { alert("Archivo non válido."); }
    };
    reader.readAsText(event.target.files[0]);
}

function borrarTodaLaBD() {
    if (confirm("¿ELIMINAR TODO? Esta acción é definitiva.")) {
        window.db = { Monitores: [], Actividades: [], Aulas: [], Alumnos: [] };
        if (typeof saveData === 'function') saveData();
        location.reload();
    }
}