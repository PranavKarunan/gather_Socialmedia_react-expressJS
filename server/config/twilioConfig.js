import dotenv from "dotenv";
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNTS_ID;
const authToken = process.env.TWILIO_AUTHTOKEN_ID;
const serviceSID = process.env.TWILIO_SERVICES_ID;
import twilio from "twilio";
const client = twilio(accountSid, authToken);

const dosms = (noData) => {
  console.log(noData);
  let res = {};
  return new Promise(async (resolve, reject) => {
    try {
      const otp = await client.verify
        .services(serviceSID)
        .verifications.create({
          to: `+91${noData}`,
          channel: "sms",
        })
        .then((res) => {
          res.valid = false;
          resolve(res);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  });
};

const otpVerify = (otpData, noData) => {
  let resp = {};

  return new Promise(async (resolve, reject) => {
   const otp = await client.verify
      .services(serviceSID)
      .verificationChecks.create({
        to: `+91${noData}`,
        code: otpData,
      })
      .then((res) => {
        console.log("otp verified successfully");

        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        console.log("check ur error babe");
        console.log(err);
      });
  });
};

export { dosms, otpVerify };
