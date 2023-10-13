"use strict"
/*------------------------------- */

const Personnel = require('../models/personnel.model')

module.exports= {
    
    login: async (req, res)=>{

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

                    const refreshData ={
                        username:user.username,
                        password: user.password
                    }

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
        throw new Error('Please entry username and password...')
    }
},

    refresh: async (req, res)=>{

    },

    logout: async (req, res)=>{

    },


}