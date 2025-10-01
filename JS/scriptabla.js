  function agregarFila() {
      const tabla = document.getElementById("tabla-reservas");
      const nuevaFila = tabla.rows[0].cloneNode(true);
      nuevaFila.querySelectorAll("input").forEach(input => input.value = "");
      tabla.appendChild(nuevaFila);
    }

    function guardar(btn) {
      const fila = btn.closest("tr");
      const datos = Array.from(fila.querySelectorAll("input")).map(input => input.value);
      console.log("Datos guardados:", datos);
      // Aquí puedes hacer fetch/AJAX para guardar en la BD
    }

    function eliminar(btn) {
      const fila = btn.closest("tr");
      fila.remove();
    }