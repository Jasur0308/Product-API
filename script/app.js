const $products = document.getElementById("products");
const $createForm = document.getElementById("createForm");
const $updateForm = document.getElementById("updateForm");
const $inputs = $createForm.querySelectorAll(".inputElement");
const $updateInputs = $updateForm.querySelectorAll(".inputElement");
const $loading = document.getElementById("loading");

function loadData() {
    toggleLoading(true);
    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products")
        .then(response => response.json())
        .then(data => {
            toggleLoading(false);
            renderProducts(data)
        })
}

loadData();

const renderProducts = (products) => {
    $products.innerHTML = '';  // Clear previous products
    products.forEach(product => {
        const $div = document.createElement("div");
        $div.className = "card";
        if(product.id !== 108) {
            $div.innerHTML = `
            <div class="product__content">
                <p><strong>Name</strong>: ${product.name}</p>
                <p><strong>Price</strong>: $${product.price}</p>
                <p><strong>Description</strong>: ${product.description.slice(0, 50) + "..."}</p>
                <p><strong>Discount</strong>: ${product.discount}%</p>
                <p><strong>Id</strong>: ${product.id}</p>
                <button data-product-id="${product.id}" class="update">Update</button>
                <button data-product-id="${product.id}" class="delete">Delete</button>
            </div>
            <div class="product__image">
                <img src="${product.image}" alt="Product image" />
            </div>
            `
        }
        $products.appendChild($div);
    })
}

const handleCreateNewProduct = (e) => {
    e.preventDefault();

    const values = Array.from($inputs).map(input => input.value);
    let product = {
        name: values[0],
        price: values[1],
        description: values[2],
        discount: values[3],
        image: values[4]
    }
    
    fetch("https://6662ac4162966e20ef097175.mockapi.io/api/products/products",
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
    })
}

const handleUpdateProduct = (e) => {
    e.preventDefault();

    const id = $updateForm.getAttribute("data-current-update-product-id");
    const values = Array.from($updateInputs).map(input => input.value);
    let product = {
        name: values[0],
        price: values[1],
        description: values[2],
        discount: values[3],
        image: values[4]
    }

    fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}

const handleFillUpdateForm = (e) => {
    if(e.target.classList.contains("update")) {
        const id = e.target.getAttribute("data-product-id");
        fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`)
        .then(response => response.json())
        .then(data => {
            $updateInputs[0].value = data.name;
            $updateInputs[1].value = data.price;
            $updateInputs[2].value = data.description;
            $updateInputs[3].value = data.discount;
            $updateInputs[4].value = data.image;
            $updateForm.setAttribute("data-current-update-product-id", id);
        });
    }
}

const handleDeleteProduct = (e) => {
    if(e.target.classList.contains("delete")) {
        const id = e.target.getAttribute("data-product-id");
        const userAgree = confirm("Are you sure you want to delete this product?");
        if(userAgree) {
            fetch(`https://6662ac4162966e20ef097175.mockapi.io/api/products/products/${id}`, {method: "DELETE"})
                .then(response => response.json())
                .then(data => {
                    window.location.reload();
                });
        }
    }
}

function toggleLoading(status) {
    $loading.style.display = status ? "flex" : "none";
}

$createForm.addEventListener("submit", handleCreateNewProduct);
$updateForm.addEventListener("submit", handleUpdateProduct);
$products.addEventListener("click", handleFillUpdateForm);
$products.addEventListener("click", handleDeleteProduct);