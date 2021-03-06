import BaseService from '../Base';
import dumpTask from '../../utils/dump';
import TaskModel from '../../database/models/task';
import Joi from 'joi';
import Exception from '../../utils/Exception';

export default class TaskUpdate extends BaseService {

    constructor(...args) {
        super(...args);
    }

    async validate(data) {
        const ruleSchema = Joi.object({
            user_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'user id').required(),
            task_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'task id').required(),
            description: Joi.string(),
            state: Joi.string().valid('todo', 'done')
        })
        const { error } = ruleSchema.validate(data)
        if (!error) return Promise.resolve(data)
        const exception = new Exception({
            code: error.message,
            fields: error
        });
        throw exception;
    }

    async execute(data) {
        const { user_id, task_id } = data
        const updateQuery = { ...data }
        const task = await TaskModel.findOneAndUpdate({ user_id, _id: task_id }, updateQuery, { new: true })
        return {
            data: task
        }
    }

}