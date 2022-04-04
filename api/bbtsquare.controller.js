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
}