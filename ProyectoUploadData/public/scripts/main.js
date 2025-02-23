import { createChart } from "./grafico.js";

const uploadForm = document.getElementById("uploadForm");
const fileList = document.getElementById("fileList");
const trashList = document.getElementById("trashList");
const vaciarPapelera = document.getElementById("vaciarPapelera");

async function fetchStorageStats() {
  try {
    const response = await fetch("/uploads/size");
    if (!response.ok) {
      throw new Error("Error al obtener el tamaño de las carpetas");
    }
    const data = await response.json();
    createChart(data.recycleSize, data.uploadsSize);

  } catch (error) {
    console.error("Error al obtener las estadísticas de almacenamiento:", error);
  }
}

async function fetchFiles() {
  const response = await fetch("/uploads");
  if (!response.ok) {
    console.error("Error al obtener los archivos");
    return;
  }
  const files = await response.json();
  fileList.innerHTML = "";

  files.forEach((file) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
    li.innerHTML = `
      <span>${file}</span>
      <button class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" data-filename="${file}">Eliminar</button>
    `;
    fileList.appendChild(li);
  });

  // Agregar eventos de eliminación
  document.querySelectorAll("button[data-filename]").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const fileName = e.target.dataset.filename;
      await deleteFile(fileName);
      fetchFiles(); // Actualizar la lista
    });
  });
}


async function fetchFilesRecycle() {
  try {
    const response = await fetch("/recycle");
    if (!response.ok) {
      throw new Error("Error al obtener los archivos");
    }
    const files = await response.json();
    trashList.innerHTML = "";

    files.forEach((file) => {
      const li = document.createElement("li");
      li.className =
        "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
      li.innerHTML = `
        <span>${file}</span>
        <button class="bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600" data-name="${file}">Eliminar</button>
      `;
      li.querySelector('button').addEventListener('click', async () => {
        await deleteFileRecycle(file);
        await Promise.all([
          fetchFilesRecycle(),
          fetchStorageStats()
        ]);
      });
      trashList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
  }
}


// Función para eliminar archivo
async function deleteFile(fileName) {
  try {
    const response = await fetch(`/uploads/${fileName}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar el archivo: ${fileName}`);
    }
    
    // Refresh both lists and storage stats
    await Promise.all([
      fetchFiles(),
      fetchFilesRecycle(),
      fetchStorageStats()
    ]);
  } catch (error) {
    console.error(error.message);
  }
}

// Función para eliminar archivo --> recycle
async function deleteFileRecycle(fileName) {
  try {
    const response = await fetch(`/recycle/${fileName}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el archivo: ${fileName}`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Función para eliminar todos los archivo de recycle
async function deleteAllFilesRecycle() {
  const response = await fetch(`/recycle/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    console.error(`Error al eliminar los archivos`);
  }
}


// Manejador de envío del formulario de subida
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const response = await fetch("/uploads", {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    uploadForm.reset(); // Limpiar el formulario
    fetchFiles(); // Actualizar la lista
  } else {
    console.error("Error al subir el archivo");
  }
});

vaciarPapelera.addEventListener("click", async (e) => {
  e.preventDefault();
  await deleteAllFilesRecycle();
  fetchFilesRecycle();
});

const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Capturar el valor del input correctamente
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim(); 

    if (!email) {
      alert("Por favor, introduce un correo válido.");
      return;
    }

    try {
      const response = await fetch("/uploads/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Error al enviar el resumen");

      alert("Correo enviado con éxito.");
      emailInput.value = ""; // Limpiar el input después de enviar el correo
    } catch (error) {
      console.error(error.message);
    }
  });


// Cargar la lista de archivos al cargar la página
document.addEventListener("DOMContentLoaded", fetchFiles);
document.addEventListener("DOMContentLoaded", fetchStorageStats);
document.addEventListener("DOMContentLoaded", fetchFilesRecycle);