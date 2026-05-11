// ==========================================
// MÓDULO: CONFIGURACIÓN E ESTADÍSTICAS (datos.js)
// ==========================================


// --- PANEL DE ESTADÍSTICAS ---
function verPanelEstadisticas() {
    const container = document.getElementById('data-container');
    const actividades = window.db.Actividades || [];
    const alumnos = window.db.Alumnos || [];

    // Cálculo de porcentaje general (Inscritos vs Plazas totales)
    let totalPlazas = 0;
    let totalInscritos = alumnos.length;
    actividades.forEach(a => totalPlazas += (parseInt(a.plazas) || 0));
    const porcenGeneral = totalPlazas > 0 ? Math.round((totalInscritos / totalPlazas) * 100) : 0;

    container.style.display = "block";
    container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div style="background:#f8fafc; padding:30px; border-radius:15px; border:1px solid #e2e8f0; text-align:center;">
                <h3 style="margin:0; color:#64748b; font-size:0.9rem; text-transform:uppercase;">Asistencia Xeral</h3>
                <div style="font-size:4.5rem; font-weight:900; color:#005696; margin:10px 0;">${porcenGeneral}%</div>
                <div style="font-size:0.8rem; color:#94a3b8;">Baseado en prazas totais ocupadas</div>
            </div>

            <div style="background:white; padding:20px; border-radius:15px; border:1px solid #e2e8f0; max-height:400px; overflow-y:auto;">
                <h3 style="margin:0 0 15px 0; color:#64748b; font-size:0.9rem; text-transform:uppercase; text-align:center;">Por Actividade</h3>
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                    ${actividades.map(act => {
                        const inscritosAct = alumnos.filter(al => al.actividad === act.nome).length;
                        const plazasAct = parseInt(act.plazas) || 0;
                        const pAct = plazasAct > 0 ? Math.round((inscritosAct / plazasAct) * 100) : 0;
                        return `
                            <tr style="border-bottom:1px solid #f1f5f9;">
                                <td style="padding:10px 5px; font-weight:bold; color:#1e293b;">${act.nome}</td>
                                <td style="padding:10px 5px; text-align:right; color:#005696; font-weight:900;">${pAct}%</td>
                            </tr>
                        `;
                    }).join('')}
                </table>
            </div>
        </div>
        <button onclick="mostrarConfiguracion()" style="margin-top:20px; width:100%; padding:12px; background:#475569; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">VOLVER</button>
    `;
}

// --- PANEL DE DATOS ---
function verPanelDatos() {
    const container = document.getElementById('data-container');
    container.style.display = "block";
    container.innerHTML = `
        <div style="background:white; padding:30px; border-radius:20px; box-shadow:0 4px 15px rgba(0,0,0,0.1); max-width:600px; margin:auto;">
            <h3 style="margin-top:0; color:#1e293b; border-bottom:2px solid #f1f5f9; padding-bottom:10px;">Xestión de Copias de Seguridade</h3>
            
            <div style="display:grid; grid-template-columns: 1fr; gap:15px; margin-top:20px;">
                <button onclick="exportarDatosJSON()" style="padding:15px; background:#16a34a; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">📥 EXPORTAR COPIA (JSON)</button>
                
                <div style="border:2px dashed #cbd5e1; padding:20px; border-radius:12px; text-align:center;">
                    <p style="margin:0 0 10px 0; font-weight:bold; color:#64748b;">IMPORTAR COPIA</p>
                    <input type="file" id="input-import" style="font-size:0.8rem; margin-bottom:10px;" onchange="importarDatosJSON(event)">
                </div>

                <button onclick="borrarTodaLaBD()" style="padding:15px; background:#ef4444; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px;">⚠️ BORRAR TODA A BASE DE DATOS</button>
            </div>

            <button onclick="mostrarConfiguracion()" style="margin-top:30px; width:100%; padding:12px; background:#475569; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">VOLVER</button>
        </div>
    `;
}

function exportarDatosJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "licitacion_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importarDatosJSON(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importado = JSON.parse(e.target.result);
            if (confirm("Isto sobrescribirá todos os datos actuais. Continuar?")) {
                window.db = importado;
                guardarDB();
                alert("Datos restaurados correctamente.");
                location.reload();
            }
        } catch (err) { alert("Erro ao ler o arquivo JSON."); }
    };
    reader.readAsText(event.target.files[0]);
}

function borrarTodaLaBD() {
    if (confirm("¿ESTÁS SEGURO? Perderás todos os monitores, actividades e alumnos.")) {
        window.db = { Centros: [], Aulas: [], Monitores: [], Actividades: [], Alumnos: [], Material: [] };
        guardarDB();
        location.reload();
    }
}
