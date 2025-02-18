import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

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

    if (!sourceLanguage?.trim()) {
      return res.status(400).json({ 
        error: 'Source language is required and cannot be empty' 
      });
    }

    const response = await axios.post('http://ollama:11434/api/chat', {
      model: "llama3",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only respond with the translation, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      stream: false
    });

    let translation = response.data.message?.content?.trim();
    
    if (!translation) {
      throw new Error('Empty translation received');
    }

    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error.message);
    console.error(error);
    
    // Handle different types of errors
    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Network error. Please check your internet connection.' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your configuration.' 
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