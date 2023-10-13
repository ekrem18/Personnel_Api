"use strict"

//MW :permission
module.exports ={
    isLogin: (req, res, next) => {

        if(req.user){
            next()
        } else{
            res.errorStatusCode = 403
            throw new Error('NoPermission : You must LOGIN')
        }
    },

    isAdminOrLead: (req, res, next) => {

        const departmentId = req.params?.id || null

        if (
            req.user && // bana gelen bir user var mı, login mi yani? bu gelen user Admin mi? Veya değilse de lead mi ve bulunduğu takımın lead'i mi?
            (req.user.isAdmin || (req.user.isLead && req.user.departmentId == departmentId))
        ) {
            next()
        } else {
            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Admin or Department Lead.')
        }
    },

    isAdminOrOwner: (req, res, next) => {
        
        const userId = req.params?.id || null

        if (
            req.user &&
            (req.user.isAdmin || (req.user._id == userId))
        ) {
            next()
        } else {
            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Admin or Owner.')
        }
    },
}