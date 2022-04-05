import express from 'express'
import BBTSquareCtrl from './bbtsquare.controller.js'
import ReviewsCtrl from './reviews.controller.js'

const router = express.Router()

router.route('/').get(BBTSquareCtrl.apiGetData)
router.route("/id/:id").get(BBTSquareCtrl.apiGetDataById)
router.route("/cuisines").get(BBTSquareCtrl.apiGetDataCuisines)

router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router