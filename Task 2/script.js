document.addEventListener('DOMContentLoaded', function() {
    const cartIcons = document.querySelectorAll('.van');
    
    cartIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (localStorage.getItem('userLoggedIn') === 'true') 
            {
                alert('Added to cart!');
            } else 
            {
                sessionStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = 'login.html';
            }
        });
    });
});

function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".pro");

    products.forEach((product) => {
        const categoryElement = product.querySelector(".des .category");
        if (categoryElement) {
            const category = categoryElement.textContent.toLowerCase();
            product.style.display = category.includes(input) ? "block" : "none";
        }
    });
}

document.getElementById("searchInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        searchProducts();
    }
});

function filterByPrice() {
    const filterValue = document.getElementById("priceFilter").value;

    const allProducts = Array.from(document.querySelectorAll(".pro"));

    if (filterValue === "lowToHigh") {
        allProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (filterValue === "highToLow") {
        allProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }

    const mainContainer = document.querySelector(".pro-container"); 
    allProducts.forEach(product => mainContainer.appendChild(product));
}
