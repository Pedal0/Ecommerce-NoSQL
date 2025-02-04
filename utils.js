btnClient = document.getElementById("btnClient");
btnClient.addEventListener("click", () => {
  fetch("http://localhost:5000/products", {
    method: "GET",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFkZmY0ZGQzNmM3MWYzZjU2ZGVjOSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3Mzg2NjE5MTgsImV4cCI6MTczODY2NTUxOH0.xa_rt_lOY-S7MewNi4-ro8fBi-2MvHi1b2GEOEaC72Y",
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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFlMDQ2ZGQzNmM3MWYzZjU2ZGVkMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczODY2MTk2NywiZXhwIjoxNzM4NjY1NTY3fQ.EzCskPdr-O6XCZX35kpidCARlnns8ggY8uNLeF-T91s",
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
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTFlMDQ2ZGQzNmM3MWYzZjU2ZGVkMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczODY2MTk2NywiZXhwIjoxNzM4NjY1NTY3fQ.EzCskPdr-O6XCZX35kpidCARlnns8ggY8uNLeF-T91s",
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
