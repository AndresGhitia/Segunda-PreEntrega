const socket = io();

function validarCamposYEnviar() {
  const title = document.getElementById("messageInput1").value.trim();
  const description = document.getElementById("messageInput2").value.trim();
  const code = document.getElementById("messageInput3").value.trim();
  const price = document.getElementById("messageInput4").value.trim();
  const status = document.getElementById("messageInput5").value.trim();
  const stock = document.getElementById("messageInput6").value.trim();
  const category = document.getElementById("messageInput7").value.trim();

  if (!title || !description || !code || !price || !status || !stock || !category) {
    alert('Todos los campos deben ser completados');
    return;
  }

  const productToAdd = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category
  };

  socket.emit("messages", [productToAdd]);

  document.getElementById("messageInput1").value = "";
  document.getElementById("messageInput2").value = "";
  document.getElementById("messageInput3").value = "";
  document.getElementById("messageInput4").value = "";
  document.getElementById("messageInput5").value = "";
  document.getElementById("messageInput6").value = "";
  document.getElementById("messageInput7").value = "";
}

// Función para mostrar los productos en la página
function mostrarProductos(data) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((product) => {
      const productDetails = document.createElement("div");
      productDetails.innerHTML = `
        <p>Título: ${product.title}</p>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
        <hr>
      `;
      productList.appendChild(productDetails);
    });
  } else {
    productList.innerHTML = "<p>No se encontraron productos.</p>";
  }
}

socket.on("productos", (products) => {
  mostrarProductos(products);
});
