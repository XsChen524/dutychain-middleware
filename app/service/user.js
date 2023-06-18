"use strict";

const Service = require("egg").Service;


class UserService extends Service {


    async createUser(body){
        const { name, description, role } = body;
        
        //============================================================================
        // user id auto increment implementation
        // ref: https://www.youtube.com/watch?v=_GkujEyjJm8
        let counter_val = await this.ctx.model.UserIdCounter.findOneAndUpdate(
            {id:"autoval"},
            {"$inc":{"seq":1}},
            {new: true}
        );

        let userId;
        if(!counter_val){
            const val = new this.ctx.model.UserIdCounter({
                id:"autoval",
                seq:1
            });
            val.save();
            userId = 1;
        }
        else{
            userId = counter_val.seq;
        }
        //============================================================================

        // add user info to database
        const user_data = new this.ctx.model.User({
            id: userId,
            name,
            description,
            role,
        });
        user_data.save();
        return userId;

    }

	async findAll() {
		const userInfo = await this.ctx.model.User.find();
		if (!userInfo) {
			return undefined;
		}
		return userInfo;
	}
}

module.exports = UserService;
