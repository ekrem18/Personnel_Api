"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */

const department = require('../controllers/department.controller')
const permissions = require('../middlewares/permissions')

//URL: /department
router.route('/')
    .get(permissions.isLogin, department.list) //login olan herkes listeleme yapabilir
    .post(permissions.isAdmin, department.create)

router.route('/:id')
    .get(department.read)
    .put(permissions.isAdminOrLead, department.update)
    .patch(permissions.isAdminOrLead, department.update)
    .delete(permissions.isAdminOrLead, department.delete)

router.get('/:id/personnels', department.personnels)






/* ------------------------------------------------------- */
module.exports = router