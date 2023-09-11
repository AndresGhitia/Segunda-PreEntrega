import { Router } from "express";
import { productService } from "../dao/index.js";
import { cartService } from "../dao/index.js";
import { checkUserAuthenticated,showLoginView } from "../config/auth.js";

const router = Router()

router.get('/', (req, res) => {
  if(req.session.user){
      res.redirect('/products')
  }else{
      res.redirect('/login')
  }
})

router.get("/realtimeproducts", async (req, res) => {
  const products = await productService.getProducts();
  res.render("realtimeproducts",{products});
});

router.get("/chat",(req,res)=>{
  res.render("chat")
})

router.get("/products",checkUserAuthenticated, async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      stock,
      sort = "asc",
      category,
    } = req.query;

    const stockValue = stock === "0" ? undefined : parseInt(stock);
    if (!["asc", "desc"].includes(sort)) {
      return res.render("products", { error: "Orden no válido" });
    }
    const sortValue = sort === "asc" ? 1 : -1;

    let query = {};
    if (stockValue) {
      query.stock = { $gte: stockValue };
    }
    if (category) {
      query.category = category; 
    }

    const result = await productService.getWithPaginate(query, {
      page,
      limit,
      sort: { price: sortValue },
      lean: true,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    let user = '';
    if (req.session.user) {
      user = req.session.user;
    } else {
      return res.redirect('/login');
    }

    const resultProductsView = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      prevPage: result.prevPage,
      hasPrevPage: result.hasPrevPage,
      prevLink: result.hasPrevPage ? baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`) : null,
      nextPage: result.nextPage,
      hasNextPage: result.hasNextPage,
      nextLink: result.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.includes("?") ? baseUrl.concat(`&page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`) : null,
      session: user
    };

    res.render("products", resultProductsView);
  } catch (error) {
    console.log(error.message);
    res.render("products", { error: "No es posible visualizar los datos" });
  }
});

router.get('/cart/:cid', async(req,res) => {
  res.render('cart', {status: 'succes', payload: await cartService.getCartById(req.params.cid)})
})

router.get('/login',showLoginView, async(req, res) => {
  res.render('login', {})
})

router.get('/register',showLoginView, async(req, res) => {
  res.render('register', {})
})

router.get('/faillogin', async(req, res) => {
  res.send('Failed login.')
})

router.get('/failregister', async(req, res) => {
  res.send('Failed register.')
})

router.get("/api/carts", async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.json({ status: "Success", data: carts });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
});


export { router as viewsRouter };