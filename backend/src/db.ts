import mongoose from "mongoose";
import { DataSource } from "typeorm";

export const connectToDB = async (uri: string) => {
    await mongoose.connect(uri)
}
export const initDatasource = async (AppDataSource: DataSource) => {
    await AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}