import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from supabase import create_client, Client
from django.http import JsonResponse
from datetime import datetime
from django.db import connection
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@api_view(['DELETE'])
def eliminar_inscripcion(request):
    try:
        asignatura_id = request.data.get('asignatura_id')
        alumno_id = request.data.get('alumno_id')
        
        if not asignatura_id or not alumno_id:
            return Response({"error": "ID de la asignatura y del alumno son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        response = supabase.table("inscripcion").delete().eq("id_asignatura", asignatura_id).eq("id_alumno", alumno_id).execute()

        if response.data:
            return Response({"message": "Inscripción eliminada correctamente"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No se encontró la inscripción para eliminar"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def estudianteId(request):
    try:
        id_alumno = request.query_params.get('id')
        print(id_alumno)
        response = supabase.rpc("get_student_schedule", {"p_id_alumno": id_alumno}).execute()

        if response.data is None:
            return Response({"error": "No se encontraron datos para este alumno"}, status=404)

        return Response(response.data, status=200)
    
    
    except Exception as e:
        return Response({"error": "Ocurrió un error inesperado", "details": str(e)}, status=500)

@api_view(['GET'])
def obtener_horario_idMateria(request):
    try:
        asignatura_id = request.query_params.get('asignatura_id')  
        print(asignatura_id)
        if not asignatura_id:
            return Response({"error": "ID de la asignatura es requerida"}, status=status.HTTP_400_BAD_REQUEST)

        response = supabase.rpc("get_horario_asignatura", {"asignatura_id": asignatura_id}).execute()

        if response.data:
            return Response(response.data, status=status.HTTP_200_OK)  
        else:
            return Response({"error": "Asginatura no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_alumno_by_id(request):
    try:
        alumno_id = request.GET.get('id')  
        if not alumno_id:
            return Response({"error": "ID del alumno es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        response = supabase.table("alumno").select("*").eq("id_alumno", alumno_id).execute()

        if response.data:
            return Response(response.data[0], status=status.HTTP_200_OK)  
        else:
            return Response({"error": "Alumno no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def test_view(request):
    """Endpoint de prueba para verificar que el API está funcionando."""
    return Response({"message": "Test successful"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_course_registration(request):
    if request.method == 'POST':
        data = request.data
        try:
            nombre_asignatura = data.get('nombre') 

            response = supabase.table('asignatura').select('id_asignatura').eq('nombre', nombre_asignatura).execute()

            if response.data: 
                return Response({"id_asignatura": response.data[0]['id_asignatura']}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Asignatura no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_asignaturas(request):
    
    try:
        response = supabase.table("asignatura").select("*").execute()

        if response.data:
            return Response(response.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No data found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_asignatura_by_nombre(request):
    nombre_asignatura = request.query_params.get('nombre')
    if not nombre_asignatura:
        return Response({"error": "Nombre de asignatura no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        asignatura_response = supabase.table("asignatura").select("id_asignatura").ilike("nombre", nombre_asignatura).execute()

        
        if asignatura_response.data:
            id_asignatura = asignatura_response.data[0]['id_asignatura']
        else:
            return JsonResponse({"error": "Asignatura no encontrada"}, status=404)

        docentes_response = supabase.table("asignacion_docente").select("id_docente").eq("id_asignatura", id_asignatura).execute()
        
        docentes = []
        for docente in docentes_response.data:
            docente_info = supabase.table("docente").select("nombre, apellido").eq("id_docente", docente['id_docente']).execute()
            if docente_info.data:
                docentes.append({
                    "id_docente": docente['id_docente'],
                    "nombre": docente_info.data[0]['nombre'],
                    "apellido": docente_info.data[0]['apellido']
                })

        horarios_response = supabase.table("horario").select("dia, hora_inicio, hora_fin").eq("id_asignatura", id_asignatura).execute()
        horarios = [{"dia": h['dia'], "hora_inicio": h['hora_inicio'], "hora_fin": h['hora_fin']} for h in horarios_response.data]

        return JsonResponse({"id_asignatura": id_asignatura, "docentes": docentes, "horarios": horarios}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
from rest_framework.response import Response
from rest_framework.decorators import api_view
    
@api_view(['POST'])
def registrar_inscripcion(request):
    id_alumno = request.data.get('id_alumno')
    id_asignatura = request.data.get('id_asignatura')

    if not id_alumno or not id_asignatura:
        return Response({"error": "ID del estudiante y ID de la asignatura son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Llamar al RPC en Supabase
        response_rpc = supabase.rpc('insertar_inscripcion', {
            "p_id_alumno": id_alumno,
            "p_id_asignatura": id_asignatura
        }).execute()

        # Verificar si la llamada fue exitosa
        if response_rpc.data is None:
            return Response({"error": "No se encontraron datos para este alumno"}, status=404)

        # Devolver los datos en formato JSON
        return Response({"OK": "Se registro correctamente"}, status=200)
    
    
    
    except Exception as e:
        return Response({"error": "Ocurrió un error inesperado", "details": str(e)}, status=500)