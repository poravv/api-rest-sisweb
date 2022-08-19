const express = require('express');
const app = express()
const cors = require('cors');
const configrutas =  require('./config_rutas')
const database=require("./database")
const port = process.env.PORT||3001;

const connect=async()=>{
    try{
        await database.authenticate()
        console.log("Conectado a la base de datos")
    }catch(err){
        console.log("Error: "+err)
    }
}

connect()

app.use(cors(
    {
        origin: "http://localhost:3000", //servidor que deseas que consuma o (*) en caso que sea acceso libre
        credentials: true
    }
    ));
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(configrutas)

//Rutas --------------------------------
app.get('/',(req,res)=>{
    res.send('Bienvenido a mi APP Node Js')
})

//Server Running ----------------------
app.listen(port,()=>{
    console.log("server corriendo en puerto: ",port);
});
