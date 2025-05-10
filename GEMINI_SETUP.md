# Google Gemini AI Setup Guide

This guide will help you set up the Google Gemini AI integration for the CityLiving chatbot.

## What is Google Gemini AI?

Google Gemini is a family of multimodal AI models developed by Google DeepMind that can understand and generate text, images, and code. It powers our chatbot to provide intelligent and helpful responses about accommodation listings.

## Step 1: Get a Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) (https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Create API Key" (You may need to agree to terms of service first)
4. Copy your newly created API key

## Step 2: Set Up Environment Variables

1. Create or update the `.env.local` file in the root of your project with:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
2. Replace `your_api_key_here` with the actual API key you obtained in Step 1

3. Make sure the `.env.local` file is created in **both** of these locations:
   - Root directory: `city-listing-main/.env.local`
   - Nested directory: `city-listing-main/city-listing-main/.env.local`

4. Restart your development server after updating the environment variables

## Step 3: Understanding the Models

The chatbot uses the following Gemini models:

- **gemini-1.5-flash-latest**: Our default model, optimized for speed and efficiency
- **gemini-1.5-pro-latest**: A more powerful model for complex queries (configurable)

You can change which model is used by editing the `src/app/api/chat/route.js` file.

## Step 4: Usage Limits and Pricing

1. Google AI Studio offers a **free tier** with:
   - Access to Gemini models
   - Limited number of requests per minute/day
   - More than enough for development and testing

2. For production use, you may need to upgrade to a paid tier:
   - Visit the [Google AI Studio pricing page](https://ai.google.dev/pricing)
   - Current models have varying costs based on input/output tokens

## Troubleshooting

If you encounter any issues:

1. **"API key is missing" error**:
   - Verify your `.env.local` file exists in both locations
   - Make sure the API key is correctly formatted
   - Restart your development server

2. **Rate limit or quota exceeded**:
   - You may have hit the free tier limits
   - Wait some time before trying again or upgrade your plan

3. **Model not available error**:
   - Ensure you're using a valid model name
   - Some models may require additional permissions

4. **Network errors**:
   - Check your internet connection
   - Ensure your firewall isn't blocking requests to Google's APIs

## Security Best Practices

- Never commit your API key to version control
- Ensure `.env.local` is listed in your `.gitignore` file
- For production deployment, use environment variables in your hosting platform
- Consider implementing rate limiting to prevent abuse

## Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini Cookbook with Examples](https://github.com/google-gemini/cookbook)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompt_best_practices) 