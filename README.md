# TruthLens

TruthLens es una aplicación para analizar noticias y detectar sesgos en el contenido.

## Requisitos Previos

- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn

## Configuración del Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Crea un entorno virtual e instala las dependencias:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configura las variables de entorno:
- Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:
```
OPENAI_API_KEY=tu_clave_api
SERPER_API_KEY=tu_clave_api
ELEVENLABS_API_KEY=tu_clave_api
AGENT_ID=tu_id_agente
```

4. Inicia el servidor backend:
```bash
uvicorn main:app --reload --port 5000
```

## Configuración del Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Documentación API: http://localhost:5000/docs

## Estructura del Proyecto

```
.
├── backend/           # Servidor FastAPI
│   ├── app/          # Código fuente del backend
│   ├── requirements.txt
│   └── .env         # Variables de entorno (no incluido en git)
├── frontend/         # Aplicación React
│   ├── src/         # Código fuente del frontend
│   └── package.json
└── README.md
```

## Notas Importantes

- No incluir archivos sensibles en el repositorio
- Mantener las variables de entorno seguras y no compartirlas
- Los archivos temporales y dependencias están excluidos del control de versiones 