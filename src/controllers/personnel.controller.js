"use strict"
/* --------------------------------------------------- */

"use strict"
/*------------------------------------------------------- */
const Personnel = require('../models/personnel.model')

module.exports={
    list: async (req, res)=>{
         /*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "List Personnels"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
        const data = await res.getModelList(Personnel, {}, 'departmentId')
        res.status(200).send({
            error:false,
            detail:await res.getModelListDetails(Personnel),
            data
        })
    },

    create: async (req, res)=>{
         /*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Create Personnel"
            
        */

        const isLead = req.body?.isLead || false
        if (isLead) {
           const xyz= await Personnel.updateMany({departmentId: req.body.departmentId, isLead: true}, {isLead: false}) //req ile gelen departmentları getir. Onların içinde isLead'i true olanları da getir. ve false yap. ilk obje içerisindeki virgülü AND operatörü gibi düşünebilirsin
        }

        const data = await Personnel.create(req.body) //--> Gönderilen req. body'i Personnel model'de create yap
        res.status(201).send({
            error:false,
            data
        })
    },

    read: async (req, res)=>{
          /*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Get Single Personnel"
        */

        const data = await Personnel.findOne({_id: req.params.id})
        res.status(200).send({
            error:false,
            data
        })
    },

    update: async (req, res) => {
           /*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Update Personnel"
            
        */

        // isLead Control:
        const isLead = req.body?.isLead || false
        if (isLead) {
            const { departmentId } = await Personnel.findOne({ _id: req.params.id }, { departmentId: 1 })
            await Personnel.updateMany({ departmentId, isLead: true }, { isLead: false })
        }

        const data = await Personnel.updateOne({ _id: req.params.id }, req.body)

        res.status(202).send({
            error: false,
            data,
            new: await Personnel.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res)=>{
          /*
            #swagger.tags = ["Personnels"]
            #swagger.summary = "Delete Personnel"
        */
        const data = await Personnel.deleteOne({_id: req.params.id})
        const isDeleted = data.deletedCount >= 1 ? true : false
        res.status(isDeleted ? 204 : 404).send({
            error: isDeleted,
            data
        })
    },

    login: async (req, res) => {

        const { username, password } = req.body

        if (username && password) {

            const user = await Personnel.findOne({ username, password })
            if (user) {

                // Set Session:
                req.session = {
                    id: user._id,
                    password: user.password
                }
                // Set Cookie:
                if (req.body?.rememberMe) {
                    req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 3 // 3 Days
                }

                res.status(200).send({
                    error: false,
                    user
                })

            } else {
                res.errorStatusCode = 401
                throw new Error('Wrong Username or Password.')
            }
        } else {
            res.errorStatusCode = 401
            throw new Error('Please entry username and password.')
        }
    },

    logout: async (req, res) => {
        // Set session to null:
        req.session = null
        res.status(200).send({
            error: false,
            message: 'Logout: Sessions Deleted.'
        })
    },
}
