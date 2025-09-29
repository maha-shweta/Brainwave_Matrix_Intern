document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if(users.some(u => u.username === username)){
        alert("Username already exists! Choose another.");
        return;
    }

    users.push({username, password});
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login page...");
    window.location.href = 'login.html';
});
