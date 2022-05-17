import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.SECRET));


const user = {
    name: "user_one", 
    age: 33,
    value: "value_one",
    boolean: true,
};

//CREAR COOKIE
//cookie sin expiración
app.get('/cookieUnlimited', (req, res, next) =>{
    user.message = "unlimited cookie create"
    res.cookie('unlimited', user).send('cookie "ilimitada" creada')
});

//cookie con tiempo de expiración 
app.get('/cookielimitedExpired', (req, res, next) =>{
    user.message = "limitedExpired cookie create"
    res.cookie('expired', user, {maxAge: 30000}).send('cookie "expired" creada')
});

//leer cookie req.cookies + nombreCookie
app.get('/getCookies', (req, res) =>{
    const cookie = req.cookies.unlimited;
    res.json({cookie}) 
});

//borrar cookie
app.get('/deleteCookie', (req, res) =>{
    res.clearCookie('unlimited').send("cookie unlimited was deleted")
});


//SIGNED COOKIE
//generando cookie sign (firmada) con env + SECRET
app.get('/cookieFirmada', (req, res) => {
    user.firmada= 'cookie firmada'
    res.cookie('firmada', user, {maxAge: 100000, signed: true}).send('cookie "firmada" creada')
});

//leer cookie firmada req.signedCookies + nombreCookie
app.get('/getCookiesFirmada', (req, res) =>{
    const cookieFirmada = req.signedCookies.firmada;
    res.json({cookieFirmada}) 
});

//DESAFIO INYECTAR COOKIE EN EL FRONT
app.post ('/postCookies', (req, res) =>{
    const {name, value, time} = req.body;
    console.log(name, value, time)
    res.cookie(name, value, { maxAge: time, signed: true}).send(`cookie ${name} creada. Es una cookie firmada`)

})

app.get ('/allCookies', (req, res) =>{
const allCookies = req.signedCookies
res.json({allCookies}) 
})

app.delete ('/deleteCookie/:name', (req, res) =>{
    const name = req.params.name
    res.clearCookie(name).send(`cookie ${name} was deleted`)
});





const server = app.listen(PORT, () => {
    console.log(`🚀 server running on port http://localhost:${PORT} 🛰️`);
});

server.on('error', (err) => console.log(err));