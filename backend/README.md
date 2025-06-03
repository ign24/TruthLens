# TruthLens Backend

## Configuración del Entorno

### Opción 1: Usando el script de inicio (Recomendado)
1. Simplemente haz doble clic en `start_server.bat`
2. El servidor se iniciará automáticamente en el puerto 5000

### Opción 2: Activación manual del entorno virtual
1. Abre una terminal en la carpeta `backend`
2. Activa el entorno virtual:
   ```bash
   # En Windows:
   .\venv\Scripts\activate
   
   # En Unix/MacOS:
   source venv/bin/activate
   ```
3. Inicia el servidor:
   ```bash
   python main.py
   ```

## Verificación
- El servidor estará disponible en: http://localhost:5000
- La documentación de la API estará en: http://localhost:5000/docs
- El endpoint de salud estará en: http://localhost:5000/api/v1/health

## Notas
- Asegúrate de tener un archivo `.env` con las variables necesarias
- El servidor debe estar en ejecución para que el frontend funcione correctamente
- Si ves errores de conexión, verifica que el servidor esté corriendo en el puerto 5000

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## API Endpoints

### POST /api/analyze
Analyzes a text for bias and factual accuracy.

Request body:
```json
{
    "input_text": "Your text to analyze here..."
}
```

Response:
```json
{
    "factual_accuracy": 82,
    "bias": "neutral",
    "emotional_tone": "measured",
    "recommendation": "This article appears balanced. Consider checking the sources to confirm accuracy."
}
``` 