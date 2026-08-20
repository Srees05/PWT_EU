const Anthropic = require('@anthropic-ai/sdk');

class ClaudeProvider {

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }

    async analyze(prompt) {

        const response = await this.client.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        return response.content[0].text;
    }
}

module.exports = ClaudeProvider;