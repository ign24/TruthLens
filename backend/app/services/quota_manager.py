import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional
from ..core.config import settings

logger = logging.getLogger(__name__)

class QuotaManager:
    """
    Gestor de cuotas diarias por IP para prevenir abuso de la API
    """
    
    def __init__(self):
        self.daily_usage: Dict[str, int] = {}
        self.monthly_usage: Dict[str, int] = {}
        self.last_cleanup = datetime.now()
        self.max_daily_requests = settings.MAX_DAILY_REQUESTS
        
    async def check_quota(self, ip: str, request_type: str = "analysis") -> bool:
        """
        Verificar si el IP puede hacer más requests
        
        Args:
            ip: IP del cliente
            request_type: Tipo de request (analysis, chat, etc.)
            
        Returns:
            bool: True si puede hacer el request, False si excedió la cuota
        """
        try:
            now = datetime.now()
            
            # Limpiar datos antiguos cada día
            if (now - self.last_cleanup).days >= 1:
                await self._cleanup_old_data()
            
            # Crear clave para el día actual
            daily_key = f"{ip}_{now.strftime('%Y-%m-%d')}"
            
            # Verificar límite diario
            current_usage = self.daily_usage.get(daily_key, 0)
            
            if current_usage >= self.max_daily_requests:
                logger.warning(f"Daily quota exceeded for IP {ip}: {current_usage} requests")
                return False
            
            # Incrementar contador
            self.daily_usage[daily_key] = current_usage + 1
            
            logger.info(f"Quota check passed for IP {ip}: {current_usage + 1}/{self.max_daily_requests}")
            return True
            
        except Exception as e:
            logger.error(f"Error checking quota for IP {ip}: {e}")
            # En caso de error, permitir el request para no bloquear usuarios legítimos
            return True
    
    async def get_quota_info(self, ip: str) -> Dict[str, any]:
        """
        Obtener información de cuota para un IP específico
        
        Args:
            ip: IP del cliente
            
        Returns:
            Dict con información de cuota
        """
        try:
            now = datetime.now()
            daily_key = f"{ip}_{now.strftime('%Y-%m-%d')}"
            current_usage = self.daily_usage.get(daily_key, 0)
            
            return {
                "ip": ip,
                "daily_usage": current_usage,
                "daily_limit": self.max_daily_requests,
                "remaining": max(0, self.max_daily_requests - current_usage),
                "reset_time": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting quota info for IP {ip}: {e}")
            return {
                "ip": ip,
                "daily_usage": 0,
                "daily_limit": self.max_daily_requests,
                "remaining": self.max_daily_requests,
                "error": str(e)
            }
    
    async def _cleanup_old_data(self):
        """
        Limpiar datos de uso antiguos para ahorrar memoria
        """
        try:
            cutoff_date = datetime.now() - timedelta(days=7)
            keys_to_remove = []
            
            for key in self.daily_usage.keys():
                try:
                    # Extraer fecha de la clave (formato: IP_YYYY-MM-DD)
                    date_str = key.split('_')[1]
                    key_date = datetime.strptime(date_str, '%Y-%m-%d')
                    
                    if key_date < cutoff_date:
                        keys_to_remove.append(key)
                        
                except (ValueError, IndexError):
                    # Si no se puede parsear la fecha, eliminar la clave
                    keys_to_remove.append(key)
            
            # Eliminar claves antiguas
            for key in keys_to_remove:
                del self.daily_usage[key]
            
            self.last_cleanup = datetime.now()
            logger.info(f"Cleaned up {len(keys_to_remove)} old quota entries")
            
        except Exception as e:
            logger.error(f"Error during quota cleanup: {e}")
    
    def get_quota_stats(self) -> Dict[str, any]:
        """
        Obtener estadísticas generales de cuotas
        
        Returns:
            Dict con estadísticas de cuotas
        """
        try:
            now = datetime.now()
            today_key = now.strftime('%Y-%m-%d')
            
            # Contar requests de hoy
            today_requests = 0
            active_ips = set()
            
            for key, count in self.daily_usage.items():
                if today_key in key:
                    today_requests += count
                    ip = key.split('_')[0]
                    active_ips.add(ip)
            
            return {
                "total_requests_today": today_requests,
                "active_ips_today": len(active_ips),
                "total_quota_entries": len(self.daily_usage),
                "last_cleanup": self.last_cleanup.isoformat(),
                "max_daily_requests_per_ip": self.max_daily_requests
            }
            
        except Exception as e:
            logger.error(f"Error getting quota stats: {e}")
            return {"error": str(e)}
    
    async def reset_quota(self, ip: str) -> bool:
        """
        Resetear cuota para un IP específico (útil para testing)
        
        Args:
            ip: IP del cliente
            
        Returns:
            bool: True si se reseteó correctamente
        """
        try:
            now = datetime.now()
            daily_key = f"{ip}_{now.strftime('%Y-%m-%d')}"
            
            if daily_key in self.daily_usage:
                del self.daily_usage[daily_key]
                logger.info(f"Quota reset for IP {ip}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error resetting quota for IP {ip}: {e}")
            return False 