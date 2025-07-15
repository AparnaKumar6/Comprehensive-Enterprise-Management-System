// ======================
// Global Variables
// ======================
const API_BASE_URL = 'http://localhost:5000/api';
let currentEditingId = null;

// ======================
// DOM Elements
// ======================
const employeeTable = document.getElementById('employees-table');
const employeeForm = document.getElementById('employee-form');
const modal = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const formSubmitBtn = document.getElementById('form-submit-btn');

// ======================
// Helper Functions
// ======================

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ======================
// API Functions
// ======================

// Fetch all employees
async function fetchEmployees() {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    showNotification('Failed to load employees', 'error');
    return [];
  }
}

// Add new employee
async function addEmployee(employeeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    });
    
    if (!response.ok) throw new Error('Failed to add employee');
    return await response.json();
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
}

// Update employee
async function updateEmployee(id, employeeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    });
    
    if (!response.ok) throw new Error('Failed to update employee');
    return await response.json();
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

// Delete employee
async function deleteEmployee(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete employee');
    return await response.json();
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// ======================
// UI Functions
// ======================

// Render employees table
function renderEmployees(employees) {
  const tbody = employeeTable.querySelector('tbody');
  tbody.innerHTML = '';

  employees.forEach(emp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${emp.emp_id}</td>
      <td>${emp.name}</td>
      <td>${emp.role}</td>
      <td>${emp.department || 'N/A'}</td>
      <td>₹${emp.salary.toLocaleString()}</td>
      <td>${formatDate(emp.join_date)}</td>
      <td class="actions">
        <button class="btn edit-btn" data-id="${emp.emp_id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn delete-btn" data-id="${emp.emp_id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Add event listeners to action buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditForm(btn.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
  });
}

// Open modal for adding/editing
function openEditForm(employeeId = null) {
  currentEditingId = employeeId;
  
  if (employeeId) {
    modalTitle.textContent = 'Edit Employee';
    formSubmitBtn.textContent = 'Update';
    populateForm(employeeId);
  } else {
    modalTitle.textContent = 'Add New Employee';
    formSubmitBtn.textContent = 'Save';
    employeeForm.reset();
  }
  
  modal.style.display = 'block';
}

// Populate form with employee data
async function populateForm(employeeId) {
  try {
    const employees = await fetchEmployees();
    const employee = employees.find(emp => emp.emp_id == employeeId);
    
    if (employee) {
      document.getElementById('name').value = employee.name;
      document.getElementById('role').value = employee.role;
      document.getElementById('department').value = employee.department || '';
      document.getElementById('salary').value = employee.salary;
      document.getElementById('contact').value = employee.contact || '';
      document.getElementById('join-date').value = employee.join_date || '';
    }
  } catch (error) {
    console.error('Error populating form:', error);
    showNotification('Failed to load employee data', 'error');
  }
}

// Confirm before deletion
async function confirmDelete(employeeId) {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await deleteEmployee(employeeId);
      showNotification('Employee deleted successfully');
      loadEmployees();
    } catch (error) {
      showNotification('Failed to delete employee', 'error');
    }
  }
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
  currentEditingId = null;
}

// ======================
// Event Handlers
// ======================

// Form submission
employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    role: document.getElementById('role').value,
    department: document.getElementById('department').value,
    salary: parseFloat(document.getElementById('salary').value),
    contact: document.getElementById('contact').value,
    join_date: document.getElementById('join-date').value || new Date().toISOString().split('T')[0]
  };

  try {
    if (currentEditingId) {
      await updateEmployee(currentEditingId, formData);
      showNotification('Employee updated successfully');
    } else {
      await addEmployee(formData);
      showNotification('Employee added successfully');
    }
    
    closeModal();
    loadEmployees();
  } catch (error) {
    showNotification(`Failed to ${currentEditingId ? 'update' : 'add'} employee`, 'error');
  }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ======================
// Initialization
// ======================

// Load employees when page loads
async function loadEmployees() {
  const employees = await fetchEmployees();
  renderEmployees(employees);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  
  // Add event listener to "Add Employee" button
  document.getElementById('add-employee-btn').addEventListener('click', () => openEditForm());
  
  // Add event listener to modal close button
  document.querySelector('.close-btn').addEventListener('click', closeModal);
});