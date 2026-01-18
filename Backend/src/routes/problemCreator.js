const express = require('express');
const problemRouter =  express.Router();
const userMiddleware=require("../middleware/userMiddleware")
const adminMiddleware=require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require('../controllers/userProblem');
//create
//fetch
//update
//delete
//solved by user
//through admin only patch delete and create
problemRouter.post("/create",adminMiddleware,createProblem);
 problemRouter.put("/update/:id",adminMiddleware,updateProblem);
 problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);
// // fetch problem all,by id,problem solved by user
 problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
 problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
 problemRouter.get('/problemSolvedByUser',userMiddleware,solvedAllProblembyUser);
 problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);

module.exports=problemRouter;

