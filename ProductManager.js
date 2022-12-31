const fs = require("fs");

class ProductManager {
  constructor() {
    this.path = `./productos.json`;
    if (!fs.existsSync(this.path)){
    this.#writeFile([])}
  }
  // Agregado de productos - recive un objeto con el formato especificado.
  addProduct(productObj) {
    const products = this.#reedFile();
    if (
      productObj.title &&
      productObj.description &&
      productObj.price &&
      productObj.thumbnail &&
      productObj.code &&
      productObj.stock
    ) {
      const codeAlredyExist = products.some(
        (product) => product.code === productObj.code
      );
      if (!codeAlredyExist) {
        const product = {
          id: this.#createId(),
          ...productObj,
        };
        products.push(product);
        this.#writeFile(products);
      } else {
        console.log("No pueden existir dos productos con el mismo código");
      }
    } else {
      console.log("Error al cargar el producto. No se permiten campos vacios");
    }
  }
  // Mostrar los productos guardados.
  getProducts() {
    console.log(this.#reedFile());
  }
  // Mostrar el producto buscado por su número de id
  getProductById(id) {
    const products = this.#reedFile();
    const searchedProduct = products.find((product) => product.id === id);
    searchedProduct
      ? console.log(searchedProduct)
      : console.log(`Not found: No existe un producto con el id: ${id}`);
  }
  // modificar informacion de un producto introduciendo su id, el nombre del componente a modificar y el nuevo valor
  updateProduct(productId, keyToChange, newValue) {
    const products = this.#reedFile();
    const productToChange = products.find(
      (product) => product.id === productId
    );
    if (productToChange) {
      productToChange[keyToChange] = newValue;
      this.#writeFile(products);
    } else {
      console.log(`No existe un producto con el id: ${productId}`);
    }
  }
  // Eliminar producto a partir del id, si no queda ningun elemento se elimina el archivo
  deleteProduct(productId) {
    const products = this.#reedFile();
    let i = products.findIndex((producto) => producto.id === productId);
    i === -1
      ? console.log(`No existe un producto con el id: ${productId}`)
      : products.splice(i, 1);
    if (products.length === 0) {
      this.#writeFile([]);
    } else {
      this.#writeFile(products);
    }
  }
  //Funcion para controlar el numero de Id
  #createId() {
    const productFile = this.#reedFile();
    const id =
      productFile.length === 0 ? 1 : productFile[productFile.length - 1].id + 1;
    return id;
  }
  //Funcion para leer el archivo
  #reedFile() {
      const productFile = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(productFile);
  }
  //Funcion para grabar el archivo
  #writeFile(product) {
    fs.writeFileSync(this.path, JSON.stringify(product));
  }
}
let prueba = new ProductManager();
prueba.getProducts();
prueba.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail:"Sin imagen",
  code: "abc3",
  stock: 25,
});
prueba.getProducts();
/* prueba.getProductById(1); */
/* prueba.updateProduct(1,"price", 400);
prueba.getProductById(1); */
prueba.deleteProduct(1);
/* prueba.getProductById(3); */
prueba.getProducts();