// --- MÓDULO DE INSTALACIONES / AULAS ---

function mostrarAulas() {
    const actions = document.getElementById('section-actions');
    const container = document.getElementById('data-container');
    
    if (!actions || !container) return;

    actions.innerHTML = `
        <button class="btn" onclick="formAula()" style="background: var(--melide-accent); margin-bottom:20px;">
            + NUEVA INSTALACIÓN / AULA
        </button>
    `;
    container.innerHTML = "";

    // Aseguramos que usamos la tabla Aulas de tu config.js
    if (!window.db.Aulas) {
        window.db.Aulas = [];
    }

    // Orden alfabético por nombre
    window.db.Aulas.sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    
    renderListaAulas(window.db.Aulas);
}

function renderListaAulas(lista) {
    const container = document.getElementById('data-container');
    
    if (lista.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.6; padding:40px;">No hay aulas creadas.</p>`;
        return;
    }

    const grid = document.createElement('div');
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "15px";

    lista.forEach((aula, idx) => {
        const card = document.createElement('div');
        card.className = "menu-card"; 
        card.style.cursor = "pointer";
        card.style.textAlign = "center";
        card.style.margin = "0";
        card.onclick = () => editarAula(idx);
        
        card.innerHTML = `
            <strong style="font-size: 1.1rem; color: var(--melide-primary); display: block; text-transform: uppercase;">
                ${aula.nome}
            </strong>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 5px;">
                ${aula.direccion || 'Pulsar para añadir dirección'}
            </div>
        `;
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

function editarAula(idx) {
    // IMPORTANTE: Conectamos con el objeto real de la base de datos
    const aula = window.db.Aulas[idx];
    const body = document.getElementById('modal-body');
    
    // Verificamos si es Parroquia por el nombre
    const esParroquia = aula.nome && aula.nome.toUpperCase().includes("PARROQUIA");

    let gestionLugaresHtml = "";
    if (esParroquia) {
        // CONEXIÓN DE DATOS: Si existen lugares ya guardados, los cargamos aquí
        const lugaresActivos = aula.lugares || [];
        
        gestionLugaresHtml = `
            <div style="margin-top:20px; padding:15px; background:#f1f5f9; border-radius:12px; border:1px solid #cbd5e1; color: #1e293b; text-align: left;">
                <label style="font-weight:bold; color:var(--melide-primary); font-size:0.8rem; display:block; margin-bottom:10px;">LUGARES / PARROQUIAS ACTIVAS</label>
                
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <input type="text" id="nuevo-lugar" placeholder="Nuevo lugar..." style="margin:0; text-transform:uppercase;">
                    <button class="btn" onclick="engadirLugar(${idx})" style="margin:0; width:auto; padding:0 15px; height:45px;">+</button>
                </div>

                <ul style="list-style:none; padding:0; margin:0;">
                    ${lugaresActivos.length > 0 ? lugaresActivos.map((l, lIdx) => `
                        <li style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px; border-radius:8px; margin-bottom:5px; border:1px solid #e2e8f0; font-size:0.9rem; font-weight:bold;">
                            ${l} 
                            <span onclick="borrarLugar(${idx}, ${lIdx})" style="color:#ef4444; cursor:pointer; font-weight:bold; padding:5px 10px;">✕</span>
                        </li>
                    `).join('') : '<li style="font-size:0.8rem; opacity:0.5;">No hay lugares registrados aún</li>'}
                </ul>
            </div>
        `;
    }

    body.innerHTML = `
        <h3 style="color:var(--melide-primary); margin-bottom:15px;">Ficha Aula</h3>
        
        <label style="font-size:0.75rem; font-weight:bold; color:#64748b; display:block; text-align:left;">NOMBRE</label>
        <input type="text" id="a-nome" value="${aula.nome || ''}" style="text-transform:uppercase;">
        
        <label style="font-size:0.75rem; font-weight:bold; color:#64748b; display:block; text-align:left;">DIRECCIÓN</label>
        <input type="text" id="a-dir" value="${aula.direccion || ''}" placeholder="Escribe la dirección...">

        ${gestionLugaresHtml}

        <div style="display:flex; gap:10px; margin-top:20px;">
            <button class="btn" onclick="actualizarAula(${idx})" style="flex:2; height:50px;">GUARDAR</button>
            <button class="btn" style="background:#ef4444; flex:1; height:50px;" onclick="borrarAula(${idx})">BORRAR</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function engadirLugar(idx) {
    const input = document.getElementById('nuevo-lugar');
    const valor = input.value.trim().toUpperCase();
    if (!valor) return;
    
    // Aseguramos que la propiedad 'lugares' existe en el objeto actual
    if (!window.db.Aulas[idx].lugares) {
        window.db.Aulas[idx].lugares = [];
    }
    
    window.db.Aulas[idx].lugares.push(valor);
    saveData(); // Llama a la función de tu config.js para guardar en localStorage y nube
    editarAula(idx); // Refresca el modal para mostrar el nuevo lugar
}

function borrarLugar(aIdx, lIdx) {
    if(confirm("¿Eliminar este lugar de la lista?")) {
        window.db.Aulas[aIdx].lugares.splice(lIdx, 1);
        saveData();
        editarAula(aIdx);
    }
}

function actualizarAula(idx) {
    const nome = document.getElementById('a-nome').value.trim().toUpperCase();
    if (!nome) return alert("El nombre es necesario");
    
    window.db.Aulas[idx].nome = nome;
    window.db.Aulas[idx].direccion = document.getElementById('a-dir').value.trim();
    
    saveData();
    closeModal();
    mostrarAulas();
}

function formAula() {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3 style="color:var(--melide-primary); margin-bottom:15px;">Nueva Aula</h3>
        <label style="font-size:0.75rem; font-weight:bold; color:#64748b; display:block; text-align:left;">NOMBRE</label>
        <input type="text" id="a-nome" style="text-transform:uppercase;" placeholder="Ej: PABELLÓN O PARROQUIAS">
        <label style="font-size:0.75rem; font-weight:bold; color:#64748b; display:block; text-align:left;">DIRECCIÓN</label>
        <input type="text" id="a-dir" placeholder="Dirección...">
        <button class="btn" onclick="guardarAula()" style="margin-top:15px; height:50px;">CREAR</button>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function guardarAula() {
    const nome = document.getElementById('a-nome').value.trim().toUpperCase();
    if (!nome) return alert("El nombre es necesario");
    
    window.db.Aulas.push({
        nome: nome,
        direccion: document.getElementById('a-dir').value.trim(),
        lugares: []
    });
    
    saveData();
    closeModal();
    mostrarAulas();
}

function borrarAula(idx) {
    if (confirm("¿Borrar esta aula completamente?")) {
        window.db.Aulas.splice(idx, 1);
        saveData();
        closeModal();
        mostrarAulas();
    }
}