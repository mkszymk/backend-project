const btn = document.getElementById("addProductBtn");
const form = document.getElementById("addProductForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  const response = await addProduct(product);
  if (response.success) return alert("Producto agregado!");
  return alert("Error al agregar el producto.");
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
