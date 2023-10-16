"use strict"

/*
    $ npm i express dotenv mongoose express-async-errors
    $ npm i cookie-session
    $ npm i jsonwebtoken
*/

const express = require('express')
const app = express()


/* ------------------------------------------------------- */
//Required Modules:
require('dotenv').config()
const PORT = process.env?.PORT || 8000

require('express-async-errors')


/* ------------------------------------------------------- */
//Configurations
const {dbConnection} = require('./src/configs/dbConnection')
dbConnection() //-------------------------------------------> yukarıda destructure yaptık çağırdık ancak burda da aktif ediyoruz. 


/* ------------------------------------------------------- */
//Middlewares
    
    //npm i morgan                                                        ----> logging
const morgan = require('morgan')
    // app.use(morgan('tiny'))
// app.use(morgan('combined'))                                            ----> LOGGING
    //writing log
// const fs = require('node:fs')
// app.use(morgan('combined', {                                          //---> morgan combined ile yakaladığımız kodları 2.paramatrede
//     stream: fs.createWriteStream('./access.log' , {flags: 'a'})       //---> stream property'si ile access.log dosyasını oluştur oraya kaydet dedim
// }))

const fs = require('node:fs')
const now = new Date()
const today = now.toISOString().split('T')[0]
app.use(morgan('combined', {
    stream:fs.createWriteStream(`./logs/${today}.log`, { flags: 'a' })
}))


app.use(express.json()) //----------------------------------> gelen veriyi almak ve objeye çevirmek için express json kullanıyoruz

app.use(require('cookie-session')({secret: process.env.SECRET_KEY}))

app.use(require('./src/middlewares/findSearchSortPage'))

// app.use(async (req, res, next)=>{
    
//     const Personnel = require('./src/models/personnel.model')
    
//     req.isLogin = false
    
//     if(req.session?.id) {
//         const user =await Personnel.findOne({_id:req.session.id})
//         if(user.password == req.session.password){
//             req.isLogin = true
//         }
//     }
//     console.log('isLogin: ', req.isLogin)
//     next()
// } )


        //taşıdım MW olarak 
// const jwt = require('jsonwebtoken')
// app.use((req, res, next) => {

//     const auth = req.headers?.authorization || null // get Authorization
//     const accessToken = auth ? auth.split(' ')[1] : null // get JWT

//     req.isLogin = false

//     jwt.verify(accessToken, process.env.ACCESS_KEY, function(err, user) {
//         if (err) {
//             req.user = null
//             console.log('JWT Login: NO')
//         } else {
//             req.isLogin = true
//             req.user = user
//             // req.user = user.isActive ? user : null
//             console.log('JWT Login: YES')
//         }
//     })
//     next()
// })
app.use(require('./src/middlewares/authenticated'))

// Documentation Middlewares:
// Swagger-UI:
// npm i swagger-ui-express
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./swagger.json')
// Parse/Run swagger.json and publish on any URL:
app.use('/docs/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson, { swaggerOptions: { persistAuthorization: true } }))



/* ------------------------------------------------------- */
//Routes
app.all('/',(req,res)=>{
    res.send({
        error:false,
        message:'Welcome To Personnel Api',
        session: req.session,
        isLogin:req.isLogin,
        user:req.user
    })
})

app.use('/auth', require('./src/routes/auth.router')),

//Departments
app.use('/departments', require('./src/routes/department.router'))

app.use('/personnels', require('./src/routes/personnel.router'))



/* ------------------------------------------------------- */
// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))


/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()