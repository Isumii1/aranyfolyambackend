const { allCategoryDb, addCategoryDb, deleteCategoryDb, updateCategoryDb, findByCategory, findByCategoryId } = require('../models/categoryModel.js')

async function allCategory(req, res) {
    try {
        const result = await allCategoryDb()
        return res.status(201).json({ result })
    } catch (err) {
        return res.status(500).json({ error: 'Kategória szerver oldali hiba!', err })
    }
}

async function addCategory(req, res) {
    try {
        const { category_name } = req.body
        if (!category_name) {
            return res.status(404).json({ error: 'Tölts ki a név mezőt megfelelően!' })
        }
        console.log(category_name);
        const exists = await findByCategory(category_name)

        if (exists) {
            return res.status(404).json({ error: 'Már van ilyen kategória!' })
        }
        const category = await addCategoryDb(category_name)
        return res.status(201).json({ message: 'Sikeres kategória felvitel!', category })
    } catch (err) {
        return res.status(500).json({ error: 'Kategória szerver oldali hiba!', err })
    }
}

async function deleteCategory(req, res) {
    try {
        const { category_id } = req.params;
        const exists = await findByCategoryId(category_id)
        if (!exists) {
            return res.status(404).json({ error: 'Nem található ilyen kategória!' })
        }
        const category = await deleteCategoryDb(category_id)
        return res.status(201).json({ message: 'Sikeresen törölted a kategóriát!', category })

    } catch (err) {
        return res.status(500).json({ error: 'Kategória szerver oldali hiba!', err })
    }
}

async function updateCategory(req, res) {
    try {
        const { category_name, category_id } = req.body

        if (isNaN(category_id)) {
            return res.status(404).json({ error: 'Hiányzó kategória azonosító!' })
        }
        
        if(!category_name){
            return res.status(404).json({ error: 'Nem lehet üres a név mező!' })
        }

        const exists = await findByCategoryId(category_id)
        if (!exists) {
            return res.status(404).json({ error: 'Nem található ilyen kategória!' })
        }

        if (category_name) {
            const existsName = await findByCategory(category_name)
            if (existsName && existsName.category_id !== category_id) {
                return res.status(400).json({ error: 'Már található ilyen kategória ezzel a névvel!' })
            }
        }

        const category = await updateCategoryDb(
            category_id,
            category_name
        )

        return res.status(200).json({ message: 'Sikeresen módosítottad a kategóriát!' })

    } catch (err) {
        return res.status(500).json({ error: 'Termékek szerver oldali hiba!', err })
    }
}
module.exports = { allCategory, addCategory, deleteCategory, updateCategory }