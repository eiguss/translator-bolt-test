import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI with error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key is not configured');
  }
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error.message);
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ 
        error: 'Text is required and cannot be empty' 
      });
    }

    if (!targetLanguage?.trim()) {
      return res.status(400).json({ 
        error: 'Target language is required and cannot be empty' 
      });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. Only respond with the translation, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "gpt-3.5-turbo",
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const translation = completion.choices[0].message.content.trim();
    
    if (!translation) {
      throw new Error('Empty translation received');
    }

    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error.message);
    
    // Handle different types of errors
    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Network error. Please check your internet connection.' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.' 
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Translation failed. Please try again.' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});