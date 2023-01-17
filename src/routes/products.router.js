import { Router } from "express";

import { ProductManager } from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("productos.json"); //Creación de una instancia de la clase ProductManager

//Dirección desde la que pueden obtenerse todos los productos o una cantidad limitada si se pasa la query limit
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit || "all");
  res.json({ products });
});

//Dirección con parametro variable para obtener solo un producto determinado por si id
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.json({ product });
});

//Dirección para agregar un nuevo producto
router.post("/", async (req, res) => {
  const productObj = req.body;
  const product = await productManager.addProduct(productObj);
  res.json({ product });
});

//Dirección para modificar producto
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const newData = req.body;
  const product = await productManager.updateProduct(pid, newData);
  res.json({ product });
});

//Dirección para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.deleteProduct(pid);
  res.json({ product });
});

export default router;
