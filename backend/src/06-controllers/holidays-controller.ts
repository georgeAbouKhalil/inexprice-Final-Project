import { HolidayModel } from '../03-models/holidays-model';
import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/holidays-logic";

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const holidays = await logic.getAllHolidays();
        response.json(holidays);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const holiday = await logic.getOneHoliday(_id);
        response.json(holiday);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const holiday = new HolidayModel(request.body);
        const addedHoliday= await logic.addHoliday(holiday);
        response.status(201).json(addedHoliday);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const holiday = new HolidayModel(request.body);
        const updatedHoliday = await logic.updateHoliday(holiday);
        response.json(updatedHoliday);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteHoliday(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
}); 

export default router;
