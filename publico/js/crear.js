document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-registro');
    if (!formulario) return;

    formulario.addEventListener('submit', async evento => {
      evento.preventDefault();
      const areaSalida = document.getElementById('resultado-operacion');
      const datos = {
        rut: formulario.rut.value,
        nombre: formulario.nombre.value,
        edad: formulario.edad.value
      };

      try {
          const respuesta = await fetch('/clientes', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(datos)
          });
          const resultado = await respuesta.json();
          areaSalida.textContent = JSON.stringify(resultado, null, 2);

          if (resultado.ok) {
              areaSalida.className = 'result-success';
              formulario.reset();
          } else {
              areaSalida.className = 'result-error';
          }
      } catch (error) {
          areaSalida.textContent = 'Error de conexión con el servidor de la base de datos';
          areaSalida.className = 'result-error';
      }
    });
});
