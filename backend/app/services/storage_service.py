from typing import Dict, Optional
import json
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.storage_dir = "backend/app/data/temp"
        os.makedirs(self.storage_dir, exist_ok=True)
        self.current_article_id = None

    def save_article(self, text: str, analysis: Optional[Dict] = None) -> str:
        """Guarda el artículo y su análisis, retorna el ID del artículo."""
        article_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.current_article_id = article_id
        
        data = {
            "text": text,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
        
        file_path = os.path.join(self.storage_dir, f"{article_id}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Artículo guardado con ID: {article_id}")
        return article_id

    def get_article(self, article_id: Optional[str] = None) -> Optional[Dict]:
        """Obtiene el artículo y su análisis por ID."""
        if article_id is None:
            article_id = self.current_article_id
        
        if article_id is None:
            return None
            
        file_path = os.path.join(self.storage_dir, f"{article_id}.json")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Artículo no encontrado: {article_id}")
            return None

    def get_current_article(self) -> Optional[Dict]:
        """Obtiene el artículo actual."""
        return self.get_article(self.current_article_id)

    def clear_old_articles(self, max_age_hours: int = 24):
        """Limpia artículos más antiguos que max_age_hours."""
        current_time = datetime.now()
        for filename in os.listdir(self.storage_dir):
            if not filename.endswith('.json'):
                continue
                
            file_path = os.path.join(self.storage_dir, filename)
            file_time = datetime.fromtimestamp(os.path.getctime(file_path))
            age_hours = (current_time - file_time).total_seconds() / 3600
            
            if age_hours > max_age_hours:
                try:
                    os.remove(file_path)
                    logger.info(f"Artículo antiguo eliminado: {filename}")
                except Exception as e:
                    logger.error(f"Error al eliminar artículo {filename}: {str(e)}") 