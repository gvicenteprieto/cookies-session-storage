import express from 'express';
import dotenv from 'dotenv';
import session from "express-session";
//FileStore
//import FileStore from 'session-file-store';

//mongo
import mongoStore from 'connect-mongo';
import auth from './middleware/auth.middleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//se crea la instancia de FileStore
//const fileStore = FileStore(session)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//comentada la que se usó para express-session
/*
app.use(
    session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized:true
    })
);
*/

//se crea configuración para fileStore
app.use(session
    ({
        store: mongoStore.create({ 
            mongoUrl: process.env.MONGO_URI,
        options: {
            userNewUrlParser: true,
            useUnifiedTopologie: true
        }
    })
        // store: new fileStore({
        //     path: './sessions',
        //     ttl: 300,
        //     retries: 0,
        // }),
        // secret: process.env.SECRET,
        // resave: false,
        // saveUninitialized: false,
        // // cookie: {maxAge: 10000},
    })
);

/*
eliminar: ejemplo de ytube
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

app.get('/', (req, res) => {
    req.session.user = 'Juan Perez';
    req.session.rol = 'admin';
    req.session.visits = req.session.visits ? ++req.session.visits : 1;
    console.log(req.session)

    res.send(`
    El usuario <strong>${req.session.user}</strong>
    con rol <strong>${req.session.rol}</strong>
    ha visitad éste sitio <strong>${req.session.visits}</strong> veces
    `)
})

app.get('/contador', (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
        res.send(`Hola, has visto la pagina ${req.session.contador} veces`)
    } else {
        req.session.contador = 1;
        res.send('bienvenido, es la primera vez que visitas la página')
    }
})


app.get('/login', (req, res) => {
    const { user, password } = req.query;
    if (user === "guillermo" && password === '123456') {
        req.session.login = true
        res.send('welcome! logged success!')
    } else {
        res.send('login false')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.status(200).send("logout: ud salió de la aplicación")
        } else {
            res.json(err);
        }
    })
});

app.get('/restringida', auth, (req, res) => {
    res.send('información restringida: si está leyendo es porque ya se encuentra logeado')
})


const server = app.listen(PORT, () => {
    console.log(`🚀 serverSession running on port http://localhost:${PORT} 🛰️ ✨`);
});

server.on('error', (err) => console.log(err));