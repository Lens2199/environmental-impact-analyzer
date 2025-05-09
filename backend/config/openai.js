/**
 * OpenAI API configuration and prompts
 */
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for environmental impact analysis
const ANALYSIS_SYSTEM_PROMPT = `You are an environmental impact analyzer specialized in evaluating product sustainability. 
Analyze the provided product information and generate an environmental impact assessment with the following components:

1. Scores (scale of 1-10, where 10 is most sustainable):
   - Carbon Footprint Score: [1-10]
   - Water Usage Score: [1-10]
   - Resource Consumption Score: [1-10]
   - Overall Environmental Impact Score: [1-10]

2. Explanation: Provide a detailed explanation of the environmental impact assessment, including the reasoning behind each score and the key factors considered.

3. Suggestions: Offer specific recommendations for improving the product's environmental impact.

Format your response with clear section headings (Scores, Explanation, Suggestions) and ensure all scores are clearly labeled with their numeric values.`;

// Generate a product analysis using OpenAI
const generateProductAnalysis = async (productText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or other appropriate model
      messages: [
        {
          role: "system",
          content: ANALYSIS_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: productText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate product analysis. Please try again.');
  }
};

// System prompt for product comparison
const COMPARISON_SYSTEM_PROMPT = `You are an environmental impact analyzer specialized in comparing product sustainability.
Based on the environmental analyses of multiple products, provide a concise comparison highlighting:

1. The most environmentally friendly option and why
2. Key differences between products in terms of:
   - Carbon footprint
   - Water usage
   - Resource consumption
3. Summary of trade-offs between the products
4. Recommendations for consumers prioritizing sustainability

Keep your response focused on environmental impact factors and sustainability considerations.`;

// Generate a comparison analysis between products
const generateProductComparison = async (productAnalyses) => {
  try {
    // Format the product analyses for the comparison
    const productsText = productAnalyses.map((analysis, index) => {
      return `Product ${index + 1}: ${analysis.product?.name || 'Unnamed Product'}
Carbon Footprint: ${analysis.scores.carbon}/10
Water Usage: ${analysis.scores.water}/10
Resource Consumption: ${analysis.scores.resources}/10
Overall Score: ${analysis.scores.overall}/10
Details: ${analysis.explanation}`;
    }).join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or other appropriate model
      messages: [
        {
          role: "system",
          content: COMPARISON_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Compare these products based on their environmental impact:\n\n${productsText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API for comparison:', error);
    throw new Error('Failed to generate product comparison. Please try again.');
  }
};

module.exports = {
  openai,
  generateProductAnalysis,
  generateProductComparison
};