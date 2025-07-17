document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("loginScreen");
  const uploadScreen = document.getElementById("uploadScreen");
  const uploadClosedMsg = document.getElementById("uploadClosedMsg");

  const nameInput = document.getElementById("nameInput");
  const startBtn = document.getElementById("startBtn");
  const userNameSpan = document.getElementById("userName");
  const adminLabel = document.getElementById("adminLabel");

  const fileInput = document.getElementById("fileInput");
  const gallery = document.getElementById("gallery");

  // ✅ Cambiar a false si querés cerrar temporalmente la subida
  const subidaHabilitada = true;

  startBtn.addEventListener("click", () => {
    const nombre = nameInput.value.trim();

    if (!nombre) {
      alert("Por favor, ingresá tu nombre.");
      return;
    }

    userNameSpan.textContent = nombre;

    const esAdmin = nombre === "Flikoo123";

    if (subidaHabilitada || esAdmin) {
      loginScreen.classList.add("hidden");
      uploadScreen.classList.remove("hidden");

      if (esAdmin) {
        adminLabel.classList.remove("hidden");
      }
    } else {
      loginScreen.classList.add("hidden");
      uploadClosedMsg.classList.remove("hidden");
    }
  });

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        gallery.appendChild(img);
      };

      reader.readAsDataURL(file);
    }
  });
});
