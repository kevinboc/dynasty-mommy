import { NextFunction, Request, Response } from "express"
import { User, UserLeagues } from "../models/user"
import { compareSync, hash } from "bcrypt"
import { createToken, Token } from "../utils/jwt"
import { HttpSuccess, HttpError } from "../constants/constants"
import { AppError } from "../errors/app_error"
import config from "../config/config"
import { AppDataSource } from "../app"
import { addUserToLeagueSchema, userLogin, userSignUp } from "../schemas/user"

export async function login(req: Request, res: Response, next: NextFunction) {


    try {
        const { email, password } = await userLogin.parseAsync(req.body)

        //authenticate user
        const user = await AppDataSource.manager.findOneBy(User, { email: email })

        if (!user || !user.password) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "User Not Found" });
        }

        if (!compareSync(password, user!.password)) {
            return res.status(HttpError.UNAUTHORIZED).send({ message: "invalid credentials" })
        }
        else {
            const payload: Token = {
                id: user.id,
                email: email
            }
            const token = createToken(payload)
            return res.status(HttpSuccess.OK).header({ "Authentication": `Bearer ` + token }).end()
        }
    }
    catch (error) {
        next(error)
    }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, username } = await userSignUp.parseAsync(req.body)


        //check if user already exists in db
        const check = await AppDataSource.manager.findOneBy(User, { email: email })
        if (check) {
            throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "User Already Exists" })
        }
        const hashed_pw = await hash(password, config.salt_rounds)
        const user = AppDataSource.manager.create(User, { email: email, password: hashed_pw, username: username })
        const result = await AppDataSource.manager.save(User, user)
        // const user = new User({ email: email, password: hashed_pw })
        // const savedUser = await user.save()
        // console.log(savedUser)
        const payload: Token = {
            id: result.id,
            email: email
        }
        const token = createToken(payload)
        return res.status(HttpSuccess.CREATED).header({ "Authentication": `Bearer ${token}` }).send({ detail: "user created successfully" })

    }
    //hash pwd
    catch (err) {
        next(err)
    }
}

export async function addLeagueToUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { league } = await addUserToLeagueSchema.parseAsync(req.body)
        // const league = req.body.league;

        if (!req.user || !req.user.email || !req.user.user_id) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user = await AppDataSource.manager.findOneBy(User, { email: req.user.email })
        if (user == null) {
            throw new AppError({
                statusCode: HttpError.NOT_FOUND,
                message: "User not found",
            });
        }

        const check = await AppDataSource.manager.findOneBy(UserLeagues, {
            user: {
                email: req.user.email
            },
            league_id: league.id,
            platform: league.platform
        })

        if (check !== null) {
            throw new AppError({
                statusCode: HttpError.BAD_REQUEST,
                message: "League alrady exists for user",
            });
        }
        const newUserLeague = await AppDataSource.manager.save(UserLeagues, {
            userId: user.id,
            platform: league.platform,
            user: user,
            league_id: league.id
        })
        return res.status(HttpSuccess.OK).json({
            message: "League added successfully"
        });
        // const update = await User.findOneAndUpdate({ email: req.user?.email }, { $push: { leagues: req.body.leagues } })
    }
    catch (err) {
        next(err)
    }
}