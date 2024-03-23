const Users = require("../Models/Users")
const { ValidationError } = require('mongoose').Error;

const addUser = async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.body.email })
        if (user) {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error(`User already exists with the given email id : ${req.body.email.trim()}`);
            throw validationError;
        }
        user = await Users.findOne({ mobileNo: req.body.mobileNo })
        if (user) {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error(`User already exists with the given mobileNo: ${req.body.mobileNo}`);
            throw validationError;
        }
        const newUser = new Users(req.body);
        const savedNewUser = await newUser.save();
        return res.status(201).json({ message: "User Saved to database successfully", data: savedNewUser });
    } catch (error) {
        console.log("heloo")
        next(error)
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await Users.find({ deleted: { $ne: true } })
        return res.status(200).json({ totalUsers: users.length, data: users })
    } catch (error) {
        next(error)
    }
}

const getUsersByFilter = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, age, name, userId, email, gender, mobileNo, deleted } = req.query;
        const errors = [];

        const filterUser = {};

        if (age && !isNaN(age)) {
            filterUser.age = parseInt(age);
        } else if (age) {
            errors.push("Age must be number")
        }
        if (name) filterUser.name = name;
        if (userId) filterUser.userId = userId;

        if (email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            filterUser.email = email;
        }
        else if (email) {
            errors.push("Please Enter a valid email address");
        }


        if (gender && ["Male", "Female", "Other"].includes(gender)) {
            filterUser.gender = gender;
        }
        else if (gender) {
            errors.push("Gender must be either Male, Female, or Other");
        }

        if (mobileNo && /^\d{10}$/.test(mobileNo)) {
            filterUser.mobileNo = mobileNo;
        }
        else if (mobileNo) {
            errors.push("Please fill a valid 10-digit mobile number");
        }

        if (deleted === "true") {
            filterUser.deleted = true;
        }
        else if (deleted === "false") {
            filterUser.deleted = false;
        }
        else if (deleted !== undefined && typeof deleted !== 'boolean') {
            errors.push("Deleted field must be a boolean")
        }
        else if (deleted === undefined) {
            filterUser.deleted = false
        }

        if (errors.length > 0) {
            const validationError = new ValidationError();
            validationError.errors = errors.map((error) => ({ message: error }));
            throw validationError;
        }
        const users = await Users.find(filterUser)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const usersCount = await Users.countDocuments(filterUser);
        const totalPages = Math.ceil(usersCount / limit);


        return res.status(200).json({
            totalUsers: users.length,
            paginationMetadata: {
                currentPage: page,
                totalPages: totalPages
            },
            data: users
        });
    } catch (error) {
        next(error);
    }
}



const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await Users.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ message: `User not found with the given userId = ${userId}` })
        }

        const { name, email, age, gender, address, mobileNo, deleted } = req.body

        if (!name && !email && !age && !gender && !address && !mobileNo && deleted === undefined) {
            return res.status(400).json({ message: "No fields to update" });
        }

        if (deleted !== undefined && typeof deleted !== 'boolean') {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error('Deleted field must be a boolean');
            throw validationError;
        } else if (deleted !== undefined && deleted === true) {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error('Deleted field cannot be marked as deleted using this endpoint');
            throw validationError;
        }

        const updateUser = { name, email, age, gender, address, mobileNo, deleted };


        const updatedUser = await Users.findByIdAndUpdate(userId, { $set: updateUser }, { new: true, runValidators: true });

        return res.status(200).json({ message: "User updated successfully", data: updatedUser })
    } catch (error) {
        next(error)
    }
}

const updateUserByEmail = async (req, res, next) => {
    try {
        const emailId = req.params.emailId
        const user = await Users.findOne({ email: emailId })

        if (!user) {
            return res.status(404).json({ message: `User not found with the given emailId = ${emailId}` })
        }

        const { name, email, age, gender, address, mobileNo, deleted } = req.body

        if (!name && !email && !age && !gender && !address && !mobileNo && deleted === undefined) {
            return res.status(400).json({ message: "No fields to update" });
        }

        if (deleted !== undefined && typeof deleted !== 'boolean') {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error('Deleted field must be a boolean');
            throw validationError;
        } else if (deleted !== undefined && deleted === true) {
            const validationError = new ValidationError();
            validationError.errors.deleted = new Error('Deleted field cannot be marked as deleted using this endpoint');
            throw validationError;
        }

        const updateUser = { name, email, age, gender, address, mobileNo, deleted };

        const updatedUser = await Users.findOneAndUpdate({ email: emailId }, { $set: updateUser }, { new: true, runValidators: true });

        return res.status(200).json({ message: "User updated successfully", data: updatedUser })
    } catch (error) {
        next(error)
    }
}

const softDeleteUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findOne({ _id: userId, deleted: { $ne: true } })


        if (!user) {
            return res.status(404).json({ message: `User not found with the given userId = ${userId}` });
        }

        const softDeleteUser = { deleted: true };
        await Users.findByIdAndUpdate(userId, { $set: softDeleteUser }, { new: true });

        return res.status(200).json({ message: "User soft deleted successfully" });
    } catch (error) {
        next(error);
    }
};
const softDeleteUserByEmailId = async (req, res, next) => {
    try {
        const emailId = req.params.emailId;
        const user = await Users.findOne({ email: emailId, deleted: { $ne: true } })

        if (!user) {
            return res.status(404).json({ message: `User not found with the given emailID = ${emailId}` });
        }

        const softDeleteUser = { deleted: true };
        await Users.findOneAndDelete({ email: emailId }, { $set: softDeleteUser }, { new: true });

        return res.status(200).json({ message: "User soft deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const hardDeleteUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findOne({ _id: userId, deleted: { $ne: true } })

        if (!user) {
            return res.status(404).json({ message: `User not found with the given userId = ${userId}` })
        }

        await Users.findByIdAndDelete(userId)
        return res.status(200).json({ message: "User removed from the database successfully" })

    } catch (error) {
        next(error)
    }
}
const hardDeleteUserByEmailId = async (req, res, next) => {
    try {
        const emailId = req.params.emailId;
        const user = await Users.findOne({ email: emailId, deleted: { $ne: true } })

        if (!user) {
            return res.status(404).json({ message: `User not found with the given emailId = ${emailId}` })
        }

        await Users.findOneAndDelete({ email: emailId })
        return res.status(200).json({ message: "User removed from the database successfully" })

    } catch (error) {
        next(error)
    }
}





module.exports = {
    addUser,
    getUsers,
    getUsersByFilter,
    updateUserById,
    updateUserByEmail,
    softDeleteUserById,
    softDeleteUserByEmailId,
    hardDeleteUserById,
    hardDeleteUserByEmailId,
}