document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const email = document.getElementById('registerEmail').value;
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => {
            alert('Registration failed. Please try again.');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Logged in successfully');
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            alert('Login failed. Please try again.');
        });
    });

    fetch('/questions')
    .then(response => response.json())
    .then(data => {
        const questionsList = document.getElementById('questionsList');
        data.forEach(question => {
            const div = document.createElement('div');
            div.textContent = `${question.title} - ${question.body}`;
            questionsList.appendChild(div);
        });
    })
    .catch(err => {
        alert('Failed to load questions. Please try again.');
    });

});

