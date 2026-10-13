<script setup>
import { onMounted, ref } from "vue";

const apiUrl = "http://localhost:3000/api/libros";
const libros = ref([]);
const titulo = ref("");
const autor = ref("");
const cargando = ref(true);
const error = ref("");

async function cargarLibros() {
  error.value = "";
  cargando.value = true;

  try {
    const respuesta = await fetch(apiUrl);
    if (!respuesta.ok) throw new Error("No se pudo cargar la biblioteca.");
    libros.value = await respuesta.json();
  } catch {
    error.value =
      "No se pudo conectar con la API. Comprueba que el servidor esté iniciado.";
  } finally {
    cargando.value = false;
  }
}

async function agregarLibro() {
  error.value = "";

  try {
    const respuesta = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: titulo.value, autor: autor.value }),
    });

    if (!respuesta.ok) {
      const resultado = await respuesta.json();
      throw new Error(resultado.error || "No se pudo guardar el libro.");
    }

    const libro = await respuesta.json();
    libros.value.push(libro);
    titulo.value = "";
    autor.value = "";
  } catch (fallo) {
    error.value = fallo.message || "No se pudo guardar el libro.";
  }
}

async function eliminarLibro(id) {
  error.value = "";

  try {
    const respuesta = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (!respuesta.ok) throw new Error("No");
    libros.value = libros.value.filter((libro) => libro.id !== id);
  } catch (fallo) {
    error.value = fallo.message || "No se pudo eliminar el libro.";
  }
}

onMounted(cargarLibros);
</script>

<template>
  <main>
    <h1>Biblioteca</h1>

    <p v-if="error" role="alert">{{ error }}</p>
    <p v-else-if="cargando">Cargando libros...</p>
    <p v-else-if="libros.length === 0">Aún no hay libros.</p>

    <ul v-else>
      <li v-for="libro in libros" :key="libro.id">
        <strong>{{ libro.titulo }}</strong> - {{ libro.autor }}
        <button type="button" @click="eliminarLibro(libro.id)">Eliminar</button>
      </li>
    </ul>

    <h2>Agregar libro</h2>
    <form @submit.prevent="agregarLibro">
      <label for="titulo">Título</label>
      <input id="titulo" v-model="titulo" name="titulo" required />

      <label for="autor">Autor</label>
      <input id="autor" v-model="autor" name="autor" required />

      <button type="submit">Agregar libro</button>
    </form>
  </main>
</template>
