const {
  addCareer,
  getCareers,
  updatedCareer,
  deleteCareer,
  getCareer,
} = require("../controller/CareerController");
const AsyncMiddleWare = require("../middleware/AsyncMiddleWare");

const router = require("express").Router();

router.post("/add-career", AsyncMiddleWare(addCareer));
router.get("/get-career", AsyncMiddleWare(getCareers));
router.get("/get-career/:careerId", AsyncMiddleWare(getCareer));
router.put("/put-career/:careerId", AsyncMiddleWare(updatedCareer));
router.delete("/delete-career/:careerId", AsyncMiddleWare(deleteCareer));

module.exports = router;
