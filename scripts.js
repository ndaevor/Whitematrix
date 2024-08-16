//fontend /script.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    // Handle Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            try {
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    
                    if (result.isAdmin) {
                        window.location.href = 'admin-panel.html'; // Redirect to admin panel if admin
                    } else {
                        window.location.href = 'home.html'; // Redirect to user home page
                    }
                } else {
                    alert(result.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Handle Registration
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const result = await response.json();
                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    alert(result.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error registering:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Handle User Homepage
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        if (!token) {
            console.log('No token found, redirecting to login.');
            window.location.href = 'login.html';
            return;
        }

        fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) throw new Error('Invalid token or user not found');
            return response.json();
        })
        .then(user => {
            usernameElement.textContent = user.name;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        });
    }

    // Handle Grievance Submission
    const grievanceForm = document.getElementById('grievance-form');
    if (grievanceForm) {
        grievanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('type').value;
            const description = document.getElementById('description').value;
            const fileInput = document.getElementById('supportingDoc');
            const formData = new FormData();
            formData.append('type', type);
            formData.append('description', description);
            if (fileInput.files.length > 0) {
                formData.append('supportingDoc', fileInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:5000/api/grievances/submit', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Grievance submitted successfully');
                    window.location.href = 'home.html';
                } else {
                    alert(result.message || 'Failed to submit grievance. Please try again.');
                }
            } 
            catch (error) {
                console.error('Error submitting grievance:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Handle My Grievances Page
    const grievancesContainer = document.getElementById('grievances-container');
    if (grievancesContainer) {
        if (!token) {
            console.log('No token found, redirecting to login.');
            window.location.href = 'login.html';
            return;
        }

        fetch('http://localhost:5000/api/grievances/my-grievances', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching grievances');
            return response.json();
        })
        .then(grievances => {
            grievancesContainer.innerHTML = grievances.map(grievance => `
                <div class="item">
                    <h3>${grievance.type}</h3>
                    <p>${grievance.description}</p>
                    <p class="status">Status: ${grievance.status}</p>
                    ${grievance.supportingDoc ? `<a href="http://localhost:5000/api/grievances/file/${grievance._id}" target="_blank">View Document</a>` : '<p>No supporting document</p>'}
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching grievances:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Handle Admin Panel
    const adminGrievancesContainer = document.getElementById('admin-grievances-container');
    if (adminGrievancesContainer) {
        if (!token) {
            console.log('No token found, redirecting to login.');
            window.location.href = 'login.html';
            return;
        }

        fetch('http://localhost:5000/api/grievances/admin/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching grievances');
            return response.json();
        })
        .then(grievances => {
            adminGrievancesContainer.innerHTML = grievances.map(grievance => `
                <div>
                    <h3>${grievance.type}</h3>
                    <p>${grievance.description}</p>
                    <p>Submitted by: ${grievance.user.name}</p>
                    ${grievance.supportingDoc ? `<a href="http://localhost:5000/api/grievances/file/${grievance._id}" target="_blank">View Document</a>` : '<p>No supporting document</p>'}
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching grievances:', error);
            alert('An error occurred. Please try again.');
        });
    }
});
