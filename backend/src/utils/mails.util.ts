import transporter from "../config/mailProvider.config.js";
import AppError from "./AppError.util.js";
import { LOGIN_TEMPLATE } from "./mailTemplates.util.js";

export async function sendLoginEmail(email: string, loginToken: string) {
    const mailOptions = {
        from: `"HaalChaal" <${process.env.TRANSACTIONAL_DOMAIN}>`,
        to: email,
        subject: "Your Login Code",
        html: LOGIN_TEMPLATE.replace("{loginToken}", loginToken),
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err: any) {
        console.log(err);
        throw new AppError(500, err);
    }
}
