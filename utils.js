btnClient = document.getElementById("btnClient");
btnClient.addEventListener("click", () => {
  fetch("http://localhost:5000/products", {
    method: "GET",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFkZmY0ZGQzNmM3MWYzZjU2ZGVjOSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3Mzg2NjYwODcsImV4cCI6MTczODY2OTY4N30.H7Cv2-58CkDT6zBfp6CBYPxHGztoi1MfirkwQJAEcpQ",
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
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFmMDE4ZGQzNmM3MWYzZjU2ZGYwMiIsInJvbGUiOiJ2ZW5kZXVyIiwiaWF0IjoxNzM4NjY2MDI0LCJleHAiOjE3Mzg2Njk2MjR9.YXxuHTfaUKvxApHNJ-i3B4VyTAPZnPKsXBTrjHeS6uo",
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
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFmMDE4ZGQzNmM3MWYzZjU2ZGYwMiIsInJvbGUiOiJ2ZW5kZXVyIiwiaWF0IjoxNzM4NjY2MDI0LCJleHAiOjE3Mzg2Njk2MjR9.YXxuHTfaUKvxApHNJ-i3B4VyTAPZnPKsXBTrjHeS6uo",
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
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFmMDE4ZGQzNmM3MWYzZjU2ZGYwMiIsInJvbGUiOiJ2ZW5kZXVyIiwiaWF0IjoxNzM4NjY2MDI0LCJleHAiOjE3Mzg2Njk2MjR9.YXxuHTfaUKvxApHNJ-i3B4VyTAPZnPKsXBTrjHeS6uo",
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
              Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFmMDE4ZGQzNmM3MWYzZjU2ZGYwMiIsInJvbGUiOiJ2ZW5kZXVyIiwiaWF0IjoxNzM4NjY2MDI0LCJleHAiOjE3Mzg2Njk2MjR9.YXxuHTfaUKvxApHNJ-i3B4VyTAPZnPKsXBTrjHeS6uo",
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
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFmMDE4ZGQzNmM3MWYzZjU2ZGYwMiIsInJvbGUiOiJ2ZW5kZXVyIiwiaWF0IjoxNzM4NjY2MDI0LCJleHAiOjE3Mzg2Njk2MjR9.YXxuHTfaUKvxApHNJ-i3B4VyTAPZnPKsXBTrjHeS6uo",
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
