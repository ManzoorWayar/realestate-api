import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import speakeasy from "speakeasy"

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        index: {
            unique: true,
        },
        required: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    update_secret: {
        type: Object,
        select: false,
        default: speakeasy.generateSecret({ length: 32 }),
    },
    auth_secret: {
        type: Object,
        select: false,
        default: speakeasy.generateSecret({ length: 32 }),
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    image: {
        type: String,
    },
    resetPasswordToken: String,
},
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate()

    if (update.password) {
        const salt = await bcrypt.genSalt(10)
        update.password = await bcrypt.hash(update.password, salt)
    }

    next()
})

// Match users entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', UserSchema);

export default User;