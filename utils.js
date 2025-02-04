// Stocker le token dans une variable globale
let userToken = "";
let userRole = "";

// Gestion du formulaire de login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la connexion");
      }
      return response.json();
    })
    .then((data) => {
      // Sauvegarde du token et du role
      userToken = data.token;
      // Le token est généré avec les infos : { id: ..., role: ... }
      // Vous pouvez parser le token ou le récupérer dans data (selon votre API)
      // Ici on suppose que le role est disponible dans data.role
      userRole = data.role;

      // Masquer le formulaire de login
      document.getElementById("loginSection").style.display = "none";
      // Afficher la section des produits
      document.getElementById("productsSection").style.display = "block";

      // Mettre à jour les boutons selon le rôle
      if (userRole === "client") {
        // Affiche uniquement le bouton client et cache les autres
        document.getElementById("btnClient").dataset.token = userToken;
        document.getElementById("btnVendeur").style.display = "none";
        document.getElementById("btnAdd").style.display = "none";
      } else if (userRole === "vendeur" || userRole === "admin") {
        // Affiche les boutons vendeur et add
        document.getElementById("btnVendeur").dataset.token = userToken;
        document.getElementById("btnAdd").dataset.token = userToken;
        document.getElementById("btnClient").style.display = "none";
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error("Erreur:", error);
    });
});

btnClient = document.getElementById("btnClient");
btnClient.addEventListener("click", () => {
  fetch("http://localhost:5000/products", {
    method: "GET",
    headers: {
      Authorization: userToken,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const container = document.getElementById("products");
      container.innerHTML = "";
      if (products.length === 0) {
        container.innerHTML = "Aucun produit trouvé.";
        return;
      }
      products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h2>${product.name}</h2>
            <p><strong>Prix:</strong> ${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Quantité:</strong> ${product.quantity}</p>
            <p><strong>Catégorie:</strong> ${product.category}</p>
            <button id="$product_id" class="order">Commander</button>
          `;
        container.appendChild(div);
      });
    })
    .catch((error) => {
      document.getElementById("products").innerHTML =
        "Erreur lors du chargement des produits.";
      console.error("Erreur:", error);
    });
});

btnVendeur = document.getElementById("btnVendeur");
btnVendeur.addEventListener("click", () => {
  fetch("http://localhost:5000/products", {
    method: "GET",
    headers: {
      Authorization: userToken,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const container = document.getElementById("products");
      container.innerHTML = "";
      if (products.length === 0) {
        container.innerHTML = "Aucun produit trouvé.";
        return;
      }
      products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
              <h2>${product.name}</h2>
              <p><strong>Prix:</strong> ${product.price}</p>
              <p><strong>Description:</strong> ${product.description}</p>
              <p><strong>Quantité:</strong> ${product.quantity}</p>
              <p><strong>Catégorie:</strong> ${product.category}</p>
              <button id="${product._id}" class="btnDelete">Supprimer</button>
              <button id="${product._id}" class="btnEdit">Modifier</button>
            `;
        container.appendChild(div);
      });
    })
    .catch((error) => {
      document.getElementById("products").innerHTML =
        "Erreur lors du chargement des produits.";
      console.error("Erreur:", error);
    });
});

document.getElementById("products").addEventListener("click", (event) => {
  if (event.target.classList.contains("btnDelete")) {
    fetch(`http://localhost:5000/products/${event.target.id}`, {
      method: "DELETE",
      headers: {
        Authorization: userToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          event.target.parentElement.remove();
        } else {
          console.error("Erreur lors de la suppression du produit.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du produit:", error);
      });
  }
});

document.getElementById("products").addEventListener("click", (event) => {
  if (event.target.classList.contains("btnEdit")) {
    // Récupérer la div contenant les informations du produit
    const productContainer = event.target.parentElement;

    fetch(`http://localhost:5000/products/${event.target.id}`, {
      method: "GET",
      headers: {
        Authorization: userToken,
      },
    })
      .then((response) => response.json())
      .then((product) => {
        // Remplacer le contenu de la div par un formulaire d'édition
        productContainer.innerHTML = `
                      <form id="editProductForm">
                          <label>Nom: <input type="text" id="edit_name" name="name" value="${product.name}"></label><br>
                          <label>Description: <input type="text" id="edit_description" name="description" value="${product.description}"></label><br>
                          <label>Prix: <input type="text" id="edit_price" name="price" value="${product.price}"></label><br>
                          <label>Quantité: <input type="text" id="edit_quantity" name="quantity" value="${product.quantity}"></label><br>
                          <label>Catégorie: <input type="text" id="edit_category" name="category" value="${product.category}"></label><br>
                          <input type="hidden" id="edit_product_id" name="product_id" value="${product._id}">
                          <button type="submit">Modifier</button>
                      </form>
                  `;

        // Gérer la soumission du formulaire pour mettre à jour le produit
        const form = productContainer.querySelector("#editProductForm");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const updatedProduct = {
            name: document.getElementById("edit_name").value,
            description: document.getElementById("edit_description").value,
            price: document.getElementById("edit_price").value,
            quantity: document.getElementById("edit_quantity").value,
            category: document.getElementById("edit_category").value,
          };

          fetch(`http://localhost:5000/products/${product._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: userToken,
            },
            body: JSON.stringify(updatedProduct),
          })
            .then((response) => {
              if (response.ok) {
                alert("Produit mis à jour avec succès !");
                location.reload();
              } else {
                alert("Erreur lors de la mise à jour du produit.");
              }
            })
            .catch((error) => {
              console.error("Erreur lors de la mise à jour du produit:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du produit:", error);
      });
  }
});

document.getElementById("btnAdd").addEventListener("click", () => {
  const container = document.getElementById("products");
  container.innerHTML = `
        <div class="addProduct">
            <form id="addProductForm">
                <label>Nom: <input type="text" name="name" required></label><br>
                <label>Description: <input type="text" name="description" required></label><br>
                <label>Prix: <input type="number" name="price" required></label><br>
                <label>Quantité: <input type="number" name="quantity" required></label><br>
                <label>Catégorie: <input type="text" name="category" required></label><br>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    `;

  document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
      name: e.target.name.value,
      description: e.target.description.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
      category: e.target.category.value,
    };

    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        if (response.ok) {
          alert("Produit ajouté avec succès !");
          location.reload();
        } else {
          alert("Erreur lors de l'ajout du produit.");
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  });
});
