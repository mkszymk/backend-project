const btn = document.getElementById("purchaseBtn");
const emptyCartBtn = document.getElementById("emptyCartBtn");

async function purchaseCart() {
  const apiResponse = await fetch("/cart/purchase", {
    method: "POST",
  });
  return apiResponse;
}

async function emptyCart() {
  const apiResponse = await fetch("/cart/empty", {
    method: "DELETE",
  });
  return apiResponse;
}

emptyCartBtn.addEventListener("click", async (event) => {
  const apiResponse = await (await emptyCart()).json();
  if (apiResponse.success) {
    window.location.reload();
  } else {
    alert("No se pudo limpiar el carrito.");
  }
});

btn.addEventListener("click", async (event) => {
  const apiResponse = await (await purchaseCart()).json();
  if (apiResponse.success) {
    window.location.href = "/ticket/" + apiResponse.ticketCode;
  } else {
    alert("No se pudo completar la compra.");
  }
});
