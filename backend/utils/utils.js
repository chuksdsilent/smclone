import cloudinaryModule from "cloudinary";
const cloudinaryModules = cloudinaryModule.v2;
import AWS from "aws-sdk";
import * as fs from "fs";

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

cloudinaryModules.config({
  cloud_name: "dzfzxbmzu",
  api_key: "347646623591883",
  api_secret: "l-JJNT2a3NGH-9RkMNSOIPh3CX8",
});
const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const uploadImage = image => {
  return new Promise((resolve, reject) => {
    cloudinaryModules.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

export const uploads3Image = image => {
  let data;
  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  try {
    var buf = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const params = {
      Bucket: "sm-bucket-2023",
      Key: generateData(10) + "_" + Date.now(),
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    return promiseUpload(s3, params);
  } catch (error) {
    return error;
    console.log(error);
  }
};

/**
 * @description Promise an upload to S3
 * @param params S3 bucket params
 * @return data/err S3 response object
 */
function promiseUpload(s3Bucket, params) {
  return new Promise(function (resolve, reject) {
    s3Bucket.upload(params, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

function generateData(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
