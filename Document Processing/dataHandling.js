/// javascript interpreter

const express = require('express');
const json = require('json')
const app = express();
function formatJson(jsonString) {
    // Remove comments (lines starting with //)
    var cleanedJsonString = jsonString.replace(/\/\/.*/g, '');
    // Remove all occurrences of newline characters (\n) and escape characters (\)
    cleanedJsonString = cleanedJsonString.replace(/\\n/g, '').replace(/\\/g, '');

    // Replace unquoted keys with quoted keys
    const quotedKeys = cleanedJsonString.replace(/([\{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');

    // Replace single quotes with double quotes
    const doubleQuotedJsonString = quotedKeys.replace(/'/g, '"');

    return doubleQuotedJsonString;
}

const data = `{
    "data": "[{\\n        question:\\\"me, I would be happy to dedicate a few\\\\nextra hours for the humanitarian cause.\\\",\\n        options:['As of','As for','As from','As to'],\\n        correct:\\\"B\\\",\\n        Explanation:'“As for me” here means that as long as I am\\\\nconcerned.'\\n    },\\n    {\\n        question:\\\"Choose the correct possessive form of the noun: \\\\n“The book belongs to \\",\\n        options:['lt's','It','Its’','Its'],\\n        correct:\\\"B\\\",\\n        Explanation:'“It” is the only correct objective pronoun, as it is the\\\\nobject of the sentence.'\\n    },\\n    {\\n        question:\\\"Are we __ to leave on vacation?\\\",\\n        options:['already','altogether','all together','all ready'],\\n        correct:\\\"D\\\",\\n        Explanation:'“All ready” is the most appropriate option.\\\\nalready means “by this/that time”, so it is unsuitable.'\\n    },\\n   \\n    {\\n        question:\\\"The railway system is very efficient as the train always arrive __time.\\\",\\n        options:['Up','For','At','On'],\\n        correct:\\\"D\\\",\\n        Explanation:'We use “at” before time when we mention a specific time. As in — at 5 o’ clock. Else, Arrived on time is used generally which means arriving exactly at the scheduled time.'\\n    }\\n\\n]"
}`;

const dataArray = formatJson(data);

console.log(JSON.parse(dataArray));
app.listen(3001, function () {
    console.log("listening on port 3001")
})