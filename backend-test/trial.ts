// import { v4 as uuidv4 } from 'uuid';
// mmmm

// if (!apiKey) {
  //     throw new Error("API key is not set");
  // }
  
  // const client = new TruvityClient({ apiKey });
  
  // async function createAndSearchFiles() {
    //   const blob =await client.files.fileUpload();
    //   const blobId1 = blob.blobId;
    //     await client.files.fileCreate({
      //       blobId: blobId1,
      //       body: {
        //         data: {
          //           filename: "test1"
          //         }
          //       }
          //     });
          //     const blob2 =await client.files.fileUpload();
          //     console.log(blob2); 
          //     const blobId2 = blob2.blobId;
          //     await client.files.fileCreate({
            //         blobId: blobId2,
            //         body: {
              //             data: {
                //                 filename: "test2"
                //             }
                //         }
                //       });
                //       const blob3 =await client.files.fileUpload();
                //       const blobId3 = blob3.blobId;
                //       await client.files.fileCreate({
                  //         blobId: blobId3,
                  //         body: {
                    //             data: {
                      //                 filename: "test3"
                      //             }
                      //         }
                      //     });
                      //     const files = await client.files.fileSearch();
                      //     // console.log(files);
                      // }
                      
                      // // createAndSearchFiles()
                      
                      


import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  console.log("Creating images directory...");
  fs.mkdirSync(imagesDir);
}

// Function to convert an image file to a Buffer
function convertImageToBuffer(imagePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Check if file exists first
    
    fs.readFile(imagePath, (err, data) => {
      resolve(data);
    });
  });
}

// Fix: Use correct path resolution
const imagePath = path.join(__dirname, "images", "MainAfter.jpg");

console.log("Attempting to read image from:", imagePath);
let fileBlob: Buffer;
convertImageToBuffer(imagePath)
.then((buffer) => {
   fileBlob=buffer;
  console.log("Successfully read image, buffer size:", buffer);
})
.catch((error) => {
  console.error("Error reading image:", error);
});
async function createAndSearchFiles(){
  const result = await client.files.fileUpload();
  return result
}
const blobidd = await createAndSearchFiles();

import { TruvityClient } from "@truvity/sdk";
import { ResourceFile, UploadResponse } from "@truvity/sdk/api";
const apiKey11 = "R2ArtuRsM85-xYn8IOEVVsJbIhhDSeBjVwDIwPCakJ-2C5SvdS7Jb0adBk8lbnsDY7Saq_pNuXcP99nUoyAH7RQrt8uzch36TlSSg8TYDpxyx_lWdvZLcn_rC86EtwgFOQb_TzeXMRSfUBTv188q_AsdR0AKB-XhSmBcUqPoc5r7PkEvh3e_HzmAOWBwJoXKURRHUEQjp6jcQXsUCb54hHknDZhmU9X7DqBLUqeadm1gzfnDc333sqHL99QtTtvEufagbjqpyGuLYiA8sy4y9gOuBFck1xnxYiNMOpUhJELWqqmP73Onj4Gb5W4G0O8SyM7yg68CLAEUN2eq6PiYzQ";
const client = new TruvityClient({ apiKey: apiKey11 });


// wait 
async function fileblob(blobidd: string){
  const result = await client.files.fileCreate({
    blobId:blobidd ,
    body: {
        data: {}
    }
  });
  return result;
  
}



async function creatingfile(timepass: string){
  const reuslt = await client.files.fileCreate({blobId:timepass, body:{data:{filename:"test1"}}});
  return reuslt;
}

const result1 = await creatingfile(blobidd.blobId);
console.log(result1);