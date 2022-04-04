let restaurants

export default class BBTSquareDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.BBTSQUARE_NS).collection("restaurants")
        } catch (error) {
            `Unable to establish connections handle in BBTSquareDAO: ${error}`
        }
    }

    static async getBBTSquare({
        filters = null,
        page = 0,
        resultsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = {$text: {$search : filters["name"]}}
            } else if ("cousine" in filters) {
                query = {"cousine": {$eq: filters["cousine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor

        try {
            cursor = await restaurants
            .find(query)
        } catch (error) {
            console.error(`Unable to issue find command, ${error}`)
            return {restaurantsList:[], totalNumRestaurants:0}
        }

        const displayCursor = cursor.limit(resultsPerPage).skip(resultsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return {restaurantsList, totalNumRestaurants}
        } catch (error) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${error}`)

            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
}