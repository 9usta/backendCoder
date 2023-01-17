import express from "express";
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';


const app = express(); //Creación del servidor con Express
const PORT = 8080; //Se define el puerto al que se estará escuchando


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/products",productsRouter);
app.use("/cart",cartRouter);

//Idicación del puerto a escuchar, con mensaje por consola
app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});


