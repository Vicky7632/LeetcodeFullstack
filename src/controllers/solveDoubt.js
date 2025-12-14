const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

        // Validate and clean up the 'messages' array before sending to the API
        const cleanedMessages = messages.map(msg => {
            // Ensure each message has a role and parts array
            if (!msg.role || !Array.isArray(msg.parts)) {
                console.warn("Malformed message found, skipping:", msg);
                return null; // Or handle error appropriately
            }

            // Clean each part within the message
            const cleanedParts = msg.parts.map(part => {
                if (part.text && typeof part.text === 'string' && part.text.trim() !== '') {
                    return { text: part.text };
                }
                // Add similar checks for inlineData or fileData if you expect images
                // else if (part.inlineData && part.inlineData.mimeType && part.inlineData.data) {
                //     return { inlineData: part.inlineData };
                // }
                // For now, if a part has no valid text, image data, it's considered invalid
                console.warn("Malformed part found in message, skipping:", part);
                return null;
            }).filter(p => p !== null); // Remove any null (invalid) parts

            // If a message has no valid parts after cleaning, return null for the message
            if (cleanedParts.length === 0) {
                console.warn("Message has no valid parts after cleaning, skipping:", msg);
                return null;
            }

            return {
                role: msg.role,
                parts: cleanedParts
            };
        }).filter(m => m !== null); // Remove any null (invalid) messages

        // If no valid messages remain, return an error or default behavior
        if (cleanedMessages.length === 0) {
            return res.status(400).json({
                message: "No valid messages provided in the request body."
            });
        }

        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: cleanedMessages, // Use the cleaned messages here
                config: {
                    systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${testCases}
[startCode]: ${startCode}


## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## INTERACTION GUIDELINES:

### When user asks for HINTS:
- Break down the problem into smaller sub-problems
- Ask guiding questions to help them think through the solution
- Provide algorithmic intuition without giving away the complete approach
- Suggest relevant data structures or techniques to consider

### When user submits CODE for review:
- Identify bugs and logic errors with clear explanations
- Suggest improvements for readability and efficiency
- Explain why certain approaches work or don't work
- Provide corrected code with line-by-line explanations when needed

### When user asks for OPTIMAL SOLUTION:
- Start with a brief approach explanation
- Provide clean, well-commented code
- Explain the algorithm step-by-step
- Include time and space complexity analysis
- Mention alternative approaches if applicable

### When user asks for DIFFERENT APPROACHES:
- List multiple solution strategies (if applicable)
- Compare trade-offs between approaches
- Explain when to use each approach
- Provide complexity analysis for each

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always response in the Language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems
- If asked about unrelated topics, politely redirect: "I can only help with the current DSA problem. What specific aspect of this problem would you like assistance with?"

## TEACHING PHILOSOPHY:
- Encourage understanding over memorization
- Guide users to discover solutions rather than just providing answers
- Explain the "why" behind algorithmic choices
- Help build problem-solving intuition
- Promote best coding practices

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem, not just to provide quick answers.
`},
            });

            res.status(200).json({ // Changed status to 200 for success
                message: response.text
            });
            console.log(response.text);
        }

        main();

    } catch (err) {
        console.error("Error in solveDoubt:", err); // Log the actual error
        res.status(500).json({
            message: "Internal server error",
            error: err.message // Optionally send error message for debugging
        });
    }
}

module.exports = solveDoubt;