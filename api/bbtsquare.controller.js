import BBTSquareDAO from "../dao/bbtsquareDAO.js";

export default class BBTSquareCtrl {
    static async apiGetData(req, res, next) {
        const resultsPerPage = req.resultsPerPage ? parseInt(req.query.resultsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await BBTSquareDAO.getBBTSquare({
            filters,
            page,
            resultsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: resultsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }

    static async apiGetDataById(req, res, next) {
        try {
            let id = req.params.id || {}
            let restaurant = await BBTSquareDAO.getRestaurantById(id)
            if (!restaurant) {
                res.status(404).json({error: "Not Found"})
            }
            res.json(restaurant)
        } catch (error) {
            console.log(`api, ${error}`)
            res.status(500).json({error: error.message})
        }
    }

    static async apiGetDataCuisines(req, res, next) {
        try {
            let cuisines = await BBTSquareDAO.getCuisines()
            res.json(cuisines)
        } catch (error) {
            console.log(`api, ${error}`)
            res.status(500).json({error: error.message})
        }
    }
}