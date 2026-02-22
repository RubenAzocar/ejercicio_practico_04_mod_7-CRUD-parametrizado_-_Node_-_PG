document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-actualizacion');
    if (!formulario) return;

    formulario.addEventListener('submit', async evento => {
      evento.preventDefault();
      const areaSalida = document.getElementById('resultado-actualizacion');
      const rutParametro = formulario.rut.value;
      const cuerpoSolicitud = { nombre: formulario.nombre.value };

      try {
          const respuesta = await fetch('/clientes/' + encodeURIComponent(rutParametro), {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(cuerpoSolicitud)
          });
          const resultado = await respuesta.json();
          areaSalida.textContent = JSON.stringify(resultado, null, 2);
          areaSalida.className = resultado.ok ? 'result-success' : 'result-error';

          if (resultado.ok) formulario.reset();
      } catch (error) {
          areaSalida.textContent = 'Hubo un error al intentar actualizar el registro';
          areaSalida.className = 'result-error';
      }
    });
});
