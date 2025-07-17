// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const uploadScreen = document.getElementById('uploadScreen');
const adminScreen = document.getElementById('adminScreen');
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
  uploadAllowed = localStorage.getItem('uploadAllowed') === 'true';
  if (!uploadAllowed) {
    uploadScreen.style.display = 'none';
    uploadClosedMsg.style.display = 'block';
  } else {
    uploadClosedMsg.style.display = 'none';
    uploadScreen.style.display = 'block';
  }
}

// Mostrar pantalla de login y ocultar todo lo demás
function showLogin() {
  loginScreen.style.display = 'block';
  uploadScreen.style.display = 'none';
  uploadClosedMsg.style.display = 'none';
  adminScreen.style.display = 'none';
}

// Mostrar pantalla de subida si está permitido
function showUpload() {
  loginScreen.style.display = 'none';
  adminScreen.style.display = 'none';
  checkUploadPermission();
}

// Mostrar pantalla de administrador
function showAdmin() {
  loginScreen.style.display = 'none';
  uploadScreen.style.display = 'none';
  uploadClosedMsg.style.display = 'none';
  adminScreen.style.display = 'block';
}

// Volver al login desde el admin
function backToLogin() {
  showLogin();
}

// Cuando el usuario ingresa nombre y pulsa comenzar
startBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name.length === 0) {
    alert('Por favor, ingresa tu nombre.');
    return;
  }

  if (name === 'Flikoo123') {
    showAdmin();
    return;
  }

  userName = name;
  userNameSpan.textContent = userName;
  showUpload();
});

// Leer archivo como base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject('Error al leer el archivo');
    reader.readAsDataURL(file);
  });
}

// Guardar foto como aprobada directamente
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

// Añadir foto a la galería visible
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

// Cargar fotos ya aprobadas
function loadApprovedPhotos() {
  galleryDiv.innerHTML = '';
  let approvedPhotos = JSON.parse(localStorage.getItem('flikooApprovedPhotos') || '[]');
  approvedPhotos.forEach(photo => addPhotoToGallery(photo));
}

// Subida de fotos
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
  fileInput.value = '';
});

// Funciones del admin para habilitar o deshabilitar subidas
function enableUploads() {
  localStorage.setItem('uploadAllowed', 'true');
  alert('Subidas habilitadas.');
}

function disableUploads() {
  localStorage.setItem('uploadAllowed', 'false');
  alert('Subidas deshabilitadas.');
}

// Inicialización
window.addEventListener('load', () => {
  showLogin();
  loadApprovedPhotos();
});
