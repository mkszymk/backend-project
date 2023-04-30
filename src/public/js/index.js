const socket = io();
const bodyTable = document.getElementById("productTable");
const formElement = document.getElementById("addProductForm");

formElement.addEventListener("submit", (e) => handleSubmit(e));

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const product = {
      title: document.querySelector("#pTitle").value,
      description: document.querySelector("#pDescription").value,
      price: parseInt(document.querySelector("#pPrice").value),
      thumbnail: document.querySelector("#pThumbnail").value,
      code: document.querySelector("#pCode").value,
      stock: parseInt(document.querySelector("#pStock").value),
      status: JSON.parse(document.querySelector("#pStatus").value),
      category: document.querySelector("#pCategory").value,
    };
    socket.emit("addProduct", product);

    document.querySelector("#pTitle").value = "";
    document.querySelector("#pDescription").value = "";
    document.querySelector("#pPrice").value = "";
    document.querySelector("#pThumbnail").value = "";
    document.querySelector("#pCode").value = "";
    document.querySelector("#pStock").value = "";
    document.querySelector("#pStatus").value = "";
    document.querySelector("#pCategory").value = "";
  } catch (error) {
    console.log(error);
  }
};

const fillList = (products) => {
  const listElement = products.reduce(
    (acc, curr) =>
      acc +
      `<tr><td>${curr.id}</td><td>${curr.title}</td><td>${curr.code}</td><td>${curr.category}</td><td>${curr.stock}</td><td>${curr.price}</td></tr>`,
    ""
  );
  bodyTable.innerHTML = listElement;
};

socket.on("updateList", (data) => {
  fillList(data);
});
