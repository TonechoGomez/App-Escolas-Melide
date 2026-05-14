// ==========================================
// MÓDULO: ALUMNOS (alumnos.js)
// ==========================================

function mostrarAlumnos(filtroActividad = "") {
    const container = document.getElementById('data-container');
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
                if (typeof mostrarActividades === 'function') { mostrarActividades(); } 
                else { mostrarAlumnos(""); }
            } else {
                document.getElementById('scr-dash').style.display = "grid";
                document.getElementById('scr-edit').style.display = "none";
                btnAtras.style.display = "none";
            }
        };
    }

    if (actions) {
        actions.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; width:100%; margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h2 style="margin:0; color:white; font-size:1.4rem;">${filtroActividad.toUpperCase() || 'ALUMNOS'}</h2>
                    <button onclick="nuevoAlumno(\`${filtroActividad}\`)" style="background:#16a34a; color:white; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ NOVO</button>
                </div>
                <input type="text" id="search-alumno" placeholder="Buscar por nome..." value="${filtroActividad}" oninput="renderizarListaAlumnos(this.value)" style="width:100%; padding:12px; border-radius:10px; border:none; font-size:1rem;">
            </div>
        `;
    }

    renderizarListaAlumnos(filtroActividad);
}

function renderizarListaAlumnos(query = "") {
    const container = document.getElementById('data-container');
    if (!container) return;

    let listaAl = [...(window.db.Alumnos || [])];

    const obtenerEstadoReal = (alumno) => {
        const valor = alumno.estado || alumno.status || "ESPERA";
        let str = valor.toString().toLowerCase().trim();
        if (str.includes("admiti")) return "ADMITIDO";
        if (str.includes("baja") || str.includes("baixa")) return "BAIXA";
        return "ESPERA";
    };

    if (query) {
        const q = query.trim().toLowerCase();
        listaAl = listaAl.filter(a => 
            (a.nome && a.nome.toString().toLowerCase().includes(q)) || 
            (a.apelidos && a.apelidos.toString().toLowerCase().includes(q)) ||
            (a.act && a.act.toString().toLowerCase().includes(q))
        );
    }

    const mapaOrden = { 'ADMITIDO': 1, 'ESPERA': 2, 'BAIXA': 3 };
    listaAl.sort((a, b) => {
        const estA = obtenerEstadoReal(a), estB = obtenerEstadoReal(b);
        if (mapaOrden[estA] !== mapaOrden[estB]) return mapaOrden[estA] - mapaOrden[estB];
        return (a.nome || "").localeCompare(b.nome || "");
    });

    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.innerHTML = "";

    const hoyISO = new Date().toISOString().split('T')[0];
    const hoyLabel = new Date().toLocaleDateString('gl-ES', { day: '2-digit', month: '2-digit' });

    listaAl.forEach((alumnoItem) => {
        const estadoFinal = obtenerEstadoReal(alumnoItem);
        let colorBorde = (estadoFinal === 'ADMITIDO') ? "#22c55e" : (estadoFinal === 'BAIXA' ? "#ef4444" : "#eab308");
        const realIdx = window.db.Alumnos.findIndex(orig => orig === alumnoItem);

        const card = document.createElement('div');
        card.style.cssText = `background:white; border-radius:12px; padding:12px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1); border-left: 8px solid ${colorBorde}; color:#333;`;

        card.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; background:#f1f5f9; padding:5px; border-radius:8px; min-width:55px;">
                <span style="font-size:0.65rem; font-weight:bold; color:#475569; margin-bottom:2px;">${hoyLabel}</span>
                <input type="checkbox" ${alumnoItem.asistencias && alumnoItem.asistencias[hoyISO] ? 'checked' : ''} onchange="marcarAsistenciaRapida(${realIdx}, '${hoyISO}', this.checked)" style="width:22px; height:22px; cursor:pointer;">
            </div>

            <div style="flex:2;">
                <h3 style="margin:0; font-size:1rem; text-transform:uppercase;">${alumnoItem.nome} ${alumnoItem.apelidos || ''}</h3>
                <p style="margin:0; font-size:0.8rem; color:#666; font-weight:bold;">${alumnoItem.act || 'SEN ACTIVIDADE'}</p>
            </div>
            
            <button onclick="verHistorialAsistencias(${realIdx})" style="background:#005696; color:white; border:none; padding:8px 12px; border-radius:8px; font-size:0.75rem; font-weight:bold; cursor:pointer;">📊</button>

            <select onchange="cambiarEstadoAlumno(${realIdx}, this.value)" style="background:${colorBorde}; color:white; border:none; border-radius:8px; padding:8px; font-size:0.75rem; font-weight:bold; cursor:pointer;">
                <option value="Admitido" ${estadoFinal === 'ADMITIDO' ? 'selected' : ''}>ADMITIDO</option>
                <option value="Espera" ${estadoFinal === 'ESPERA' ? 'selected' : ''}>ESPERA</option>
                <option value="Baja" ${estadoFinal === 'BAIXA' ? 'selected' : ''}>BAIXA</option>
            </select>

            <div style="display:flex; gap:10px;">
                <button onclick="editarAlumno(${realIdx})" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:1.1rem;">✏️</button>
                <button onclick="borrarAlumno(${realIdx})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.1rem;">🗑️</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// FUNCIONES DE APOYO (Literalmente tus originales)
