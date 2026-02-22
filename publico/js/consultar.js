document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-busqueda');
    if (!formulario) return;

    formulario.addEventListener('submit', async evento => {
      evento.preventDefault();
      const areaSalida = document.getElementById('resultado-busqueda');
      const parametros = new URLSearchParams();

      if (formulario.rut.value) parametros.append('rut', formulario.rut.value);
      if (formulario.nombre.value) parametros.append('nombre', formulario.nombre.value);
      if (formulario.edad.value) parametros.append('edad', formulario.edad.value);

      try {
          const respuesta = await fetch('/clientes?' + parametros.toString());
          const resultado = await respuesta.json();
          areaSalida.textContent = JSON.stringify(resultado, null, 2);
          areaSalida.className = resultado.ok ? 'result-success' : 'result-error';
      } catch (error) {
          areaSalida.textContent = 'Error al conectar con la API de búsqueda';
          areaSalida.className = 'result-error';
      }
    });
});
