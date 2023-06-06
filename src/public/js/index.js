async function addProductToCart(cartId, productId) {
  const apiResponse = await (
    await fetch(
      "http://localhost:8080/api/carts/" + cartId + "/product/" + productId,
      { method: "POST" }
    )
  ).json();
  alert("Producto agregado!!");
}
