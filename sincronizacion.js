// --- MÓDULO DE SINCRONIZACIÓN INTELIXENTE (sincronizacion.js) ---

(function descargarDatosAlInicio() {
    if (!window.SCRIPT_URL) return;

    console.log("🔄 Conectando coa nube de Google...");

    fetch(window.SCRIPT_URL)
        .then(response => {
            if (!response.ok) throw new Error("Erro na rede");
            return response.json();
        })
        .then(datosNube => {
            if (datosNube && typeof datosNube === 'object' && Object.keys(datosNube).length > 0) {
                window.db = datosNube;
                localStorage.setItem('melide_db', JSON.stringify(window.db));
                console.log("✅ Sincronización inicial completada: " + (window.db.Alumnos ? window.db.Alumnos.length : 0) + " alumnos cargados.");
                
                // Se o usuario xa pasou o PIN, refrescamos a vista para que vexa os datos
                if (document.getElementById('scr-dash').style.display === 'block') {
                    if (typeof inicializarApp === 'function') inicializarApp();
                    else if (typeof atras === 'function') atras(); // Truco para repintar
                }
            }
        })
        .catch(err => {
            console.warn("⚠️ Modo offline ou erro de conexión. Retentando en 5 segundos...");
            setTimeout(descargarDatosAlInicio, 5000); // Reintento automático
        });
})();

function enviarDatosAWebApp() {
    if (!window.SCRIPT_URL) return;

    const datos = {
        action: "updateDB",
        db: window.db,
        user: window.userRole || "sistema",
        fecha: new Date().toLocaleString()
    };

    // Usamos text/plain para evitar bloqueos de CORS en dispositivos móbiles
    fetch(window.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(datos)
    })
    .then(() => console.log("💾 Copia de seguridade enviada á nube."))
    .catch(err => console.error("❌ Erro ao sincronizar:", err));
}