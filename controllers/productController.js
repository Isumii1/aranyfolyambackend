const { allProductsDb, addProductDb, deleteProductDb, updateProductDb, findByProduct, findByProductId } = require('../models/productModel')

async function allProducts(req, res) {
    try {
        const result = await allProductsDb()
        return res.status(201).json({ result })
    } catch (err) {
        return res.status(500).json({ error: 'Termékek szerver oldali hiba!', err })
    }
}

async function addProduct(req, res) {
    try {
        const { category_id, product_name, product_price, product_image, product_stock } = req.body
        if (isNaN(category_id) || !product_name || isNaN(product_price) || !product_image || isNaN(product_stock)){
            return res.status(404).json({ error: 'Tölts ki minden mezőt megfelelően!'})
        }
        
        const exists = await findByProduct(product_name)
        // console.log(exists);
        
        if (exists) {
            return res.status(404).json({ error: 'Már van ilyen termék!' })
        }
        // console.log('asdasdasd');
        const product = await addProductDb(category_id, product_name, product_price, product_image, product_stock )
        return res.status(201).json({ message: 'Sikeres termék felvitel!', product })
    } catch (err) {
        return res.status(500).json({ error: 'Termékek szerver oldali hiba!', err })
    }
}

async function deleteProduct(req, res) {
    try {
        const { product_id } = req.params;
        const exists = await findByProductId(product_id)
        // console.log(exists);
        // console.log(product_id);
        if(!exists){
            return res.status(404).json({ error: 'Nem található ilyen termék!' })
        }
        const product = await deleteProductDb(product_id)
        return res.status(201).json({ message: 'Sikeresen törölted a terméket!', product })

    } catch (err) {
        return res.status(500).json({ error: 'Termékek szerver oldali hiba!', err })
    }
}

async function updateProduct(req, res) {
    try {
        const { category_id, product_name, product_price, product_image, product_stock, product_id } = req.body

        if (!product_id) {
            return res.status(404).json({ error: 'Hiányzó termék azonosító!' })
        }

        
        const exists = await findByProductId(product_id)
        if (!exists) {
            return res.status(404).json({ error: 'Nem található ilyen termék!' })
        }
        
        if (product_name) {
            const existsName = await findByProduct(product_name)
            if (existsName && existsName.product_id !== product_id) {
                return res.status(400).json({ error: 'Már található ilyen termék ezzel a névvel!' })
            }
        }

        const product = await updateProductDb(
            req,
            res,
            category_id,
            product_name,
            product_price,
            product_image,
            product_stock,
            product_id
        )

        return res.status(200).json({ message: 'Sikeresen módosítottad a terméket!' })

    } catch (err) {
        return res.status(500).json({ error: 'Termékek szerver oldali hiba!', err })
    }
}
module.exports = { allProducts, addProduct, deleteProduct, updateProduct }