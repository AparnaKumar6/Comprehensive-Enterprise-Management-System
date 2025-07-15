from sqlalchemy import create_engine
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

def get_db_engine():
    """Create and return a SQLAlchemy database engine"""
    load_dotenv()
    
    db_user = os.getenv('DB_USER', 'root')
    db_pass = quote_plus(os.getenv('DB_PASSWORD', ''))
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = int(os.getenv('DB_PORT', '3306'))
    db_name = os.getenv('DB_NAME', '')
    
    connection_string = f"mysql+mysqlconnector://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
    
    engine = create_engine(
        connection_string,
        connect_args={
            'connect_timeout': 10,
            'auth_plugin': 'mysql_native_password',
            'use_pure': True
        },
        pool_pre_ping=True
    )
    return engine
