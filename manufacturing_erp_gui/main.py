from flask import Flask, jsonify, request
from flask_cors import CORS  # Important for frontend-backend communication
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow all origins (for development only)

# Sample data - replace with real database later
employees = [
    {"emp_id": 1, "name": "John Doe", "role": "Engineer", "salary": 50000},
    {"emp_id": 2, "name": "Jane Smith", "role": "Manager", "salary": 75000}
]

# API Endpoint: Get all employees continuee....
