import UserDTO from "../dao/DTOs/user.dto.js";
import ProductDTO from "../dao/DTOs/product.dto.js";
import TicketManager from "../services/DB/TicketManager.db.js";
import { cartsService, productsService } from "../repositories/index.js";
import { generateProduct } from "../utils.js";

const ticketManager = new TicketManager();

const privateRoute = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const publicRoute = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect("/products");
  }
};

const getProductsPage = async (req, res) => {
  const userData = req.session.user;
  if (!userData) return;
  const { page } = req.query || 1;
  const products = await (
    await fetch("http://localhost:8080/api/products?page=" + page)
  ).json();
  req.logger.info(
    `${new Date().toLocaleTimeString()} - Rendering main page with products.`
  );
  res.render("home", {
    style: "style.css",
    products: await products,
    ...userData,
    admin: userData.role === "admin" ? true : false,
  });
};

const getCartPage = async (req, res) => {
  const cartId = req.session.user.cart;
  const cart = await (
    await fetch("http://localhost:8080/api/carts/" + cartId)
  ).json();
  const total = await cartsService.getCartTotal(cartId);
  await cartsService.getProductsWithStock(cartId);
  req.logger.info(`${new Date().toLocaleTimeString()} - Rendering cart page.`);
  res.render("cart", { style: "style.css", cart: await cart, total });
};

const getLoginPage = async (req, res) => {
  res.render("login", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
};

const getRegisterPage = async (req, res) => {
  res.render("register", { style: "credentials.css" });
};

const postRegister = async (req, res) => {
  res.redirect("/login");
};

const postLogin = async (req, res) => {
  if (!req.user) return res.redirect("/login?e=400&m=Credenciales inválidas");
  let user = new UserDTO(req.user);
  req.session.user = user.getRelevantInfo();
  res.redirect("/products");
};

const getMainPage = async (req, res) => {
  res.redirect("/login");
};

const getLogoutPage = async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

const getLostPasswordPage = async (req, res) => {
  res.render("lostpassword", {
    style: "credentials.css",
    code: req.query.e,
    message: req.query.m,
  });
};

const postLostPassword = async (req, res) => {
  res.redirect("/login");
};

const getManageProductsPage = async (req, res) => {
  const products = await (
    await fetch("http://localhost:8080/api/products?limit=999")
  ).json();
  res.render("manageproducts", {
    style: "manageProducts.css",
    products: await products,
  });
};

const postAddProduct = async (req, res) => {
  try {
    const _product = new ProductDTO(req.body);
    const product = JSON.stringify(_product);
    const addProductResponse = (
      await fetch("http://localhost:8080/api/products/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: product,
      })
    ).json();
  } catch (e) {
    return console.log(e);
  }
};

const getTicketPage = async (req, res) => {
  const ticketCode = req.params.tid;
  const ticket = await ticketManager.getTicketByCode(ticketCode);
  const userEmail = req.user.email;
  if (ticket.success) {
    if (ticket.ticket.purchaser == userEmail)
      return res.render("purchase", {
        style: "style.css",
        ticket: ticket.ticket,
      });
  } else {
    return res.redirect("http://localhost:8080/");
  }
};

const postPurchase = async (req, res) => {
  let ticket;
  const cartId = req.user.cart;
  const email = req.user.email;

  const productsStock = await cartsService.getProductsWithStock(cartId);
  if (productsStock.productsWithStock.length > 0) {
    const productsWithStockTotal = await productsService.getProductsTotal(
      productsStock.productsWithStock
    );
    ticket = await ticketManager.createTicket(productsWithStockTotal, email);
    if (ticket.success) {
      for await (const product of productsStock.productsWithStock) {
        await cartsService.removeProductOfCart(cartId, product.id);
      }
      return res.send({ success: true, ticketCode: ticket.ticketCode });
    } else {
      return res.status(500).send({ success: false });
    }
  } else {
    return res.status(500).send({ success: false });
  }
};

const deleteEmptyCart = async (req, res) => {
  const cartId = req.user.cart;
  const apiResponse = await (
    await fetch("http://localhost:8080/api/carts/" + cartId, {
      method: "DELETE",
    })
  ).json();
  if (apiResponse.success) {
    return res.send({ success: true });
  } else {
    return res.send({ success: false });
  }
};

const getMockingProducts = async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    const product = generateProduct();
    products.push(product);
  }
  res.send(products);
};

export {
  privateRoute,
  publicRoute,
  getProductsPage,
  getCartPage,
  getLoginPage,
  getRegisterPage,
  postRegister,
  postLogin,
  getMainPage,
  getLogoutPage,
  getLostPasswordPage,
  postLostPassword,
  getManageProductsPage,
  postAddProduct,
  getTicketPage,
  postPurchase,
  deleteEmptyCart,
  getMockingProducts,
};
