document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-eliminacion');
    if (!formulario) return;

    formulario.addEventListener('submit', async evento => {
      evento.preventDefault();

      const confirmacion = confirm('¿Está seguro de que desea eliminar este registro?');
      if (!confirmacion) return;

      const areaSalida = document.getElementById('resultado-eliminacion');
      const parametros = new URLSearchParams();
      if (formulario.rut.value) parametros.append('rut', formulario.rut.value);
      if (formulario.nombre.value) parametros.append('nombre', formulario.nombre.value);
      if (formulario.edad.value) parametros.append('edad', formulario.edad.value);

      try {
          const respuesta = await fetch('/clientes?' + parametros.toString(), {
            method: 'DELETE'
          });
          const resultado = await respuesta.json();
          areaSalida.textContent = JSON.stringify(resultado, null, 2);
          areaSalida.className = resultado.ok ? 'result-success' : 'result-error';

          if (resultado.ok) formulario.reset();
      } catch (error) {
          areaSalida.textContent = 'Error crítico en la operación de eliminación';
          areaSalida.className = 'result-error';
      }
    });
});
