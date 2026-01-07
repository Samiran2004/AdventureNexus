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

const names: string[] = [];
const emails: string[] = [];
const roles: string[] = [];

interface Participant {
    name: string;
    email: string;
    role: string;
    preferredPaymentMethod: string;
}

/**
 * Helper function to format request data.
 * Parses string inputs into correct types (numbers, string arrays).
 */
function dataFormat(req: CustomRequestSplitCost): void {
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

/**
 * Controller to Split Costs among participants.
 * Takes total expense and participants list and returns formatted data.
 * NOTE: This seems to be a calculation/utility endpoint, doesn't persist to DB currently.
 */
const splitCost = async (
    req: CustomRequestSplitCost,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        // const planId: string = req.params.id as string;
        // const plan: IPlan | null = await Plan.findById(planId);

        // 1. Parse and Format Input Data
        dataFormat(req);

        // 2. Return processed data (Calculation logic seems handled by frontend or simple echo here?)
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
