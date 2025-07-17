// app.js

// Contraseña para el acceso administrador
const ADMIN_PASSWORD = 'Flikoo123';

// Verifica si el acceso admin está autorizado
function checkAdminAccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminParam = urlParams.get('admin') === 'true';

  if (isAdminParam) {
    let enteredPassword = prompt('Ingrese la contraseña de administrador:');
    if (enteredPassword !== ADMIN_PASSWORD) {
      alert('Contraseña incorrecta. Acceso denegado.');
      window.location.href = window.location.origin; // Redirige a página principal
      return false;
    }
    return true;
  }
  return false;
}

const isAdmin = checkAdminAccess();

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
let uploadAllowed = true; // Siempre permitido

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

// Guardar fotos aprobadas
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

// Cargar fotos aprobadas al iniciar
function loadApprovedPhotos() {
  galleryDiv.inne