function marcarAsistenciaRapida(index, fecha, valor) {
    if (!window.db.Alumnos[index].asistencias) window.db.Alumnos[index].asistencias = {};
    window.db.Alumnos[index].asistencias[fecha] = valor;
    saveData();
}

function cambiarEstadoAlumno(index, nuevoEstado) {
    window.db.Alumnos[index].estado = nuevoEstado;
    window.db.Alumnos[index].status = nuevoEstado;
    saveData();
    renderizarListaAlumnos(document.getElementById('search-alumno')?.value || "");
}

function verHistorialAsistencias(index) {
    const al = window.db.Alumnos[index];
    const modalBody = document.getElementById('modal-body');
    let html = `<h3 style="margin-top:0; color:#005696;">Historial: ${al.nome}</h3><div style="max-height:250px; overflow-y:auto;">`;
    const asistencias = al.asistencias || {};
    const fechas = Object.keys(asistencias).sort().reverse();
    if (fechas.length === 0) { html += `<p>Sen rexistros.</p>`; } 
    else {
        fechas.forEach(f => {
            html += `<div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <span>${f}</span><span>${asistencias[f] ? '✅ PRESENTE' : '❌ AUSENTE'}</span>
            </div>`;
        });
    }
    html += `</div><button onclick="closeModal()" style="width:100%; margin-top:15px; padding:10px; background:#005696; color:white; border:none; border-radius:10px;">PECHAR</button>`;
    modalBody.innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

function editarAlumno(index) {
    const al = window.db.Alumnos[index];
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div style="padding:10px; max-height:75vh; overflow-y:auto; text-align:left;">
            <h2 style="color:#005696; margin-top:0;">Editar Alumno</h2>
            <input type="text" id="edit-al-nome" value="${al.nome || ''}" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box;">
            <input type="text" id="edit-al-apelidos" value="${al.apelidos || ''}" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box;">
            <button onclick="actualizarAlumno(${index})" style="width:100%; background:#005696; color:white; padding:15px; border:none; border-radius:10px; font-weight:bold;">GARDAR CAMBIOS</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function actualizarAlumno(index) {
    window.db.Alumnos[index].nome = document.getElementById('edit-al-nome').value.trim();
    window.db.Alumnos[index].apelidos = document.getElementById('edit-al-apelidos').value.trim();
    saveData(); closeModal(); renderizarListaAlumnos();
}

function nuevoAlumno(filtro = "") {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div style="padding:10px; text-align:left;">
            <h2 style="color:#005696;">Novo Alumno</h2>
            <input type="text" id="al-nome" placeholder="Nome" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box;">
            <input type="text" id="al-apelidos" placeholder="Apelidos" style="width:100%; padding:10px; margin-bottom:10px; box-sizing:border-box;">
            <button onclick="gardarAlumno('${filtro}')" style="width:100%; background:#005696; color:white; padding:15px; border:none; border-radius:10px;">GARDAR</button>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function gardarAlumno(filtro) {
    const nome = document.getElementById('al-nome').value.trim();
    if (!nome) return alert("O nome é obrigatorio");
    window.db.Alumnos.push({ nome, apelidos: document.getElementById('al-apelidos').value.trim(), act: filtro, estado: "Espera", asistencias: {} });
    saveData(); closeModal(); mostrarAlumnos(filtro);
}

function borrarAlumno(index) {
    if (confirm("¿Borrar?")) {
        window.db.Alumnos.splice(index, 1);
        saveData(); renderizarListaAlumnos();
    }
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }