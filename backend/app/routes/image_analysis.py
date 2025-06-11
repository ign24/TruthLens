from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import numpy as np
import io
import base64
from typing import List
import piexif
import logging
from ..services.image_analysis import analyze_image_spectrum, extract_metadata
from ..services.openai_service import OpenAIService

router = APIRouter()
openai_service = OpenAIService()
logger = logging.getLogger("image_analysis")

@router.post("/analyze_image")
async def analyze_image(image: UploadFile = File(...)):
    try:
        logger.info(f"[ImageAnalysis] Imagen recibida: filename={image.filename}, content_type={image.content_type}")
        # Read and validate image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        logger.info(f"[ImageAnalysis] Imagen cargada y abierta correctamente. Tamaño: {img.size}, Modo: {img.mode}")
        
        # Convert image to base64 for GPT-4
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        logger.info(f"[ImageAnalysis] Imagen convertida a base64 para OpenAI. Bytes: {len(img_base64)}")
        
        # Generate spectrum
        spectrum = analyze_image_spectrum(img)
        spectrum_buffered = io.BytesIO()
        spectrum.save(spectrum_buffered, format="PNG")
        spectrum_base64 = base64.b64encode(spectrum_buffered.getvalue()).decode()
        logger.info(f"[ImageAnalysis] Espectro FFT generado y convertido a base64. Bytes: {len(spectrum_base64)}")
        
        # Extract metadata
        metadata = extract_metadata(img)
        logger.info(f"[ImageAnalysis] Metadata extraída: {metadata}")
        
        # Analyze with GPT-4
        logger.info(f"[ImageAnalysis] Enviando imagen, espectro y metadata a OpenAI...")
        analysis = await openai_service.analyze_with_gpt4(
            original_image=img_base64,
            spectrum_image=spectrum_base64,
            metadata=metadata
        )
        logger.info(f"[ImageAnalysis] Respuesta recibida de OpenAI: {analysis}")
        
        return analysis
        
    except Exception as e:
        logger.error(f"[ImageAnalysis] Error en el análisis de imagen: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 