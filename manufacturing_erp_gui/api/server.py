from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Database connection helper
    def get_db():
        return mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'Aparnasql@612001'),
            database=os.getenv('DB_NAME', 'manufacturing_erp')
        )

    # Health check endpoint
    @app.route('/')
    def home():
        return "Manufacturing ERP System - Flask Backend"

    # Employees API
    @app.route('/api/employees', methods=['GET', 'POST'])
    def handle_employees():
        conn = None
        cursor = None
        try:
            conn = get_db()
            cursor = conn.cursor(dictionary=True)

            if request.method == 'GET':
                cursor.execute("SELECT * FROM employees")
                employees = cursor.fetchall()
                return jsonify(employees)

            elif request.method == 'POST':
                data = request.json
                cursor.execute("""
                    INSERT INTO employees (name, role, department, salary, contact, join_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    data['name'],
                    data['role'],
                    data.get('department', ''),
                    data['salary'],
                    data.get('contact', ''),
                    data.get('join_date', datetime.now().date())
                ))
                conn.commit()
                return jsonify({"message": "Employee added successfully", "id": cursor.lastrowid}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    # Products API
    @app.route('/api/products', methods=['GET'])
    def get_products():
        conn = None
        cursor = None
        try:
            conn = get_db()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
            return jsonify(products)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    # Sales API
    @app.route('/api/sales', methods=['GET'])
    def get_sales():
        conn = None
        cursor = None
        try:
            conn = get_db()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT s.sale_id, c.name as customer_name, p.name as product_name, 
                       s.quantity, s.sale_date, s.payment_status
                FROM sales s
                JOIN customers c ON s.customer_id = c.customer_id
                JOIN products p ON s.product_id = p.product_id
            """)
            sales = cursor.fetchall()
            return jsonify(sales)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    return app