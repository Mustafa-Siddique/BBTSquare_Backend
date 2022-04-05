import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

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

    static async getRestaurantById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                    {
                        $lookup: {
                            from: "reviews",
                            let: {
                                id: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$restaurant_id", "$$id"],
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                                {
                                    $addFields: {
                                        reviews: "$reviews",
                                    },
                                },
                            ]
                        }
                    }
                ]
                return await restaurants.aggregate(pipeline).next()
        } catch (error) {
            console.error(`Something went wrong in getRestaurantByID: ${error}`)
            throw error
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (error) {
            console.error(`Unable to get cuisines, ${error}`)
            return cuisines
        }
    }
}