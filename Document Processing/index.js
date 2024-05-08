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
        const batchSize = 200;
        const portionOfData = readLinesInBatches(filePath, batchSize, i);
        if (portionOfData === "") {
            break;
        } else {
            const prompt = `
            You need to convert a solved question paper into JSON format. Correct any nonsensical questions, and add placeholders where necessary for fill-in-the-blank options. Ensure that the output adheres to the specified JSON format without any additional characters like line breaks or inverted commas. Include an example output to illustrate the expected JSON structure, ensuring that it captures the question, options, correct answer, and explanation for each question.
            ${portionOfData}
    `
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text()
            completeData += text;
            completeData = completeData.replace("][", ",")
        }
        console.log("Portion Number: " + i + " Lines read: " + i * 200)
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