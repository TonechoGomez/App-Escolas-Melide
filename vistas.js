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

// Vinculamos la función de Datos que estaba en datos.js para que el cajón funcione
function mostrarGestionDatos() {
    if (typeof mostrarDatos === 'function') {
        mostrarDatos();
    } else {
        alert("Erro: O módulo de datos non está cargado.");
    }
}