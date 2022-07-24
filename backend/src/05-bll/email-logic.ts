import nodemailer from "nodemailer";

const EMAIL_TEST_APP_PSWD = "qauuonmraokhuzet"

const transport = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
        user: "InexPriceOfficial@gmail.com",
        pass: EMAIL_TEST_APP_PSWD,

    }
});

function sendEmail(to: string, subject: string) {
    return new Promise((resolve, reject) => {
        const message = { to, subject, html: '<table style="width:100%" ><tr><img style="width:150px;margin-bottom:30px" src="https://i.imgur.com/0SKiD6J.png" ><hr></tr><tr><td ></td></tr></table><div style="position: relative; margin-left:25%; top:20px; width:60%";margin-top:30px> <b> Dear Customer,<br>Thank you for contacting InexPrice. This hereby confirms the receipt of your email.<br> Please note this inbox is monitored during business hours, Monday to Friday. We will get<br> back to you as soon as possible.<br>Best regards, </b> </div><br> <p style="font-weight: 600;margin-left:25%"> InexPrice</p> <a style="color:red;margin-left:25%"><u><b> InexPriceOfficial@gmail.com </b></u></a>' };
        transport.sendMail(message, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info);
        });
    });
}

function sendEmailAfterBuying(to: string, subject: string, cartItems: any[], orderDetails: any) {
    return new Promise((resolve, reject) => {
        let receipt = this.createReceiptFile(cartItems, orderDetails);
        const message = { to, subject, html: receipt };
        transport.sendMail(message, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info);
        });
    });
}


function createReceiptFile(cartItems, orderDetails) {
    let today = new Date()
  
    let receipt = `<table style="margin-left: auto;margin-right: auto;"><th><img style="width:150px;" src="https://i.imgur.com/0SKiD6J.png" ></th> </table>
        <div style="text-align: center;"><h1>Reception</h1> <h2>Thank you for buying from InexPrice!</h2>` +
        `<em>Here is your order from: ${today.toLocaleString()}:</em><br>`;


    receipt += `<table style="margin: auto; text-align: center;border: 1px solid; border-collapse: collapse">
            <thead>
            <tr style="border: 1px solid; border-collapse: collapse">
            <th style="width: 300px">Image Product</th>
            <th style="width: 300px">Product</th>
            <th style="width: 100px">Amount</th>
            <th style="width: 100px">Price</th>
            <th style="width: 100px">Total Price</th>
            </tr>
            </thead>`
    
            for (let item of cartItems) {
            receipt +=`
            <tbody style="margin: auto; text-align: center;border: 1px solid; border-collapse: collapse">
            <tr style="border: 1px solid; border-collapse: collapse" >
            <td style="width: 100px;"> <img style="width: 30px;" src="${item.product.img.toString()}"></td>
            <td style="width: 300px;"><b>${item.product.name.toUpperCase()}</b></td>
            <td style="width: 100px;">${item.quantity}</td>
            <td style="width: 100px;">${item.totalPrice}$</td>
            </tr>
            `
        }

        receipt += ` <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>${orderDetails.final_price}$</b></td>
        </tr>`
        receipt +=`
            </tbody>
            </table>
            `
        
    
        receipt +=
            `<br>
            <div style="text-align: left; margin-left: 20%"> 💳credit_card:  ${orderDetails.credit_card} <br>`+
            `🚚Shipping destination: ${orderDetails.delivery_city} <br>` +
            `Thanks for buying from us ${orderDetails.firstName}😃</div></div>`;





    return receipt;
}

export default { sendEmail, sendEmailAfterBuying, createReceiptFile };