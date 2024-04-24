import fs from "fs";
import path from "path";
import config from "../config.js";

const upath = path.join(config.DIRNAME, "../src/jsons/cart.json");
const upathProducts = path.join(config.DIRNAME, "../src/jsons/products.json");
const carts = JSON.parse(fs.readFileSync(upath, "utf-8"));

export const cartModos = {
  getProducts: (req, res) => {
    res.status(200).send(carts);
  },
  createCart: (req, res) => {
    const id = carts.length - 1;
    const cart = {
      id: id + 1,
      products: [],
    };
    carts.push(cart);
    fs.writeFileSync(upath, JSON.stringify(carts));
    res.status(200).send("Se agrego un carrito existosamente");
  },
  addProductToCart: (req, res) => {
    const id = +req.params.pid;
    const cid = +req.params.cid;
    let quantity;
    let product;
    let outProduct;
    const cart = carts.find((element) => element.id === cid);
    if (cart) {
      product = cart.products.find((element) => element.product === id);
      outProduct = cart.products.filter((element) => element.product !== id);
    }

    if (!cart) {
      res.status(400).send("No se encontro el carrito");
    } else if (product) {
      quantity = product.quantity;

      return addcart();
    } else {
      quantity = 0;

      return addcart();
    }
    function addcart() {
      const producInCart = {
        product: id,
        quantity: quantity + 1,
      };
      const newProduct = [...outProduct, producInCart];
      carts[cid].products = newProduct;
      fs.writeFileSync(upath, JSON.stringify(carts));
      res.status(200).send("Se añadio al carrito con exito");
    }
  },
  productsCartById: (req, res) => {
    const cid = +req.params.cid;
    const cart = carts.find((element) => element.id === cid);
    const getProducts = JSON.parse(fs.readFileSync(upathProducts, "utf-8"));
    const products = [...cart.products];
    let newProducts = [];
    for (let index = 0; index < products.length; index++) {
      const arrayfor = getProducts.find(
        (element) => element.id === products[index].product
      );
      newProducts.push(arrayfor);
    }
    if (cart) {
      res.status(200).send(newProducts);
    } else {
      res.status(400).send("El carrito que buscas no existe");
    }
  },
};
