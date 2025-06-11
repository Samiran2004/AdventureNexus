import { NextFunction, Response, Request } from 'express';
import createHttpError from 'http-errors';
import { config } from '../../config/config';
import Plan, { IPlan } from '../../Database/models/planModel';

export interface CustomRequestSplitCost extends Request {
    planId?: string;
    totalExpense: number;
    currency: string;
    participants: Participant[];
}

let names: string[] = [];
let emails: string[] = [];
let roles: string[] = [];

interface Participant {
    name: string;
    email: string;
    role: string;
    preferredPaymentMethod: string;
}

function dataFormat(
    req: CustomRequestSplitCost,
): void {
    if (typeof req.params.planId !== 'string') {
        req.params.planId = req.body.planId.toString();
    }
    if (typeof req.body.totalExpense !== 'number') {
        req.body.totalExpense = parseInt(req.body.totalExpense);
    }
    if (typeof req.body.currency !== 'string') {
        req.body.currency = req.body.currency.toString();
    }

    req.body.participants.forEach((participant: Participant, index: number) => {
        names[index] = participant.name;
        emails[index] = participant.email;
        roles[index] = participant.role;
    });
}

const splitCost = async (
    req: CustomRequestSplitCost,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const planId: string = req.params.id as string;

        //Search the Plan in databse...
        const plan: IPlan | null = await Plan.findById(planId);

        dataFormat(req, res, next);
        return res.status(200).send({
            status: 'success',
            data: req.body,
            names,
            emails,
            roles,
        });
    } catch (err) {
        if (config.env == 'development') {
            console.log(err);
        }
        return next(createHttpError(500, 'Internal Server Error!'));
    }
};

export default splitCost;
