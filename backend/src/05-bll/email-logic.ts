import nodemailer from "nodemailer";

const CLIENT_ID ="668441723894-2uh5c005robpql58op9ilb7e4t9oq2nr.apps.googleusercontent.com"

const CLIENT_SECRET = "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"

const EMAIL_TEST_APP_PSWD="qauuonmraokhuzet"

const transport = nodemailer.createTransport({
    // service: "yahoo",
    // auth: {
    //     user: "george.proj57@yahoo.com",
    //     pass: "Q!123qazx",       
    // }
    //second 2 eliana
    // service: "gmail",
    // auth: {
    //     // type: 'OAuth2',
    //     user: "george.proj57@yahoo.com",
    //     pass: "Q!123qazx",       
    //     clientId:CLIENT_ID,
    //     clientSecret:CLIENT_SECRET,
    //     // accessToken:'ya29.a0ARrdaM_-WFhhpaG_EBQXJh3t5MfefFrPwW4rdTQ3NUvbSLlqMO9tW2vdEHHPMv0pLgIq1mZBUp7LvDspVoidqWhfeRAGKi3j9yh-OHm8_otnr0U993D-GwhHW5mv4p61dgs5BInV45_FzSHH_1geBoc1ICq4',

    // }
    //george
    service: "gmail",
    host:'smtp.gmail.com',
    auth: {
        user: "InexPriceOfficial@gmail.com",
        pass: EMAIL_TEST_APP_PSWD,       

    }
});

function sendEmail(to: string, subject: string, body: string) {
    return new Promise((resolve, reject) => {
        const message = { to, subject, text: body };
        transport.sendMail(message, (err, info) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(info);
        });
    });
}

export default sendEmail;