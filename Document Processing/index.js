const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const fs = require('fs')
const readline = require('readline')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors')
const { Console } = require("console")
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

const filePath = process.env.INPUT_FILE_LOCATION
function readLinesInBatches(filePath, batchSize, batchNumber) {
    let startLine = (batchNumber - 1) * batchSize;
    let endLine = batchNumber * batchSize;

    // Read the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Split the file content into lines
    const lines = fileContent.split('\n');

    // Extract lines for the specified batch
    const batchLines = lines.slice(startLine, endLine);

    return batchLines.join('\n');
}



app.listen(3000, async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    let completeData;
    console.log("Starting to process data...")
    for (let i = 1; i < 100; i++) {
        const batchSize = 300;
        const portionOfData = readLinesInBatches(filePath, batchSize, i);
        if (portionOfData === "") {
            break;
        } else {
            const prompt = `
            Valid JSON Data Format
            Prompt:
            It is a solved question paper can you please convert it to this form 
            The output must match the exect thing format below now enline no nothing
            please convert all data.
            [{
                question:"me, I would be happy to dedicate a few
                extra hours for the humanitarian cause.",
                options:['As of','As for','As from','As to'],
                correct:"B",
                Explanation:'“As for me” here means that as long as I am
                concerned.'
            }] 
            (For Ai:"" Donot use inverted commas,\n and other signature as it will blow up my code) and remove all the inveted commas if there are any in the prompt
            
            The data i want you to process:
    ${portionOfData}
    `
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text()
            completeData += text;
            completeData = completeData.replace("][", ",")
        }
        console.log("Portion Number: " + i + " Lines read: " + i * 300)
    }
    console.log("Completed.Writing file to the drive....")
    console.log(completeData)
    fs.writeFile(process.env.OUTPUT_FILE_LOCATION, completeData, 'utf8', (error) => {
        if (error) {
            console.error('An error occurred while writing to the file:', error);
            return;
        }
        console.log('File has been written successfully.');
    });
})