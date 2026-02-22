async function cargarDatos() {
  const botonRefrescar = document.getElementById('refrescar');
  const cuerpoTabla = document.querySelector('#tabla-clientes tbody');

  if (!botonRefrescar || !cuerpoTabla) return;

  try {
      botonRefrescar.disabled = true;
      botonRefrescar.textContent = 'Actualizando...';

      const respuesta = await fetch('/clientes');
      const resultado = await respuesta.json();

      cuerpoTabla.innerHTML = '';

      if (resultado.ok && Array.isArray(resultado.data)) {
        if (resultado.data.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay clientes registrados en la base de datos.</td></tr>';
        } else {
            resultado.data.forEach(cliente => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                <td style="font-weight: 600; color: var(--primary);">${cliente.rut}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.edad}</td>
              `;
              cuerpoTabla.appendChild(fila);
            });
        }
      } else {
        cuerpoTabla.innerHTML = '<tr><td colspan="3" style="color: var(--danger); text-align: center;">Error: ' + (resultado.mensaje || 'Respuesta no válida del servidor') + '</td></tr>';
      }
  } catch (error) {
      cuerpoTabla.innerHTML = '<tr><td colspan="3" style="color: var(--danger); text-align: center;">Fallo de conexión con el servidor</td></tr>';
  } finally {
      botonRefrescar.disabled = false;
      botonRefrescar.textContent = 'Refrescar lista';
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('refrescar');
    if (boton) {
        boton.addEventListener('click', cargarDatos);
        cargarDatos();
    }
});
