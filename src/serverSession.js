import session from "express-session";
import express from 'express';
import dotenv from 'dotenv';
import auth from './middleware/auth.middleware.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized:true
    })
);

/*

import mySQLStore from 'express-mysql-session';

const options = {
    host: 'localhost', 
    port: 3306,
    user: 'root',
    password: '',
    database: 'prueba_session'
}

const sessionStore = new mySQLStore(options)
app.use(session({
    key: 'coookie_user', 
    secret: '123456',
    store: 'sessionStore',
    resave: false,
    saveUninitialized:false
}));
*/

app.get('/', (req, res) =>{
    req.session.user = 'Juan Perez';
    req.session.rol= 'admin';
    req.session.visits = req.session.visits ? ++req.session.visits : 1;
    console.log(req.session)

    res.send(`
    El usuario <strong>${req.session.user}</strong>
    con rol <strong>${req.session.rol}</strong>
    ha visitad éste sitio <strong>${req.session.visits}</strong> veces
    `)
})

app.get('/contador', (req, res) =>{
    if (req.session.contador) {
        req.session.contador++;
        res.send(`Hola, has visto la pagina ${req.session.contador} veces`)
    } else {
        req.session.contador=1;
        res.send('bienvenido, es la primera vez que visitas la página')
    }
})


app.get('/login', (req, res) => {
    const { user, password} = req.query;
    if (user === "guillermo" && password === '123456'){
        req.session.login=true
        res.send('loggead')
    } else {
        res.send('login false')
    }
})

app.get('/restringida', auth, (req, res) => {
   res.send('información restringida')
})


const server = app.listen(PORT, () => {
    console.log(`🚀 serverSession running on port http://localhost:${PORT} 🛰️ ✨`);
});

server.on('error', (err) => console.log(err));