// ==========================================
// MÓDULO: ACTIVIDADES (actividades.js)
// ==========================================

function mostrarActividades() {
    const actions = document.getElementById('section-actions');
    const scrDash = document.getElementById('scr-dash');
    const scrEdit = document.getElementById('scr-edit');
    const btnAtras = document.getElementById('btn-atras');

    if (scrDash) scrDash.style.display = "none";
    if (scrEdit) scrEdit.style.display = "block";
    if (btnAtras) {
        btnAtras.style.display = "block";
        btnAtras.onclick = () => {
            document.getElementById('scr-dash').style.display = "grid";
            document.getElementById('scr-edit').style.display = "none";
            btnAtras.style.display = "none";
        };
    }

    if (actions) {
        actions.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom: 10px;">
                <h2 style="margin:0; color:white; font-size: 1.4rem; text-transform:uppercase;">ACTIVIDADES</h2>
                <button onclick="nuevaActividad()" style="background:#16a34a; color:white; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">+ NOVA ACTIVIDADE</button>
            </div>
        `;
    }

    renderizarListaActividades();
}

function renderizarListaActividades() {
    const container = document.getElementById('data-container');
    if (!container) return;

    let listaAct = [...(window.db.Actividades || [])];
    listaAct.sort((a, b) => (a.nome || "").toString().localeCompare((b.nome || "").toString(), 'es', { numeric: true }));

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))"; 
    container.style.gap = "15px";
    container.innerHTML = "";

    listaAct.forEach((act) => {
        const valNombre = act.nome || "SEN NOME";
        const valMonitor = act.monitor || "---";
        const valAula = act.aula || "---";
        const valHora = act.hora || "--:--";
        const valDia = act.dia || "---";
        const realIdx = window.db.Actividades.findIndex(a => a.nome === valNombre);

        const card = document.createElement('div');
        card.style.cssText = `
            background: white; border-radius: 12px; padding: 15px; color: #333; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); border-left: 6px solid #005696;
            display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;
        `;

        card.innerHTML = `
            <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                    <h3 style="margin:0; color:#005696; font-size:1rem; text-transform: uppercase; line-height:1.2; font-weight:800; overflow:hidden; text-overflow:ellipsis;">
                        ${valNombre}
                    </h3>
                    <div style="display:flex; gap:10px; flex-shrink:0;">
                        <button onclick="editarActividad(${realIdx})" style="background:none; border:none; cursor:pointer; font-size:1rem;">✏️</button>
                        <button onclick="borrarActividad(${realIdx})" style="background:none; border:none; cursor:pointer; font-size:1rem;">🗑️</button>
                    </div>
                </div>
            </div>

            <div style="flex-grow:1; font-size:0.85rem; color:#475569;">
                <p style="margin:4px 0;">📅 <b>${valDia}</b></p>
                <p style="margin:4px 0;">⏰ <b>${valHora}</b></p>
                <p style="margin:4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">🏠 ${valAula}</p>
                <p style="margin:4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👤 ${valMonitor}</p>
            </div>

            <div style="display:flex; gap:8px; margin-top:12px; border-top:1px solid #f0f0f0; padding-top:12px;">
                <button onclick="verListaAsistencia(\`${valNombre}\`)" style="flex:1; background:#005696; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.75rem; text-transform:uppercase;">Lista</button>
                <button onclick="abrirGestionWhatsApp(\`${valNombre}\`)" style="flex:1; background:#25d366; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.75rem; text-transform:uppercase;">WhatsApp</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function editarActividad(index) {
    const act = window.db.Actividades[index];
    const modalBody = document.getElementById('modal-body');
    const aulas = window.db.Aulas || [];
    const monitores = window.db.Monitores || [];
    const dias = ["Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado", "Domingo", "Luns-Mércores", "Martes-Xoves"];
    
    let horasOptions = "";
    for(let i = 8; i <= 22; i++) {
        ["00", "30"].forEach(min => {
            let h = i < 10 ? "0"+i : i;
            let timeStr = h + ":" + min;
            horasOptions += `<option value="${timeStr}" ${act.hora === timeStr ? 'selected' : ''}>${timeStr}</option>`;
        });
    }

    modalBody.innerHTML = `
        <div style="padding:15px; box-sizing:border-box; width:100%; text-align:left;">
            <h2 style="color:#005696; margin-top:0; font-size:1.3rem; border-bottom:2px solid #f1f5f9; padding-bottom:10px;">Editar Actividade</h2>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:15px;">
                <label style="font-size:0.8rem; font-weight:bold; color:#64748b;">NOME DA ACTIVIDADE</label>
                <input type="text" id="edit-act-nome" value="${act.nome || ''}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box;">
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:bold; color:#64748b;">DÍA</label>
                        <select id="edit-act-dia" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box;">
                            ${dias.map(d => `<option value="${d}" ${act.dia === d ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; font-weight:bold; color:#64748b;">HORA</label>
                        <select id="edit-act-hora" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box;">
                            ${horasOptions}
                        </select>
                    </div>
                </div>

                <label style="font-size:0.8rem; font-weight:bold; color:#64748b;">INSTALACIÓN</label>
                <select id="edit-act-aula" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box;">
                    ${aulas.map(a => `<option value="${a.nome}" ${act.aula === a.nome ? 'selected' : ''}>${a.nome}</option>`).join('')}
                </select>

                <label style="font-size:0.8rem; font-weight:bold; color:#64748b;">MONITOR/A</label>
                <select id="edit-act-monitor" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box;">
                    ${monitores.map(m => `<option value="${m.nome}" ${act.monitor === m.nome ? 'selected' : ''}>${m.nome}</option>`).join('')}
                </select>

                <button onclick="actualizarActividade(${index})" style="width:100%; background:#005696; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px; font-size:1rem;">GARDAR CAMBIOS</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function actualizarActividade(index) {
    window.db.Actividades[index].nome = document.getElementById('edit-act-nome').value.trim();
    window.db.Actividades[index].dia = document.getElementById('edit-act-dia').value;
    window.db.Actividades[index].hora = document.getElementById('edit-act-hora').value;
    window.db.Actividades[index].aula = document.getElementById('edit-act-aula').value;
    window.db.Actividades[index].monitor = document.getElementById('edit-act-monitor').value;
    saveData(); closeModal(); renderizarListaActividades();
}

function nuevaActividad() {
    const modalBody = document.getElementById('modal-body');
    const aulas = window.db.Aulas || [];
    const monitores = window.db.Monitores || [];
    const dias = ["Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado", "Domingo", "Luns-Mércores", "Martes-Xoves"];
    let horasOptions = "";
    for(let i = 8; i <= 22; i++) {
        ["00", "30"].forEach(min => {
            let h = i < 10 ? "0"+i : i;
            let timeStr = h + ":" + min;
            horasOptions += `<option value="${timeStr}">${timeStr}</option>`;
        });
    }
    modalBody.innerHTML = `
        <div style="padding:15px; box-sizing:border-box; width:100%; text-align:left;">
            <h2 style="color:#005696; margin-top:0;">Nova Actividade</h2>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="act-nome" placeholder="Nome da actividade" style="padding:12px; border:1px solid #ddd; border-radius:10px; width:100%; box-sizing:border-box;">
                <select id="act-dia" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="">Selecciona Día</option>
                    ${dias.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
                <select id="act-hora" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="">Selecciona Hora</option>
                    ${horasOptions}
                </select>
                <select id="act-aula" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="">Selecciona Aula</option>
                    ${aulas.map(a => `<option value="${a.nome}">${a.nome}</option>`).join('')}
                </select>
                <select id="act-monitor" style="padding:12px; border:1px solid #ddd; border-radius:10px;">
                    <option value="">Selecciona Monitor/a</option>
                    ${monitores.map(m => `<option value="${m.nome}">${m.nome}</option>`).join('')}
                </select>
                <button onclick="gardarActividade()" style="background:#005696; color:white; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px;">GARDAR</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function gardarActividade() {
    const nome = document.getElementById('act-nome').value.trim();
    if (!nome) return alert("O nome é obrigatorio");
    window.db.Actividades.push({ 
        nome, 
        dia: document.getElementById('act-dia').value, 
        hora: document.getElementById('act-hora').value, 
        aula: document.getElementById('act-aula').value, 
        monitor: document.getElementById('act-monitor').value 
    });
    saveData(); closeModal(); renderizarListaActividades();
}

function borrarActividad(index) {
    if (confirm("¿Borrar definitivamente esta actividade?")) {
        window.db.Actividades.splice(index, 1);
        saveData();
        renderizarListaActividades();
    }
}

function verListaAsistencia(nomeAct) {
    if (typeof mostrarAlumnos === 'function') { mostrarAlumnos(nomeAct); }
}

function abrirGestionWhatsApp(nomeAct) {
    if (typeof prepararEnvioWhatsApp === 'function') {
        prepararEnvioWhatsApp(nomeAct);
    } else {
        alert("Erro: O módulo de comunicación non está cargado.");
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}