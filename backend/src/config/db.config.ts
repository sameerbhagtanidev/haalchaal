import { connect } from "mongoose";

export async function connectDB() {
    const url = process.env.DB_URL;

    if (!url) {
        console.error(
            `❌ Error connecting to Database : Connection URL is invalid`
        );
        process.exit(1);
    }

    try {
        await connect(url);
        console.log(`✅ Connected to Database.`);
    } catch (err) {
        console.error(`❌ Error connecting to Database : ${err}`);
        process.exit(1);
    }
}
