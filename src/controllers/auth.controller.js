"use strict"
/*------------------------------- */
const jwt = require('jsonwebtoken')
const Personnel = require('../models/personnel.model')
const f= require('../helpers/checkUserAndSetToken')
const checkUserAndSetToken = require('../helpers/checkUserAndSetToken')


module.exports= {
    
    login: async (req, res)=>{
/*
        const {username, password} = req.body
        
        if(username && password){
            const user = await Personnel.findOne({ username, password }) //-----> req.body'den gelen parametrelerle, filtrelediğiklerim arasında uyuşan varsa user'a ata

            if(user) {
                if(user.isActive){
                    const accessData = {
                        _id: user._id,
                        departmentId: user.departmentId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isActive: user.isActive,
                        isAdmin: user.isAdmin,
                        isLead: user.isLead,
                    }
                    const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {expiresIn:'30m'})

                    const refreshData ={
                        username:user.username,
                        password: user.password
                    }
                    const refreshToken= jwt.sign(refreshData, process.env.REFRESH_KEY, {expiresIn: '3d'} )

                    res.send({
                        error: 'false',
                        token: { acces:accessToken, 
                                 refresh:refreshToken}
                    })

                }else{
                res.errorStatusCode = 401
                throw new Error('This account is not active...')
            }
        } else{
            res.errorStatusCode = 401
            throw new Error('Wrong username and password...')
        }

    } else{
        res.errorStatusCode = 401
        throw new Error('Please enter username and password...')
    }*/

        const checkUser = checkUserAndSetToken(req.body)
        if(checkUser.error){
            res.errorStatusCode = 401
            throw new Error(checkUser.message)
        }
    },

    refresh: async (req, res)=>{
        const refreshToken = req.body?.token?.refresh || null

        if(refreshToken) {
            const jwtData = jwt.verify(refreshToken, process.env.REFRESH_KEY) //--> refreshToken gelirse, bunu dekod edeceğim yer ve KEY'im burası

            if(jwtData){

            }

        }

    },

    logout: async (req, res)=>{
        res.send({
            error: 'false',
            mesaage:'No need any doing for logout'
        })
    },
}