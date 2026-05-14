// --- CONFIGURACIÓN E BASE DE DATOS ---

if (!window.db) {
    window.db = JSON.parse(localStorage.getItem('melide_db')) || { 
        Monitores: [], Actividades: [], Aulas: [], Alumnos: [] 
    };
}

window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR675_Y42K8pB8GzB9I_vI_RkZ_N4Fh9D0kR/exec";

function saveData() {
    localStorage.setItem('melide_db', JSON.stringify(window.db));
    if (typeof enviarDatosAWebApp === 'function') {
        enviarDatosAWebApp();
    }
}

function repairDB() {
    if (!window.db) window.db = {};
    if (!window.db.Monitores) window.db.Monitores = [];
    if (!window.db.Actividades) window.db.Actividades = [];
    if (!window.db.Aulas) window.db.Aulas = [];
    if (!window.db.Alumnos) window.db.Alumnos = [];
}
repairDB();

// --- FUNCIÓNS DE VISTA ---

function mostrarDatos() {
    const actions = document.getElementById('section-actions');
    const container = document.getElementById('data-container');
    if (!actions || !container) return;

    actions.innerHTML = `<h2 style="color:white; margin:0; text-transform: uppercase;">⚙️ CONFIGURACIÓN</h2>`;
    container.innerHTML = `
        <div style="grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div onclick="exportarJSON()" style="background:white; color:#005696; padding:40px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2);">
                <span style="font-size:3.5rem; display:block; margin-bottom:10px;">📥</span>
                <div style="font-weight:bold; font-size:1.2rem;">EXPORTAR JSON</div>
            </div>
            <div onclick="document.getElementById('import-input').click()" style="background:white; color:#005696; padding:40px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2);">
                <span style="font-size:3.5rem; display:block; margin-bottom:10px;">📤</span>
                <div style="font-weight:bold; font-size:1.2rem;">IMPORTAR JSON</div>
                <input type="file" id="import-input" style="display:none" onchange="importarJSON(event)">
            </div>
            <div onclick="borrarTodo()" style="background:#fee2e2; color:#dc2626; padding:40px 20px; border-radius:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.1);">
                <span style="font-size:3.5rem; display:block; margin-bottom:10px;">⚠️</span>
                <div style="font-weight:bold; font-size:1.2rem;">BORRAR TODO</div>
            </div>
        </div>
    `;
}

function exportarJSON() {
    const blob = new Blob([JSON.stringify(window.db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `melide_deportes_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function importarJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (confirm("Isto sobrescribirá todos os datos. Continuar?")) {
                window.db = data;
                saveData();
                location.reload();
            }
        } catch (err) { alert("Archivo non válido"); }
    };
    reader.readAsText(file);
}

function borrarTodo() {
    if (confirm("¿ESTÁS SEGURO? Eliminarás permanentemente todos los datos.")) {
        localStorage.clear();
        location.reload();
    }
}