import React, { useState,useEffect  } from 'react';
import './Formulario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import marcoantoniosolis from './images/marcoantoniosolis.png';

const Horario = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [AsignaturaParaEliminar, setAsignaturaParaEliminar] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [numeroAsignatura, setNumeroAsignatura] = useState('');
  const [numeroEstudiante, setNumeroEstudiante] = useState('');
  const [size, setSize] = useState(1);
  const [estudiante, setEstudiante] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');
  const [asignaturaNombre, setAsignaturaNombre] = useState('');
  const [docenteNombre, setDocenteNombre] = useState('');
  const [docenteId, setDocenteId] = useState('');  const [estudianteNombre, setEstudianteNombre] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [materiasRegistradas, setMateriasRegistradas] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(true);
  const [horarioColoreado, setHorarioColoreado] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
  const [loadingAsignatura, setLoadingAsignatura] = useState(false); 
  const [loadingEstudiante, setLoadingEstudiante] = useState(false);
  const [asignaturas, setAsignaturas] = useState([]);
  const [alumno, setAlumno] = useState("");
  const [horaInicioH, SethoraInicioH] = useState("");
  const [horaFinH, SethoraFinH] = useState("");
  const [nombreDocente, setNombreDocente] = useState("");
  const [dia, setDia] = useState("");
  const [nombreAsignatura, setNombreAsignatura] = useState("");


  const cerrarAnuncio = () => {
    setExito(false); 
    setError(false);
  };

  useEffect(() => {
    getAsignaturas();
  
    if (exito) {
      const timerExito = setTimeout(() => {
        setExito(false);
      }, 3000);
      return () => clearTimeout(timerExito);
    }
  
    if (error) {
      const timerError = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timerError);
    }
  }, [exito, error]);

  const handleSelection = (e) => {
    setAsignatura(e.target.value); 
    setSize(1); 
    setTimeout(() => {
      document.getElementById('asignatura').blur();
    }, 0);
  };

  const Eliminar = async (nombre) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get_asignatura_by_nombre/?nombre=${nombre}`);

      if (!response.ok) {
        throw new Error('Error al obtener los horarios disponibles');
      }
  
      const data = await response.json();

    if (data && data.id_asignatura) {
      const idAsignatura = data.id_asignatura;

      setAsignaturaParaEliminar(idAsignatura);
    } else {
  console.log('Error');
}
    } catch (error) {
      console.error('Error', error);
    }
  };

  const getHorariosDisponibles = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/obtener_horario_idMateria/?asignatura_id=${asignatura}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los horarios disponibles');
      }
  
      const data = await response.json();
  
      if (data.length > 0) {
        const { 
          nombre_asignatura, 
          nombre_docente, 
          dia, 
          hora_inicio, 
          hora_fin 
        } = data[0]; 

        setNombreAsignatura(nombre_asignatura);
        setNombreDocente(nombre_docente);
        setDia(dia);
        SethoraInicioH(hora_inicio);
        SethoraFinH(hora_fin);

      } else {
        console.log('No hay horarios disponibles.');
      }
    } catch (error) {
      console.error('Error al obtener los horarios:', error);
    }
  };
  
  

  const getAsignaturas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/asignaturas/');
      if (!response.ok) {
        throw new Error('Error al obtener las asignaturas');
      }
      const data = await response.json();
      const asignaturasFiltradas = data.map(item => ({
        id: item.id_asignatura,
        nombre: item.nombre
      }));
      setAsignaturas(asignaturasFiltradas); 
      setLoading(false); 
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } 
  };

  const handleSearchEstudiante = async () => {
    try {
      const id = numeroEstudiante; 
  
      const response = await fetch(`http://127.0.0.1:8000/api/get_alumno_by_id/?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
      if (result) {
        const nombre = result.nombre + " " + result.apellido;
        setAlumno(nombre); 
      } else {
        console.log("No se encontró al estudiante.");
        setAlumno(null);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  const estudianteId = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/estudianteId/?id=${numeroEstudiante}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      if (result && result.length > 0) {
        const nuevoHorario = result.flatMap((item) => {
          const horaInicio = parseInt(item.hora_inicio.split(":")[0]); 
          const horaFin = parseInt(item.hora_fin.split(":")[0]); 
          const filas = []; 
  
         
          for (let hora = horaInicio; hora < horaFin; hora++) {
            filas.push({
              dia: item.dia,
              fila: hora - 7, 
              color: "#4CAF50",
              nombre: item.asignatura,
            });
          }
  
          return filas; 
        });
  
        setHorarioColoreado(nuevoHorario);
      } else {
        console.log("No se encontró al estudiante.");
        setHorarioColoreado([]);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };  

  const handleEliminar = async (e) => {
    try {
      const data = {
        asignatura_id: AsignaturaParaEliminar,
        alumno_id: numeroEstudiante
      };
  
      const response = await fetch("http://127.0.0.1:8000/api/eliminar_inscripcion/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        console.log("Datos eliminados con éxito:");
      } else {
        console.error("Error al eliminar los datos:");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }

    estudianteId();
  };

  const registrarHorario = async (e) => {
    try {
      const data = {
        id_asignatura: asignatura,
        id_alumno: numeroEstudiante
      };
  
      const response = await fetch("http://127.0.0.1:8000/api/registrar_inscripcion/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        setExito('Enviado con exito');
        console.log("Datos enviados con éxito:", await response.json());
      } else {
        setError('La Materia se superpone con otra');
        console.error("Error al enviar los datos:", response.status);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleColorearHorario = (horariosData, nombre) => {
    const colores = ['#FF8C42', '#6A5ACD', '#40E0D0', '#FF69B4', '#32CD32', '#FFD700', '#FF4500'];
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];

    const conflicto = horariosData.some((horario) => {
      const dia = horario.dia;
      const horaInicio = parseInt(horario.hora_inicio.split(':')[0]);
      const horaFin = parseInt(horario.hora_fin.split(':')[0]);

      for (let i = horaInicio; i < horaFin; i++) {
        const fila = i - 7;
        if (fila >= 0 && fila < 14) {
          if (horarioColoreado.some(celda => celda.fila === fila && celda.dia === dia)) {
            return true;
          }
        }
      }
      return false;
    });

    if (conflicto) {
      setError('No se puede registrar la materia, el horario no está disponible.');
      return;
    }

    const coloreados = horariosData.map((horario) => {
      const dia = horario.dia;
      const horaInicio = parseInt(horario.hora_inicio.split(':')[0]);
      const horaFin = parseInt(horario.hora_fin.split(':')[0]);

      const celdasAColorear = [];
      for (let i = horaInicio; i < horaFin; i++) {
        const fila = i - 7;
        if (fila >= 0 && fila < 14) {
          celdasAColorear.push({ fila, dia, nombre, color: colorAleatorio });
        }
      }
      return celdasAColorear;
    });

    setHorarioColoreado((prevHorario) => [...prevHorario, ...coloreados.flat()]);
    setError('');
  };

  
  

  const handleRegistro = (e) => {
    e.preventDefault();
  
    
  };
  
  
  return (
    <div className="container">
      <div>

      <table className="schedule" border="1">
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
              <td>
                {7 + i}-{8 + i}
              </td>
              {[...Array(6)].map((_, j) => {
                const dia = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][j];
                const isColoreado = horarioColoreado.some(
                  (celda) => celda.fila === i && celda.dia === dia
                );
                return (
                  <td
                    key={j}
                    style={{
                      backgroundColor: isColoreado
                        ? horarioColoreado.find(
                            (celda) => celda.fila === i && celda.dia === dia
                          ).color
                        : "",
                      color: isColoreado ? "white" : "",
                      cursor: isColoreado ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (isColoreado) {
                        const asignaturaSeleccionada = horarioColoreado.find(
                          (celda) => celda.fila === i && celda.dia === dia
                        );
                        alert(
                          `Asignatura: ${asignaturaSeleccionada.nombre}\nDía: ${asignaturaSeleccionada.dia}\nHora: ${
                            7 + asignaturaSeleccionada.fila
                          }:00 - ${8 + asignaturaSeleccionada.fila}:00`
                        );
                        Eliminar(asignaturaSeleccionada.nombre);
                      }
                    }}
                  >
                    {isColoreado
                      ? horarioColoreado.find(
                          (celda) => celda.fila === i && celda.dia === dia
                        ).nombre
                      : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>


      <div className="imagen">
        <img src={marcoantoniosolis} alt="Footer" className="fot" />
      </div>

      <div className="form-container">
  <h2>Sistema de Gestión de Asignaturas</h2>
  <form onSubmit={handleRegistro}>
    <label htmlFor="asignatura">Asignatura</label>
    <select
      className="form-select selectl"
      id="asignatura"
      value={asignatura}
      size={size}
      onFocus={() => setSize(4)} 
      onBlur={() => setSize(1)} 
      onChange={(e) => handleSelection(e)}
    >
      <option value="">Selecciona una asignatura</option>
      {asignaturas.map((asignaturaItem) => (
        <option key={asignaturaItem.id} value={asignaturaItem.id}>
          {asignaturaItem.nombre}
        </option>
      ))}
    </select>

    <label htmlFor="numero-asignatura">Número de asignatura:</label>
      <input
        type="text"
        id="numero-asignatura"
        value={asignatura || ""} 
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
      value={alumno || ""}
      readOnly
    />

    {asignaturaNombre && docenteNombre && (
      <div className="asignatura-cuadro">

        <p
          className="clickable resaltado"
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

          <button onClick={getHorariosDisponibles} className='boton_registrar'>Consultar horarios</button>
          <button onClick={estudianteId} className='refrescar'>Refrescar Horario</button>
          <button onClick={registrarHorario} className='actualizar'>
            Registrar Horarios
          </button>

        </form>
      </div>

      {error && (
        <div className="error">
          La Materia se superpone con otra
        <span className="icono-x" onClick={cerrarAnuncio}>
            X
        </span>
        </div>
      )}

      {exito && (
        <div className="exito">
        ¡Ha sido registrada la inscripcion!
        <span className="icono-x" onClick={cerrarAnuncio}>
            X
        </span>
        </div>
      )}

      <div className="notification">
        <span>{asignaturaSeleccionada || "Sin materias seleccionadas"}</span>
        <button onClick={handleEliminar}>Eliminar</button>
      </div>

      <div className="asignatura-cuadro">
      <p><strong>Nombre:</strong> {nombreAsignatura}</p>
      <p><strong>Docente:</strong> {nombreDocente}</p>
      <p><strong>Día:</strong> {dia}</p>
      <p><strong>Hora de inicio:</strong> {horaInicioH}</p>
      <p><strong>Hora de fin:</strong> {horaFinH}</p>
      </div>


    </div>
    
  );
};

export default Horario;
