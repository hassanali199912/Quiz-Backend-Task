const express = require("express");
const router = express.Router();


/*======================= Users Routes =================================== */
router.use("/users", require("../main-routes/userBasicRoutes"));
/*======================= Users Routes =================================== */

/*======================= Quiz Routes =================================== */
router.use("/quizzes", require("../main-routes/quizRoutes"));
/*======================= Quiz Routes =================================== */

/*======================= Announcement Routes =================================== */
router.use("/announcements", require("../main-routes/announcementRoutes"));
/*======================= Announcement Routes =================================== */

module.exports = router;
