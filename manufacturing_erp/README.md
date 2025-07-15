# Manufacturing ERP System

A comprehensive management system for CNC/VMC machinery manufacturing companies.

## Features
- Employee productivity tracking
- Inventory management
- Sales analysis by district (Tamil Nadu)
- Automated attendance system
- Low stock alerts via WhatsApp

## Setup Instructions

1. **Database Setup**:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p manufacturing_erp < database/sample_data.sql