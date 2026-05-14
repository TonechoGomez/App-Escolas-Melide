// ==========================================
// MÓDULO: INSTALACIONES (instalaciones.js)
// ==========================================

function mostrarAulas() {
    const actions = document.getElementById('section-actions');
    const container = document.getElementById('data-container');
    if (!actions || !container) return;

    // ESPERA ACTIVA PARA LA WEB
    if (!window.db || !window.db.Aulas || window.db.Aulas.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:white; padding:40px; font-weight:bold;">CONECTANDO COA NUBE...</div>`;
        setTimeout(mostrarAulas, 500); 
        return;
    }

    actions.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:20px;">
            <h2 style="margin:0; color:white; font-size:1.4rem;">INSTALACIÓNS</h2>
            <button onclick="formAula()" style="background:#16a34a; color:white; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ NOVA INSTALACIÓN</button>
        </div>
    `;
    
    verificarEstructuraAulas();
    const listaAulas = [...window.db.Aulas].sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    renderListaAulas(listaAulas);
}

function verificarEstructuraAulas() {
    if (!window.db.Aulas) window.db.Aulas = [];
    let tieneParroquias = window.db.Aulas.some(a => a.nome && a.nome.toUpperCase() === "PARROQUIAS");
    if (!tieneParroquias) {
        window.db.Aulas.push({ nome: "PARROQUIAS", lugares: [] });
    }
    window.db.Aulas.forEach(a => { if (!a.lugares) a.lugares = []; });
}

function renderListaAulas(lista) {
    const container = document.getElementById('data-container');
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))"; 
    container.style.gap = "20px";
    container.innerHTML = "";

    lista.forEach((aula) => {
        const card = document.createElement('div');
        card.style.cssText = "background:white; padding:25px; border-radius:20px; text-align:center; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-top:8px solid #005696; color:#333;";
        
        const esParroquia = aula.nome && aula.nome.toUpperCase() === "PARROQUIAS";
        const numLugares = (aula.lugares || []).length;
        
        card.innerHTML = `
            <span style="font-size:3rem; display:block; margin-bottom:10px;">${esParroquia ? '📍' : '🏢'}</span>
            <h3 style="margin:0; font-size:1.2rem; color:#005696; text-transform:uppercase;">${aula.nome}</h3>
            <p style="margin:10px 0 0; font-size:0.85rem; color:#64748b;">${numLugares} Localizacións</p>
        `;

        const realIdx = window.db.Aulas.findIndex(a => a.nome === aula.nome);
        card.onclick = () => abrirGestionLugares(realIdx);
        container.appendChild(card);
    });
}

function abrirGestionLugares(idx) {
    const aula = window.db.Aulas[idx];
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f1f5f9; padding:15px 20px; border-radius:25px 25px 0 0; border-bottom:1px solid #e2e8f0;">
            <span style="font-weight:bold; color:#64748b; font-size:0.85rem; text-transform:uppercase;">XESTIÓN DE LOCALIZACIÓNS</span>
            <button onclick="closeModal()" style="background:#cbd5e1; border:none; color:white; width:30px; height:30px; border-radius:50%; font-size:1.2rem; cursor:pointer; font-weight:bold;">&times;</button>
        </div>
        <div style="padding:20px; text-align:left;">
            <h2 style="margin:0 0 15px; color:#005696; text-transform:uppercase; font-size:1.2rem;">${aula.nome}</h2>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="nuevo-lugar-input" placeholder="Engadir nova localización..." style="flex:1; padding:12px; border-radius:10px; border:1px solid #ddd; text-transform:uppercase;">
                <button onclick="engadirLugarALista(${idx})" style="background:#16a34a; color:white; border:none; border-radius:10px; padding:0 20px; font-weight:bold; cursor:pointer;">+</button>
            </div>
            <div id="lista-lugares-modal" style="max-height:250px; overflow-y:auto; border:1px solid #eee; border-radius:12px; padding:10px; background:#f8fafc;">
                ${renderHtmlLugares(aula.lugares || [], idx)}
            </div>
            <div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee;">
                <button onclick="borrarInstalacionCompleta(${idx})" style="width:100%; background:#fee2e2; color:#dc2626; padding:10px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.8rem;">ELIMINAR TODA A INSTALACIÓN</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function renderHtmlLugares(lugares, aulaIdx) {
    if (!lugares || lugares.length === 0) return `<p style="text-align:center; color:#94a3b8; font-size:0.9rem;">Non hai localizacións gardadas</p>`;
    return lugares.map((lugar, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px 15px; border-radius:8px; margin-bottom:8px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <span style="font-weight:500; color:#334155;">${lugar}</span>
            <button onclick="eliminarLugarDeLista(${aulaIdx}, ${i})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1rem;">🗑️</button>
        </div>
    `).join('');
}

function engadirLugarALista(idx) {
    const input = document.getElementById('nuevo-lugar-input');
    const valor = input.value.trim().toUpperCase();
    if (!valor) return;
    if (!window.db.Aulas[idx].lugares.includes(valor)) {
        window.db.Aulas[idx].lugares.push(valor);
        saveData();
        document.getElementById('lista-lugares-modal').innerHTML = renderHtmlLugares(window.db.Aulas[idx].lugares, idx);
        input.value = "";
        mostrarAulas(); 
    } else { alert("Esta localización xa existe."); }
}

function eliminarLugarDeLista(aulaIdx, lugarIdx) {
    if (confirm("¿Eliminar esta localización?")) {
        window.db.Aulas[aulaIdx].lugares.splice(lugarIdx, 1);
        saveData();
        document.getElementById('lista-lugares-modal').innerHTML = renderHtmlLugares(window.db.Aulas[aulaIdx].lugares, aulaIdx);
        mostrarAulas();
    }
}

function borrarInstalacionCompleta(idx) {
    if (confirm("¿ESTÁS SEGURO?")) {
        window.db.Aulas.splice(idx, 1);
        saveData();
        closeModal();
        mostrarAulas();
    }
}

function formAula() {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f1f5f9; padding:15px 20px; border-radius:25px 25px 0 0; border-bottom:1px solid #e2e8f0;">
            <span style="font-weight:bold; color:#64748b; font-size:0.85rem; text-transform:uppercase;">NOVA INSTALACIÓN</span>
            <button onclick="closeModal()" style="background:#cbd5e1; border:none; color:white; width:30px; height:30px; border-radius:50%; font-size:1.2rem; cursor:pointer; font-weight:bold;">&times;</button>
        </div>
        <div style="padding:20px; text-align:left;">
            <label style="font-weight:bold; font-size:0.8rem; color:#64748b; display:block; margin-bottom:8px;">NOME DO EDIFICIO / GRUPO</label>
            <input type="text" id="a-nome" style="width:100%; padding:12px; border-radius:10px; border:1px solid #ddd; text-transform:uppercase; margin-bottom:15px;">
            <button onclick="guardarAula()" style="width:100%; background:#16a34a; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">CREAR INSTALACIÓN</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function guardarAula() {
    const nome = document.getElementById('a-nome').value.trim().toUpperCase();
    if (nome) { 
        window.db.Aulas.push({ nome: nome, lugares: [] }); 
        saveData();
        closeModal(); 
        mostrarAulas(); 
    }
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }