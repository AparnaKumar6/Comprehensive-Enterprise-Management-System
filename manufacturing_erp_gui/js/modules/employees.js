// Employee CRUD Operations
document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const employeeForm = document.getElementById('employee-form');
    const modal = document.getElementById('employee-modal');
    
    // Load employee data
    function loadEmployees() {
        fetch('http://localhost:5000/api/employees')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#employees-table tbody');
                tableBody.innerHTML = '';
                
                data.forEach(emp => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${emp.emp_id}</td>
                        <td>${emp.name}</td>
                        <td>${emp.role}</td>
                        <td>${emp.department}</td>
                        <td>₹${emp.salary.toLocaleString()}</td>
                        <td>
                            <button class="btn btn-primary edit-btn" data-id="${emp.emp_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger delete-btn" data-id="${emp.emp_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                
                // Add event listeners to action buttons
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const empId = this.getAttribute('data-id');
                        editEmployee(empId);
                    });
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const empId = this.getAttribute('data-id');
                        if (confirm('Are you sure you want to delete this employee?')) {
                            deleteEmployee(empId);
                        }
                    });
                });
            });
    }
    
    // Add new employee
    addEmployeeBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Add New Employee';
        document.getElementById('emp-id').value = '';
        employeeForm.reset();
        modal.style.display = 'flex';
    });
    
    // Form submission
    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const empId = document.getElementById('emp-id').value;
        const employee = {
            name: document.getElementById('name').value,
            role: document.getElementById('role').value,
            department: document.getElementById('department').value,
            salary: document.getElementById('salary').value,
            contact: document.getElementById('contact').value,
            join_date: document.getElementById('join-date').value
        };
        
        if (empId) {
            // Update existing employee
            updateEmployee(empId, employee);
        } else {
            // Add new employee
            addNewEmployee(employee);
        }
    });
    
    // Helper functions
    function addNewEmployee(employee) {
        fetch('http://localhost:5000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(data => {
            alert('Employee added successfully!');
            modal.style.display = 'none';
            loadEmployees();
        });
    }
    
    function editEmployee(empId) {
        fetch(`http://localhost:5000/api/employees/${empId}`)
            .then(response => response.json())
            .then(employee => {
                document.getElementById('modal-title').textContent = 'Edit Employee';
                document.getElementById('emp-id').value = employee.emp_id;
                document.getElementById('name').value = employee.name;
                document.getElementById('role').value = employee.role;
                // Fill other fields...
                modal.style.display = 'flex';
            });
    }
    
    function updateEmployee(empId, employee) {
        // Similar to addNewEmployee but with PUT method
    }
    
    function deleteEmployee(empId) {
        // Implement DELETE request
    }
    
    // Initial load
    loadEmployees();
});