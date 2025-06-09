import os
from dotenv import load_dotenv
from pathlib import Path

# Cargar el .env desde la carpeta backend
load_dotenv(str(Path(__file__).resolve().parent / ".env"))

def check_env_vars():
    # Lista de variables requeridas (solo las claves de API)
    required_vars = [
        "OPENAI_API_KEY",
        "SERPER_API_KEY",
        "ELEVENLABS_API_KEY"
    ]
    
    print("=== Verificación de variables de entorno ===")
    print("\nVariables requeridas:")
    
    all_present = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mostrar solo los primeros 4 caracteres de la clave por seguridad
            masked_value = value[:4] + "..." if len(value) > 4 else "***"
            print(f"✅ {var}: {masked_value}")
        else:
            print(f"❌ {var}: No encontrada")
            all_present = False
    
    if not all_present:
        print("\n⚠️  Faltan algunas variables de entorno requeridas.")
        print("Por favor, asegúrate de que tu archivo .env contenga todas las variables necesarias.")
    else:
        print("\n✅ Todas las variables requeridas están presentes.")

if __name__ == "__main__":
    check_env_vars() 