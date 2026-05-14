// ==========================================
// MÓDULO: ALUMNOS (alumnos.js)
// ==========================================

function mostrarAlumnos(filtroActividad = "") {
    const actions = document.getElementById('section-actions');
    const scrDash = document.getElementById('scr-dash');
    const scrEdit = document.getElementById('scr-edit');
    const btnAtras = document.getElementById('btn-atras');

    if (scrDash) scrDash.style.display = "none";
    if (scrEdit) scrEdit.style.display = "block";
    
    if (btnAtras) {
        btnAtras.style.display = "block";
        btnAtras.onclick = () => {
            if (filtroActividad) {
                if (typeof mostrarActividades === 'function') mostrarActividades();
                else mostrarAlumnos("");
            } else {
                if (typeof irInicio === 'function') irInicio();
                else {
                    document.getElementById('scr-dash').style.display = "grid";
                    document.getElementById('scr-edit').style.display = "none";
                    btnAtras.style.display = "none";
                }
            }
        };
    }

    if (actions) {
        actions.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h2 style="margin:0; color:white; font-size:1.4rem; text-transform:uppercase;">${filtroActividad || 'ALUMNOS'}</h2>
                    <button onclick="nuevoAlumno(\`${filtroActividad}\`)" style="background:#16a34a; color:white; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ NOVO</button>
                </div>
                <input type="text" id="search-alumno" placeholder="Buscar por nome ou apelidos..." value="${filtroActividad}" oninput="renderizarListaAlumnos(this.value)" style="width:100%; padding:12px; border-radius:10px; border:none; font-size:1rem; box-sizing:border-box;">
            </div>
        `;
    }

    renderizarListaAlumnos(filtroActividad);
}

function renderizarListaAlumnos(query = "") {
    const container = document.getElementById('data-container');
    if (!container) return;

    let listaAl = [...(window.db.Alumnos || [])];
    
    if (query) {
        const q = query.trim().toLowerCase();
        listaAl = listaAl.filter(a => 
            (a.nome && a.nome.toString().toLowerCase().includes(q)) || 
            (a.apelidos && a.apelidos.toString().toLowerCase().includes(q)) ||
            (a.act && a.act.toString().toLowerCase().includes(q))
        );
    }

    // Ordenación por Estado y luego Nombre
    const mapaOrden = { 'ADMITIDO': 1, 'ESPERA': 2, 'BAIXA': 3 };
    listaAl.sort((a, b) => {
        const estA = (a.estado || "ESPERA").toUpperCase(), estB = (b.estado || "ESPERA").toUpperCase();
        if (mapaOrden[estA] !== mapaOrden[estB]) return (mapaOrden[estA] || 2) - (mapaOrden[estB] || 2);
        return (a.nome || "").localeCompare(b.nome || "");
    });

    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.innerHTML = "";

    const hoyISO = new Date().toISOString().split('T')[0];

    listaAl.forEach((al) => {
        const estado = (al.estado || "ESPERA").toUpperCase();
        let color = (estado === 'ADMITIDO') ? "#22c55e" : (estado === 'BAIXA' ? "#ef4444" : "#eab308");
        const realIdx = window.db.Alumnos.findIndex(orig => orig === al);

        const card = document.createElement('div');
        card.style.cssText = `background:white; border-radius:12px; padding:12px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); border-left: 8px solid ${color}; color:#333;`;

        card.innerHTML = `
            <div style="flex:2;">
                <h3 style="margin:0; font-size:1rem; text-transform:uppercase;">${al.nome} ${al.apelidos || ''}</h3>
                <p style="margin:0; font-size:0.8rem; color:#666; font-weight:bold;">${al.act || 'SEN ACTIVIDADE'}</p>
            </div>
            <div style="display:flex; gap:8px;">
                <button onclick="verHistorialAsistencias(${realIdx})" style="background:#f1f5f9; border:none; padding:8px; border-radius:8px; cursor:pointer;">📊</button>
                <button onclick="editarAlumno(${realIdx})" style="background:#f1f5f9; border:none; padding:8px; border-radius:8px; cursor:pointer;">✏️</button>
                <button onclick="borrarAlumno(${realIdx})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.2rem;">&times;</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function editarAlumno(index) {
    const al = window.db.Alumnos[index];
    const modalBody = document.getElementById('modal-body');
    const actividades = window.db.Actividades || [];
    if (!al.telefonos) al.telefonos = [al.tlf || ""];

    modalBody.innerHTML = `
        <div style="padding:15px; box-sizing:border-box; width:100%; text-align:left;">
            <h2 style="color:#005696; margin-top:0; border-bottom:2px solid #f1f5f9; padding-bottom:10px;">Ficha do Alumno</h2>
            <div style="display:flex; flex-direction:column; gap:12px; max-height: 65vh; overflow-y: auto; padding-right: 5px;">
                
                <label style="font-size:0.75rem; font-weight:bold; color:#64748b;">NOME E APELIDOS</label>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <input type="text" id="edit-al-nome" value="${al.nome || ''}" placeholder="Nome" style="padding:12px; border-radius:10px; border:1px solid #ddd; width:100%; box-sizing:border-box;">
                    <input type="text" id="edit-al-apelidos" value="${al.apelidos || ''}" placeholder="Apelidos" style="padding:12px; border-radius:10px; border:1px solid #ddd; width:100%; box-sizing:border-box;">
                </div>

                <label style="font-size:0.75rem; font-weight:bold; color:#64748b;">ACTIVIDADE E ESTADO</label>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <select id="edit-al-act" style="padding:12px; border-radius:10px; border:1px solid #ddd;">
                        <option value="">Sen actividade</option>
                        ${actividades.map(act => `<option value="${act.nome}" ${al.act === act.nome ? 'selected' : ''}>${act.nome}</option>`).join('')}
                    </select>
                    <select id="edit-al-estado" style="padding:12px; border-radius:10px; border:1px solid #ddd;">
                        <option value="Admitido" ${al.estado === 'Admitido' ? 'selected' : ''}>ADMITIDO</option>
                        <option value="Espera" ${al.estado === 'Espera' ? 'selected' : ''}>ESPERA</option>
                        <option value="Baja" ${al.estado === 'Baja' ? 'selected' : ''}>BAIXA</option>
                    </select>
                </div>

                <label style="font-size:0.75rem; font-weight:bold; color:#64748b;">TELÉFONOS DE CONTACTO</label>
                <div id="lista-telefonos-edit" style="display:flex; flex-direction:column; gap:8px;">
                    ${al.telefonos.map((t, i) => `
                        <div style="display:flex; gap:8px;">
                            <input type="tel" class="edit-al-tel" value="${t}" style="flex:1; padding:10px; border-radius:10px; border:1px solid #ddd;">
                            <button onclick="this.parentElement.remove()" style="background:#fee2e2; color:#ef4444; border:none; border-radius:10px; padding:0 12px; cursor:pointer; font-weight:bold;">&times;</button>
                        </div>
                    `).join('')}
                </div>
                <button onclick="engadirCampoTelEdit()" style="background:#f1f5f9; color:#005696; border:1px dashed #005696; padding:10px; border-radius:10px; cursor:pointer; font-size:0.8rem; font-weight:bold;">+ ENGADIR TELÉFONO</button>

                <label style="font-size:0.75rem; font-weight:bold; color:#64748b;">OUTROS DATOS</label>
                <input type="email" id="edit-al-email" value="${al.email || ''}" placeholder="Email" style="padding:12px; border-radius:10px; border:1px solid #ddd; width:100%; box-sizing:border-box;">
                <input type="text" id="edit-al-direccion" value="${al.direccion || ''}" placeholder="Dirección" style="padding:12px; border-radius:10px; border:1px solid #ddd; width:100%; box-sizing:border-box;">
            </div>
            <button onclick="actualizarAlumno(${index})" style="width:100%; background:#005696; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:20px; font-size:1rem;">GARDAR CAMBIOS</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function engadirCampoTelEdit() {
    const container = document.getElementById('lista-telefonos-edit');
    const div = document.createElement('div');
    div.style.cssText = "display:flex; gap:8px;";
    div.innerHTML = `
        <input type="tel" class="edit-al-tel" placeholder="Novo teléfono" style="flex:1; padding:10px; border-radius:10px; border:1px solid #ddd;">
        <button onclick="this.parentElement.remove()" style="background:#fee2e2; color:#ef4444; border:none; border-radius:10px; padding:0 12px; cursor:pointer; font-weight:bold;">&times;</button>
    `;
    container.appendChild(div);
}

function actualizarAlumno(index) {
    const tels = Array.from(document.querySelectorAll('.edit-al-tel')).map(input => input.value.trim()).filter(v => v !== "");
    const actPrevia = window.db.Alumnos[index].act;

    window.db.Alumnos[index].nome = document.getElementById('edit-al-nome').value.trim();
    window.db.Alumnos[index].apelidos = document.getElementById('edit-al-apelidos').value.trim();
    window.db.Alumnos[index].act = document.getElementById('edit-al-act').value;
    window.db.Alumnos[index].estado = document.getElementById('edit-al-estado').value;
    window.db.Alumnos[index].email = document.getElementById('edit-al-email').value.trim();
    window.db.Alumnos[index].direccion = document.getElementById('edit-al-direccion').value.trim();
    window.db.Alumnos[index].telefonos = tels;
    window.db.Alumnos[index].tlf = tels[0] || ""; 

    saveData(); 
    closeModal(); 
    mostrarAlumnos(actPrevia);
}

function nuevoAlumno(filtro = "") {
    const modalBody = document.getElementById('modal-body');
    const actividades = window.db.Actividades || [];
    modalBody.innerHTML = `
        <div style="padding:15px; box-sizing:border-box; width:100%; text-align:left;">
            <h2 style="color:#005696; margin-top:0;">Novo Alumno</h2>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <input type="text" id="al-nome" placeholder="Nome" style="padding:12px; border:1px solid #ddd; border-radius:10px; width:100%; box-sizing:border-box;">
                <input type="text" id="al-apelidos" placeholder="Apelidos" style="padding:12px; border:1px solid #ddd; border-radius:10px; width:100%; box-sizing:border-box;">
                <select id="al-act" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="">Seleccionar Actividade</option>
                    ${actividades.map(act => `<option value="${act.nome}" ${act.nome === filtro ? 'selected' : ''}>${act.nome}</option>`).join('')}
                </select>
                <input type="tel" id="al-tel" placeholder="Teléfono" style="padding:12px; border:1px solid #ddd; border-radius:10px; width:100%; box-sizing:border-box;">
                <select id="al-estado" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="Admitido">ADMITIDO</option>
                    <option value="Espera" selected>ESPERA</option>
                    <option value="Baja">BAJA</option>
                </select>
                <button onclick="gardarAlumno()" style="background:#005696; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px;">GARDAR</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function gardarAlumno() {
    const nome = document.getElementById('al-nome').value.trim();
    if (!nome) return alert("O nome é obrigatorio");
    const act = document.getElementById('al-act').value;
    const tel = document.getElementById('al-tel').value.trim();

    window.db.Alumnos.push({ 
        nome: nome, 
        apelidos: document.getElementById('al-apelidos').value.trim(),
        act: act, 
        estado: document.getElementById('al-estado').value, 
        telefonos: tel ? [tel] : [],
        tlf: tel,
        asistencias: {} 
    });
    saveData(); 
    closeModal(); 
    mostrarAlumnos(act);
}

function borrarAlumno(index) {
    if (confirm("¿Borrar definitivamente este alumno?")) {
        const act = window.db.Alumnos[index].act;
        window.db.Alumnos.splice(index, 1);
        saveData();
        mostrarAlumnos(act);
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}