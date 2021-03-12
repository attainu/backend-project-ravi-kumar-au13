const {body} = require('express-validator')

const customerInfo = [
    body('customer_id')
        .exists()
        .not()
        .isEmpty()
        .isLength({
            min:5
        })
        .withMessage("Customer id required and should be greater than 5 digits "),
    body('name')
        .exists()
        .not()
        .isEmpty()
        .isLength({
            min:3
        })
        .withMessage("Please enter customer name and should consist of minimum 3 characters"),
    body('phone_number')
        .not()
        .isEmpty()
        .isLength({
            max:10
        })
        .withMessage("Please enter your Phone Number"),
    body('total_amount')
        .not()
        .isEmpty()
        .withMessage("Please enter the Total Amount")
]

module.exports = customerInfo