const btn = document.getElementById("addProductBtn");
const form = document.getElementById("addProductForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  console.log(product);
  const response = await addProduct(product);
  if (response.success) {
    alert("Producto agregado!");
    window.location.reload();
  } else {
    return alert("Error al agregar el producto.");
  }
});

async function addProduct(product) {
  const apiResponse = (
    await fetch("http://localhost:8080/api/products/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
  ).json();
  return await apiResponse;
}

async function deleteProduct(productId) {
  const apiResponse = await (
    await fetch("http://localhost:8080/api/products/" + productId, {
      method: "DELETE",
    })
  ).json();
  window.location.reload();
}
