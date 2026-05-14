// ==========================================
// MÓDULO: INSTALACIONES (instalaciones.js)
// ==========================================

function mostrarAulas() {
    const actions = document.getElementById('section-actions');
    const container = document.getElementById('data-container');
    if (!actions || !container) return;

    actions.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:20px;">
            <h2 style="margin:0; color:white; font-size:1.4rem;">INSTALACIÓNS</h2>
            <button onclick="formAula()" style="background:#16a34a; color:white; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ NOVA INSTALACIÓN</button>
        </div>
    `;
    
    if (!window.db.Aulas) window.db.Aulas = [];
    
    // Asegurar que existe el contenedor de Parroquias
    let tieneParroquias = window.db.Aulas.find(a => a.nome.toUpperCase() === "PARROQUIAS");
    if (!tieneParroquias) {
        window.db.Aulas.push({ nome: "PARROQUIAS", lugares: [] });
    }

    window.db.Aulas.sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    
    renderListaAulas(window.db.Aulas);
}

function renderListaAulas(lista) {
    const container = document.getElementById('data-container');
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
    container.style.gap = "20px";

    lista.forEach((aula, idx) => {
        const card = document.createElement('div');
        // Estética original de ordenador: Tarjetas blancas grandes con sombra
        card.style.cssText = "background:white; color:#1e293b; padding:30px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.2); position:relative;";
        
        const esParroquias = aula.nome.toUpperCase() === "PARROQUIAS";
        const icono = esParroquias ? "📍" : "🏛️";
        const subInfo = esParroquias ? `<div style="font-size:0.8rem; color:#64748b; margin-top:5px;">${(aula.lugares || []).length} LOCALIZACIÓNS</div>` : "";

        card.innerHTML = `
            <span style="font-size:3.5rem; display:block; margin-bottom:10px;">${icono}</span>
            <div style="font-weight:800; text-transform:uppercase; font-size:1.1rem; color:#005696;">${aula.nome}</div>
            ${subInfo}
            <button onclick="event.stopPropagation(); borrarAula(${idx})" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#ef4444; font-size:1.5rem; cursor:pointer; font-weight:bold;">&times;</button>
        `;
        
        // Al pulsar, si es Parroquias entra al detalle; si no, no hace nada (o lo que tuviera definido)
        card.onclick = () => {
            if (esParroquias) verDetalleParroquias(idx);
        };
        container.appendChild(card);
    });
}

function verDetalleParroquias(idxAula) {
    const aula = window.db.Aulas[idxAula];
    const container = document.getElementById('data-container');
    const actions = document.getElementById('section-actions');

    actions.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="margin:0; color:white;">📍 LOCALIZACIÓNS</h2>
            <div style="display:flex; gap:10px;">
                <button onclick="formLugar(${idxAula})" style="background:#f59e0b; color:white; padding:10px 15px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ ENGADIR LUGAR</button>
                <button onclick="mostrarAulas()" style="background:#64748b; color:white; padding:10px 15px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">VOLVER</button>
            </div>
        </div>
    `;

    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    if (!aula.lugares || aula.lugares.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:white; padding:40px;">Non hai lugares rexistrados en Parroquias.</div>`;
    } else {
        aula.lugares.forEach((lugar, idxLugar) => {
            const item = document.createElement('div');
            item.style.cssText = "background:white; color:#334155; padding:15px 20px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; box-shadow:0 4px 6px rgba(0,0,0,0.1);";
            item.innerHTML = `
                <span style="text-transform:uppercase;">${lugar}</span>
                <button onclick="borrarLugar(${idxAula}, ${idxLugar})" style="background:#ef4444; color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold;">&times;</button>
            `;
            container.appendChild(item);
        });
    }
}

function formLugar(idxAula) {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="padding:20px;">
            <h3 style="color:#005696; margin-top:0;">Novo lugar en Parroquias</h3>
            <input type="text" id="new-lugar" placeholder="EX: SAN MARTIÑO" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; text-transform:uppercase; box-sizing:border-box; margin-bottom:15px;">
            <button onclick="guardarLugar(${idxAula})" style="width:100%; background:#16a34a; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">GARDAR</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function guardarLugar(idxAula) {
    const nome = document.getElementById('new-lugar').value.trim().toUpperCase();
    if (!nome) return;
    if (!window.db.Aulas[idxAula].lugares) window.db.Aulas[idxAula].lugares = [];
    window.db.Aulas[idxAula].lugares.push(nome);
    saveData();
    closeModal();
    verDetalleParroquias(idxAula);
}

function borrarLugar(idxAula, idxLugar) {
    if (confirm("¿Borrar este lugar?")) {
        window.db.Aulas[idxAula].lugares.splice(idxLugar, 1);
        saveData();
        verDetalleParroquias(idxAula);
    }
}

function formAula() {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="padding:20px;">
            <h3 style="color:#005696; margin-top:0;">Nova Instalación</h3>
            <input type="text" id="a-nome" placeholder="NOME (PABELLÓN, PISCINA...)" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; text-transform:uppercase; box-sizing:border-box; margin-bottom:15px;">
            <button onclick="guardarAula()" style="width:100%; background:#16a34a; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">CREAR</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function guardarAula() {
    const nome = document.getElementById('a-nome').value.trim().toUpperCase();
    if (!nome) return;
    window.db.Aulas.push({ nome: nome, lugares: [] });
    saveData();
    closeModal();
    mostrarAulas();
}

function borrarAula(idx) {
    if (confirm("¿Borrar esta instalación?")) {
        window.db.Aulas.splice(idx, 1);
        saveData();
        mostrarAulas();
    }
}