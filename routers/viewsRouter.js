const {Router} = require('express')
const ProductManager = require('../dao/manager/productManager')
const CartManager = require('../dao/manager/cartManager')
const viewsRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()


viewsRouter.get('/products', async (req, res) => {
    const products = await productManager.getProducts()

    res.render('products', {products})
})

viewsRouter.get('/products/:pid', async (req, res) => {
    const {pid} = req.params
	const user = req.user
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productDetail',{ title: 'Detalle del producto',style:'styles.css', product ,user});
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error',{ title: 'Error', errorMessage: errorMessage });
    }
})


//Carrito
viewsRouter.get('/carts/:cid', async (req, res) =>{
	const user = req.user
	const { cid } = req.params

	try {
		const cart = await cartManager.getCartById(cid);

		if (req.user.cart !== cid) {
			const errorMessage = 'No tienes permiso para ver este carrito'
			res.render('error',{ title: 'Error', errorMessage: errorMessage });
		}

		const productsCart = cart[0].products.map(p => p.toObject());
		let { totalQuantity, totalPrice } = productsCart.reduce((accumulator, item) => {
			accumulator.totalQuantity += item.quantity;
			accumulator.totalPrice += item.quantity * item.product.price;

			return accumulator;
		}, 
        { totalQuantity: 0, totalPrice: 0 });
		totalPrice = totalPrice.toFixed(2)

		if (cart[0].products.length === 0) {
			const noProducts = true;	
			return res.render('cartDetail', { title: 'Carrito', noProducts, user })
		}else{
			return res.render('cartDetail', { title:'Carrito', productsCart, user, totalPrice, totalQuantity })
		}
	}catch (error){
		res.render('error', { title:'Error', errorMessage: error.message })
	}
})

module.exports = viewsRouter