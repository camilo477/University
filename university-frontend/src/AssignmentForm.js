import React, { useState } from 'react';
import './Formulario.css'; 
import marcoantoniosolis from './images/marcoantoniosolis.png';

const Horario = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [asignatura, setAsignatura] = useState('');
  const [numeroAsignatura, setNumeroAsignatura] = useState('');
  const [numeroEstudiante, setNumeroEstudiante] = useState('');
  const [estudiante, setEstudiante] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');
  const [asignaturaNombre, setAsignaturaNombre] = useState('');
  const [docenteNombre, setDocenteNombre] = useState('');
  const [estudianteNombre, setEstudianteNombre] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState('');
  const [horarioColoreado, setHorarioColoreado] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');

  const handleEliminar = () => {
    const nuevaListaHorarios = horarioColoreado.filter(celda => celda.nombre !== asignaturaSeleccionada);
    setHorarioColoreado(nuevaListaHorarios);
  
    setAsignaturaSeleccionada('');
  };

  const handleSearchAsignatura = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/get_asignatura_by_nombre/?nombre=${asignatura}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar la asignatura');
      }

      const data = await response.json();
      
      setAsignaturaId(data.id_asignatura);
      setAsignaturaNombre(asignatura);
      
      const docente = data.docentes[0];
      setDocenteNombre(docente ? `${docente.nombre} ${docente.apellido}` : 'No asignado');
      setHorarios(data.horarios);
      setNumeroAsignatura(data.id_asignatura);
    } catch (error) {
      console.error('Error al buscar la asignatura:', error);
      setError('No se pudo obtener la asignatura. Verifica el servidor.');
    }
  };

  const handleSearchEstudiante = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/get_alumno_by_id/?id=${numeroEstudiante}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar el estudiante');
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setEstudianteNombre(`${data.nombre} ${data.apellido}`);
      } else {
        throw new Error('El formato de la respuesta no es JSON');
      }
    } catch (error) {
      console.error('Error al buscar el estudiante:', error);
      setError('No se pudo obtener el estudiante. Verifica el servidor.');
    }
  };

  const handleColorearHorario = (horariosData, nombre) => {
    const coloreados = horariosData.map((horario) => {
      const dia = horario.dia;
      const horaInicio = parseInt(horario.hora_inicio.split(':')[0]);
      const horaFin = parseInt(horario.hora_fin.split(':')[0]);
  
      const celdasAColorear = [];
      for (let i = horaInicio; i < horaFin; i++) {
        const fila = i - 7; // Ajuste para las filas
        if (fila >= 0 && fila < 14) {
          celdasAColorear.push({ fila, dia, nombre });
        }
      }
      return celdasAColorear;
    });
  
    // Combinar los horarios coloreados previos con los nuevos
    setHorarioColoreado((prevHorario) => [...prevHorario, ...coloreados.flat()]);
  };
  
  

  const handleRegistro = (e) => {
    e.preventDefault();
    console.log({ asignatura, numeroAsignatura, numeroEstudiante, estudiante });
  };

  return (
    <div className="container">
      <table className="schedule">
  <thead>
    <tr>
      <th></th>
      <th>Lunes</th>
      <th>Martes</th>
      <th>Miércoles</th>
      <th>Jueves</th>
      <th>Viernes</th>
      <th>Sábado</th>
    </tr>
  </thead>
  <tbody>
    {[...Array(14)].map((_, i) => (
      <tr key={i}>
        <td>{7 + i}-{8 + i}</td>
        {[...Array(6)].map((_, j) => {
          const dia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][j];
          const isColoreado = horarioColoreado.some(
            (celda) => celda.fila === i && celda.dia === dia
          );
          return (
            <td
                key={j}
                style={{
                  backgroundColor: isColoreado ? 'green' : '',
                  color: isColoreado ? 'white' : '',
                  cursor: isColoreado ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isColoreado) {
                    const asignaturaSeleccionada = horarioColoreado.find(
                      (celda) => celda.fila === i && celda.dia === dia
                    );
                    setAsignaturaSeleccionada(asignaturaSeleccionada ? asignaturaSeleccionada.nombre : '');
                  }
                }}
              >
                {isColoreado ? horarioColoreado.find(celda => celda.fila === i && celda.dia === dia).nombre : ''}
              </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>


      <div className="imagen">
        <img src={marcoantoniosolis} alt="Footer" className="fot"/>
      </div>

      <div className="form-container">
        <h2>Sistema de Gestión de Asignaturas</h2>
        <form onSubmit={handleRegistro}>
          <label htmlFor="asignatura">Asignatura</label>
          <input
            type="text"
            id="asignatura"
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
          />
          
          <button type="button" onClick={handleSearchAsignatura}>
            Buscar Asignatura
          </button>

          <label htmlFor="numero-asignatura">Número de asignatura:</label>
          <input
            type="text"
            id="numero-asignatura"
            value={numeroAsignatura || ''}
            readOnly
          />

          <label htmlFor="numero-estudiante">Número Estudiante</label>
          <input
            type="number"
            id="numero-estudiante"
            value={numeroEstudiante}
            onChange={(e) => setNumeroEstudiante(e.target.value)}
          />

          <button type="button" onClick={handleSearchEstudiante}>
            Buscar Estudiante
          </button>

          <label htmlFor="estudiante">Estudiante:</label>
          <input
            type="text"
            id="estudiante"
            value={estudianteNombre || estudiante}
            readOnly
          />

{asignaturaNombre && docenteNombre && (
  <div className="asignatura-cuadro">
    
    <p
  className="clickable"
  onClick={() => {
    if (estudianteNombre) {
      handleColorearHorario(horarios, asignaturaNombre);
    } else {
      setError('Por favor, ingrese un estudiante primero.');
    }
  }}
>
  {asignaturaNombre}
</p>

    
    <p>
      Docente: {docenteNombre}
    </p>

    {horarios && horarios.length > 0 && (
      <div>
        
        <p>Horarios:</p>
        <ul>
          {horarios.map((horario, index) => (
            <li key={index}>
              {horario.dia}: {horario.hora_inicio} - {horario.hora_fin}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}




          <button type="submit">Registrar</button>
        </form>
      </div>

      {error && (
        <div className="error">
          <span>{error}</span>
        </div>
      )}

    <div className="notification">
      <span>{asignaturaSeleccionada || "Sin materias seleccionadas"}</span>
      <button onClick={handleEliminar}>Eliminar</button>
    </div>

    </div>
  );
};

export default Horario;
