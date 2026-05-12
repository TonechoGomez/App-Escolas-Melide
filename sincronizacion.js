// --- MÓDULO DE SINCRONIZACIÓN CON LA NUBE (GOOGLE SHEETS) ---

/**
 * AUTO-CARGA: Esta función se ejecuta sola al cargar el archivo.
 * Descarga los datos más recientes de la nube y los guarda en el navegador.
 */
(function descargarDatosAlInicio() {
    // Si no hay URL configurada, no hace nada
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) return;

    console.log("Intentando sincronizar con la nube...");

    fetch(window.SCRIPT_URL)
        .then(response => response.json())
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object') {
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("Sincronización inicial con éxito: Datos actualizados.");
                
                // Si la pantalla actual necesita refrescarse al recibir datos, podrías llamar a una función aquí.
                // Por ejemplo: if(typeof renderizarListaActividades === 'function') renderizarListaActividades();
            }
        })
        .catch(err => console.warn("Modo offline: Non se puido conectar coa nube. Usando datos locais."));
})();

/**
 * Envía la base de datos completa a la Web App de Google.
 * Esta función es llamada automáticamente por saveData() en datos.js
 */
function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL || window.SCRIPT_URL.includes("TU_URL_AQUI")) {
        console.warn("Sincronización desactivada: Falta a URL de Google Script.");
        return;
    }

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    // Enviamos los datos de forma silenciosa
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("Copia de seguridade enviada á nube."))
    .catch(err => console.error("Erro na sincronización remota:", err));
}

/**
 * Función para el botón azul de la sección de Configuración
 */
function mostrarConfiguracion() {
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');
    
    if (!actions || !container) return;

    actions.innerHTML = `<h2 style="color:white; margin:0;">☁️ SINCRONIZACIÓN NUBE</h2>`;
    
    container.style.display = "block"; 
    container.innerHTML = `
        <div style="background:white; color:#1e293b; padding:30px; border-radius:20px; max-width:500px; margin:20px auto; box-shadow:0 10px 25px rgba(0,0,0,0.3); text-align:center;">
            <h3 style="color:#005696; margin-top:0;">Estado da Conexión</h3>
            <p style="font-size:0.9rem; color:#64748b; margin-bottom:20px;">Os datos gárdanse solos ao facer cambios, pero podes forzar unha subida manual se o necesitas.</p>
            
            <button onclick="forzarSincro()" style="width:100%; background:#0284c7; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; font-size:1.1rem; margin-bottom:10px;">☁️ SUBIR Á NUBE AGORA</button>
            
            <button onclick="mostrarDatos()" style="width:100%; background:#475569; color:white; padding:10px; border:none; border-radius:12px; cursor:pointer; font-weight:bold;">⬅️ VOLVER Á CONFIGURACIÓN</button>

            <div style="border-top:1px solid #eee; padding-top:20px; margin-top:20px;">
                <p style="font-size:0.75rem; color:#94a3b8;">Última comunicación: ${new Date().toLocaleTimeString()}</p>
            </div>
        </div>
    `;
}

function forzarSincro() {
    alert("Subindo datos a Google Sheets...");
    enviarDatosAWebApp();
}