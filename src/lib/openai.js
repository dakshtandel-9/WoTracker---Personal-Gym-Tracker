// OpenAI Chat API Integration for Food Analysis

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Analyze food description using OpenAI Chat API
 * @param {string} foodDescription - Description of food eaten (e.g., "rice 200g, chicken breast 100g")
 * @returns {Promise<{foods: Array<{name: string, quantity: string, calories: number, protein: number, carbs: number, fats: number, fiber: number}>, summary: string}>}
 */
export async function analyzeFoodText(foodDescription) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file');
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful diet assistant. When the user tells you what they ate, analyze the nutritional content and respond with a JSON object.

Always respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "foods": [
    {
      "name": "Food Name",
      "quantity": "amount with unit",
      "calories": number,
      "protein": number (in grams),
      "carbs": number (in grams),
      "fats": number (in grams),
      "fiber": number (in grams)
    }
  ],
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFats": number,
  "totalFiber": number,
  "summary": "Brief friendly summary of the meal"
}

Be accurate with nutritional values. Use standard nutritional databases as reference. If quantities aren't specified, assume reasonable serving sizes.`
                    },
                    {
                        role: 'user',
                        content: foodDescription
                    }
                ],
                max_tokens: 800,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to analyze food');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No response from AI');
        }

        // Parse the JSON response
        const result = JSON.parse(content.trim());

        // Validate the response structure
        if (!result.foods || !Array.isArray(result.foods)) {
            throw new Error('Invalid response format from AI');
        }

        return result;
    } catch (error) {
        console.error('Error analyzing food:', error);

        if (error.message.includes('API key')) {
            throw error;
        } else if (error.message.includes('JSON')) {
            throw new Error('Failed to parse AI response. Please try again.');
        } else {
            throw new Error(`Failed to analyze food: ${error.message}`);
        }
    }
}

/**
 * Continue conversation with the diet assistant
 * @param {Array} messages - Conversation history
 * @param {string} userMessage - New user message
 * @returns {Promise<{message: string, action?: string, foods?: Array}>}
 */
export async function chatWithAssistant(messages, userMessage) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a diet assistant. Calculate nutrition immediately without asking questions.

RULES:
1. When user provides food + ANY quantity, IMMEDIATELY calculate nutrition. Quantities can be:
   - Grams: "rice 200g", "chicken 100g"
   - Pieces/count: "10 apple", "2 eggs", "3 roti"
   - Cups/servings: "1 cup rice", "2 chapati"
   - Just a number before food: "1 banana", "5 almonds"
2. DO NOT ask follow-up questions - calculate with the info given
3. Use average/typical nutritional values
4. If user wants to edit values, they will tell you
5. Only ask for quantity if NOTHING is provided (e.g., user says just "rice" with no number)

Always respond with ONLY valid JSON (no markdown):
{
  "message": "🍗 Chicken Chilli (200g)\\n\\n📊 Nutrition:\\n• Calories: 350\\n• Protein: 28g\\n• Carbs: 12g\\n• Fats: 22g\\n• Fiber: 1g\\n\\nAdd this? (say 'yes' or edit values)",
  "action": "confirm_add",
  "foods": [
    {
      "name": "Chicken Chilli",
      "quantity": "200g",
      "calories": 350,
      "protein": 28,
      "carbs": 12,
      "fats": 22,
      "fiber": 1
    }
  ],
  "totalCalories": 350,
  "totalProtein": 28,
  "totalCarbs": 12,
  "totalFats": 22,
  "totalFiber": 1
}

If user gives ONLY food name (no weight):
{
  "message": "How much? (e.g., 100g, 1 cup, 1 piece)",
  "action": "ask_weight",
  "foods": null,
  "totalCalories": null,
  "totalProtein": null,
  "totalCarbs": null,
  "totalFats": null,
  "totalFiber": null
}

If user wants to edit (e.g., "make protein 30g"):
- Update the values and show new summary
- Keep foods array with updated values`
                    },
                    ...messages,
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 600,
                temperature: 0.3,
            }),
        });

        if (!response.ok) {
            var errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // ignore parse error
            }
            var errorMsg = 'Failed to get response';
            if (errorData && errorData.error && errorData.error.message) {
                errorMsg = errorData.error.message;
            }
            throw new Error(errorMsg);
        }

        var data = await response.json();
        var content = '';
        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            content = data.choices[0].message.content;
        }

        if (!content) {
            throw new Error('No response from AI');
        }

        // Clean up the response - remove markdown code blocks if present
        content = content.trim();
        if (content.startsWith('```json')) {
            content = content.slice(7);
        } else if (content.startsWith('```')) {
            content = content.slice(3);
        }
        if (content.endsWith('```')) {
            content = content.slice(0, -3);
        }
        content = content.trim();

        console.log('AI raw content:', content);

        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Content:', content);
            // Return a fallback response
            return {
                message: content,
                action: 'ask_details',
                foods: null,
                totalCalories: null,
                totalProtein: null,
                totalCarbs: null,
                totalFats: null,
                totalFiber: null
            };
        }
    } catch (error) {
        console.error('Error in chat:', error);
        throw new Error('Failed to get response. Please try again.');
    }
}
