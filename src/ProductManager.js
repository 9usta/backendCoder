import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      this.#writeFile([]);
    }
  }
  // Agregado de productos - recive un objeto con el formato especificado.
  async addProduct(productObj) {
    const products = await this.#reedFile();
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
          id: await this.#createId(),
          ...productObj,
        };
        products.push(product);
        await this.#writeFile(products);
      } else {
        console.log("No pueden existir dos productos con el mismo código");
      }
    } else {
      console.log("Error al cargar el producto. No se permiten campos vacios");
    }
  }
  // Mostrar los productos guardados.
  async getProducts(limit) {
    const productFile = await this.#reedFile(limit);
    console.log(productFile);
    return productFile;
  }
  // Mostrar el producto buscado por su número de id
  async getProductById(id) {
    const products = await this.#reedFile("all");
    const searchedProduct = products.find(
      (product) => product.id === parseInt(id)
    );
    if (searchedProduct) {
      console.log(searchedProduct);
      return searchedProduct;
    } else {
      console.log(`Not found: No existe un producto con el id: ${id}`);
      return  (`Not found: No existe un producto con el id: ${id}`);
    }
  }
  // modificar informacion de un producto introduciendo su id, el nombre del componente a modificar y el nuevo valor
  async updateProduct(productId, keyToChange, newValue) {
    const products = await this.#reedFile("all");
    const productToChange = products.find(
      (product) => product.id === productId
    );
    if (productToChange) {
      productToChange[keyToChange] = newValue;
      await this.#writeFile(products);
    } else {
      console.log(`No existe un producto con el id: ${productId}`);
    }
  }
  // Eliminar producto a partir del id, si no queda ningun elemento se elimina el archivo
  async deleteProduct(productId) {
    const products = await this.#reedFile("all");
    let i = products.findIndex((producto) => producto.id === productId);
    i === -1
      ? console.log(`No existe un producto con el id: ${productId}`)
      : products.splice(i, 1);
    if (products.length === 0) {
      await this.#writeFile([]);
    } else {
      await this.#writeFile(products);
    }
  }
  //Funcion para controlar el numero de Id
  async #createId() {
    const productFile = await this.#reedFile("all");
    const id =
      productFile.length === 0 ? 1 : productFile[productFile.length - 1].id + 1;
    return id;
  }
  //Funcion para leer el archivo
  async #reedFile(limit) {
    const productFile = await fs.promises.readFile(this.path, "utf-8");
    return limit === "all"
      ? JSON.parse(productFile)
      : JSON.parse(productFile).slice(0, parseInt(limit));
  }
  //Funcion para grabar el archivo
  async #writeFile(product) {
    await fs.promises.writeFile(this.path, JSON.stringify(product));
  }
}
