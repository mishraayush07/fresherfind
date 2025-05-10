# API Key Configuration Guide

To use the AI chat feature, you need to set up the Groq API key correctly. Follow these steps:

## Step 1: Get an API Key from Groq

1. Go to [Groq Console](https://console.groq.com/signup) and create an account
2. Navigate to API Keys in your dashboard
3. Create a new API key with appropriate permissions
4. Copy the API key (it should start with "gsk_")

## Step 2: Add the API Key to .env.local

1. Open the `.env.local` file in the root of the project
2. Make sure it contains the following line:
```
GROQ_API_KEY=your_actual_api_key_here
```
3. Replace `your_actual_api_key_here` with the API key you copied

## Step 3: Check Model Access

Make sure your Groq account has access to the models used in the application:
- meta-llama/llama-3.3-70b-versatile (primary)
- llama3-8b-8192 (fallback)
- mixtral-8x7b-32768 (second fallback)

If you don't have access to these models, the application will show an error. You can modify the models used in `src/app/api/chat/route.js`.

## Tips for Troubleshooting

If you're still seeing API errors:

1. Verify the API key is correct (no extra spaces or characters)
2. Check that your Groq account has sufficient credits
3. Try using a different model that you know is accessible
4. Restart the development server after updating the .env.local file

Remember: Never share your API key publicly or commit it to version control! 