const express   = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv');
const app = express()
app.use(cors());
const bodyParser = require('body-parser');
const http = require('http').Server(app);

const {LogIn, SignIn, GetProfile} = require('./routes/auth');
// const MovePlayer = require('./routes/io/movePlayer');
// const BulletStorage = require('./routes/io/bulletStorage');

dotenv.config()
connectDB()



app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('-----------Hello socket world---------------');
    socket.on("LOGIN", LogIn(io, socket))
    socket.on("REGISTER", SignIn(io, socket))
    socket.on("GET_PROFILE", GetProfile(io, socket))
    
})

const PORT = process.env.PORT || 5000

http.listen(PORT, ()=> {
    console.log('listening on *:' + PORT);
});