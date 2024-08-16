//fontend/admin-panel.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

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
                <div class="grievance-item">
                    <div class="grievance-header">
                        <h3>${grievance.type}</h3>
                        <div class="status-icon ${grievance.status === 'In Progress' ? 'in-progress' : grievance.status === 'Resolved' ? 'resolved' : ''}"></div>
                    </div>
                    <p>${grievance.description}</p>
                    <p>Submitted by: ${grievance.user.name}</p>
                    ${grievance.supportingDoc ? `<a href="http://localhost:5000/api/grievances/file/${grievance._id}" target="_blank">View Document</a>` : '<p>No supporting document</p>'}
                    <label for="status-select-${grievance._id}">Status:</label>
                    <select id="status-select-${grievance._id}" class="status-select" data-id="${grievance._id}">
                        <option value="Pending" ${grievance.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${grievance.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${grievance.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
            `).join('');

            // Attach event listeners to all status dropdowns
            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', updateStatus);
            });
        })
        .catch(error => {
            console.error('Error fetching grievances:', error);
            alert('An error occurred. Please try again.');
        });
    }
    async function updateStatus(event) {
        const status = event.target.value;
        const id = event.target.getAttribute('data-id');
        const token = localStorage.getItem('authToken'); // Make sure token is available
    
        try {
            const response = await fetch(`http://localhost:5000/api/grievances/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
    
            if (!response.ok) {
                const responseData = await response.text(); // Use text() instead of json() for better debugging
                console.error('Response:', responseData); // Log the actual response
                throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
            }
    
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert(`Failed to update status: ${error.message}`);
        }
    }
    
    
    
});    