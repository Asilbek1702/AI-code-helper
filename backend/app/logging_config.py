"""Logging configuration."""

import logging
from logging.handlers import RotatingFileHandler
import os

# Create logs directory
os.makedirs("logs", exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)

# File handler
file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=10 * 1024 * 1024,  # 10MB
    backupCount=5,
)
file_handler.setLevel(logging.DEBUG)
file_formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
)
file_handler.setFormatter(file_formatter)

# Add file handler to root logger
root_logger = logging.getLogger()
root_logger.addHandler(file_handler)

# Get logger for this module
logger = logging.getLogger(__name__)
