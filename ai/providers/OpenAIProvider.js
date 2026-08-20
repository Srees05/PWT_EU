const OpenAI = require('openai');

class OpenAIProvider {

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async analyze(prompt) {

        const response = await this.client.responses.create({
            model: 'gpt-5.6',
            input: prompt
        });

        return response.output_text;
    }
}

module.exports = OpenAIProvider;