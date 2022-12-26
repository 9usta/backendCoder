//-La ruta en la que se guardan las archivos poasee un componenete variable para generar rutas distintas para cada instancia del objeto
//-El método "addProduct" recibe un objeto, el cual debe tener el formato establecido. No recibe las propiedades por separado
//-El método "updateProduct" recibe como parámetro la key de la propiedad a modificar y el nuevo valor. Se deberá llamar al método cada vez que se quiera cambiar una propiedad.
//-El método "deleteProduct" elimina el archivo .json generado si al eliminar el producto ya no queda ninguno en el arreglo.

const fs = require("fs");

class ProductManager {
  constructor() {
    if (ProductManager.contador) {
      ProductManager.contador++;
    } else {
      ProductManager.contador = 1;
    }
    this.path = `./data/productos-${ProductManager.contador}`;
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
      fs.unlinkSync(this.path);
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
    if (fs.existsSync(this.path)) {
      const productFile = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(productFile);
    } else {
      return [];
    }
  }
  //Funcion para grabar el archivo
  #writeFile(product) {
    fs.writeFileSync(this.path, JSON.stringify(product));
  }
}
