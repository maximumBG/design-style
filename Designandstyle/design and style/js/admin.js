document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Add or Edit Product
    document.getElementById('productForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const productId = document.getElementById('productId').value;
        const productName = document.getElementById('productName').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const productImage = document.getElementById('productImage').files[0];

        // Validation
        if (!productName || productPrice <= 0 || !productImage) {
            alert('Please fill out all fields with valid data.');
            return;
        }

        // Create a new product object or edit an existing one
        const newProduct = {
            id: productId ? productId : 'prod_' + Date.now(),
            name: productName,
            price: productPrice,
            image: URL.createObjectURL(productImage) // Temporary URL for the uploaded image
        };

        // Get products from localStorage
        let products = JSON.parse(localStorage.getItem('products')) || [];

        // If editing, update product. Otherwise, add new product.
        if (productId) {
            products = products.map(product => product.id === productId ? newProduct : product);
        } else {
            products.push(newProduct);
        }

        // Save updated products to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Clear the form and reload products
        document.getElementById('productForm').reset();
        loadProducts();
        alert('Product saved successfully!');
    });
});

// Load products and display in the admin panel
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.querySelector('.admin-products-list');
    productList.innerHTML = ''; // Clear current products

    products.forEach(product => {
        const productItem = `
            <div class="product-item" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class="btn edit-product" data-id="${product.id}">Edit</button>
                <button class="btn delete-product" data-id="${product.id}">Delete</button>
            </div>
        `;
        productList.innerHTML += productItem;
    });

    // Add event listeners for editing and deleting
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => editProduct(button.dataset.id));
    });

    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => deleteProduct(button.dataset.id));
    });
}

// Edit product
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.id === productId);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        // Product image cannot be pre-filled for security reasons, so leave it empty
    }
}

// Delete product
function deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(product => product.id !== productId);

    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    alert('Product deleted successfully!');
}
