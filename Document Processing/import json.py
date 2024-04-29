import json

def format_and_purify_json(json_string):
    # Remove comments (lines starting with //)
    cleaned_json_string = '\n'.join(line for line in json_string.split('\n') if not line.strip().startswith('//'))

    # Replace unquoted keys with quoted keys
    quoted_keys = cleaned_json_string.replace(r'{', '{"').replace(r':', '":').replace(r',', ',"').replace(': "', ':"')

    try:
        # Attempt to load the JSON string to check if it's valid
        json.loads(quoted_keys)
        # If loading is successful, return the formatted JSON string
        return quoted_keys
    except json.JSONDecodeError as e:
        # If loading fails, return an error message
        return f'Error: Invalid JSON format - {str(e)}'

data =''' {
"data": "[{\\n        question:\\\"me, I would be happy to dedicate a few\\\\nextra hours for the humanitarian cause.\\\",\\n        options:['As of','As for','As from','As to'],\\n        correct:\\\"B\\\",\\n        Explanation:'“As for me” here means that as long as I am\\\\nconcerned.'\\n    },\\n    {\\n        question:\\\"Choose the correct possessive form of the noun: \\\\n“The book belongs to \\",\\n        options:['lt's','It','Its’','Its'],\\n        correct:\\\"B\\\",\\n        Explanation:'“It” is the only correct objective pronoun, as it is the\\\\nobject of the sentence.'\\n    },\\n    {\\n        question:\\\"Are we __ to leave on vacation?\\\",\\n        options:['already','altogether','all together','all ready'],\\n        correct:\\\"D\\\",\\n        Explanation:'“All ready” is the most appropriate option.\\\\nalready means “by this/that time”, so it is unsuitable.'\\n    },\\n   \\n    {\\n        question:\\\"The railway system is very efficient as the train always arrive __time.\\\",\\n        options:['Up','For','At','On'],\\n        correct:\\\"D\\\",\\n        Explanation:'We use “at” before time when we mention a specific time. As in — at 5 o’ clock. Else, Arrived on time is used generally which means arriving exactly at the scheduled time.'\\n    }\\n\\n]"
}'''

purified_json = format_and_purify_json(data)
print(purified_json)
