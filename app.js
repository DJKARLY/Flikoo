// app.js

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const uploadScreen = document.getElementById('uploadScreen');
const nameInput = document.getElementById('nameInput');
const startBtn = document.getElementById('startBtn');
const userNameSpan = document.getElementById('userName');
const fileInput = document.getElementById('fileInput');
const galleryDiv = document.getElementById('gallery');
const uploadClosedMsg = document.getElementById('uploadClosedMsg');

let userName = '';
let uploadAllowed = false;

// Verificar permiso de subida guardado en localStorage
function checkUploadPermission() {
  uploadAllowed = true;  // Siempre permito subir fotos
  uploadClosedMsg.style.display = 'none';
  uploadScreen.style.display = 'block';
}

// Mostrar pantalla de login y ocultar la de subida
function showLogin() {
  loginScreen.style.display = 'block';
  uploadScreen.style.display = 'none';
  uploadClosedMsg.style.display = 'none';
}

// Mostrar pantalla de subida y ocultar login
function showUpload() {
  loginScreen.style.display = 'none';
  checkUploadPermission();
  if (uploadAllowed) {
    uploadScreen.style.display = 'block';
  }
}

// Cuando el usuario ingresa nombre y pulsa comenzar
startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name.length === 0) {
    alert('Por favor, ingresa tu nombre.');
    return;
  }
  userName = name;
  userNameSpan.textContent = userName;
  showUpload();
});

// Función para leer archivo como base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject('Error al leer el archivo');
    reader.readAsDataURL(file);
  });
}

// Guardar fotos pendientes para aprobación (opcional según lógica)
// En este código simplificamos: sube y aprueba automáticamente

// Guardar foto en localStorage como aprobada
async function savePhoto(file) {
  try {
    const dataUrl = await readFileAsDataURL(file);
    let approvedPhotos = JSON.parse(localStorage.getItem('flikooApprovedPhotos') || '[]');
    approvedPhotos.push(dataUrl);
    localStorage.setItem('flikooApprovedPhotos', JSON.stringify(approvedPhotos));
    addPhotoToGallery(dataUrl);
  } catch (error) {
    alert('Error al cargar la imagen: ' + error);
  }
}

// Añadir foto a la galería visible en la pantalla de subida
function addPhotoToGallery(dataUrl) {
  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'Foto subida';
  img.style.width = '120px';
  img.style.margin = '8px';
  img.style.borderRadius = '8px';
  img.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
  galleryDiv.appendChild(img);
}

// Al cargar la página, cargar fotos ya aprobadas en la galería
function loadApprovedPhotos() {
  galleryDiv.innerHTML = '';
  let approvedPhotos = JSON.parse(localStorage.getItem('flikooApprovedPhotos') || '[]');
  approvedPhotos.forEach(photo => addPhotoToGallery(photo));
}

// Al cambiar el input file
fileInput.addEventListener('change', async (e) => {
  if (!uploadAllowed) {
    alert('No está permitido subir fotos en este momento.');
    fileInput.value = '';
    return;
  }

  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen.');
      continue;
    }
    await savePhoto(file);
  }
  fileInput.value = ''; // Limpiar input para permitir subir la misma foto de nuevo si quieren
});

// Inicialización
window.addEventListener('load', () => {
  showLogin();
  loadApprovedPhotos();
});
