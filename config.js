// --- CONFIGURACIÓN GLOBAL Y BASE DE DATOS ---

// 1. Inicialización: Intenta leer del disco, si no hay nada, crea el esquema vacío.
window.db = JSON.parse(localStorage.getItem('melide_db')) || { 
    Monitores: [], 
    Actividades: [], 
    Aulas: [], 
    Alumnos: [] 
};

// 2. URL de sincronización (Google Script)
window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-dK7osHxDpWA4XSgML3VQ7WUxG1iFBJigxMeDyRqm0cEsrqKASAtJGjUlBBxpKjnENA/exec";

/**
 * Guarda los datos en el navegador y activa la sincronización
 */
function saveData() {
    localStorage.setItem('melide_db', JSON.stringify(window.db));
    console.log("Datos guardados en memoria local.");
    
    if (typeof enviarDatosAWebApp === 'function') {
        enviarDatosAWebApp();
    }
}

/**
 * Repara la base de datos si falta alguna tabla
 */
function repairDB() {
    if (!window.db) window.db = {};
    if (!window.db.Monitores) window.db.Monitores = [];
    if (!window.db.Actividades) window.db.Actividades = [];
    if (!window.db.Aulas) window.db.Aulas = [];
    if (!window.db.Alumnos) window.db.Alumnos = [];
    saveData();
}

// Ejecutar reparación al inicio
repairDB();