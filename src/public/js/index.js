async function addProductToCart(cartId, productId) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/carts/" + cartId + "/product/" + productId,
      { method: "POST" }
    );
    if (response.ok) return alert("Producto agregado!");
    return alert("No se pudo agregar el producto");
  } catch (e) {
    alert("No se pudo agregar el producto");
  }
}
