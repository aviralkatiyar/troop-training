function refreshLeaderboard() {
    tbody.innerHTML = '';
    fetch('/leaderboard')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.username}</td>
                    <td>${entry.score}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch((error) => console.error('Error fetching leaderboard data:', error));
}

// Event listener for login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then((response) => {
        if (response.status === 200) {
            // Successfully logged in, display the update score form
            loginForm.style.display = 'none';
            updateScoreForm.style.display = 'block';
        } else {
            // Handle login error response here
            console.error('Login failed:', response.statusText);
        }
    })
    .catch((error) => console.error('Error during login:', error));
});

// Event listener for update score form submission
updateScoreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const score = document.getElementById('score').value;

    const requestBody = {
        score: parseInt(score)
    };

    fetch('/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then((response) => {
        if (response.status === 200) {
            // Score updated successfully, refresh the leaderboard
            refreshLeaderboard();
        } else {
            // Handle error response here
            console.error('Error updating score:', response.statusText);
        }
    })
    .catch((error) => console.error('Error updating score:', error));
});

// Call refreshLeaderboard when the page loads to display the initial leaderboard
window.addEventListener('load', refreshLeaderboard);
