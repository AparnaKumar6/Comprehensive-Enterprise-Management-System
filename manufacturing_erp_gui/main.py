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

# API Endpoint: Get all employees
@app.route('/api/employees', methods=['GET'])
def get_employees():
    return jsonify(employees)

# API Endpoint: Add new employee
@app.route('/api/employees', methods=['POST'])
def add_employee():
    new_employee = request.json  # Data sent from frontend
    employees.append(new_employee)
    return jsonify({"message": "Employee added successfully!"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Not just '127.0.0.1'