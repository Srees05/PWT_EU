const OpenAIProvider = require('./providers/OpenAIProvider');
const ClaudeProvider = require('./providers/ClaudeProvider');
const OllamaProvider = require('./providers/OllamaProvider');

const buildFailurePrompt = require('./prompts/FailureAnalysisPrompt');

class FailureAnalyzer {

    constructor(provider = 'ollama') {

        switch (provider.toLowerCase()) {

            case 'openai':
                this.provider = new OpenAIProvider();
                break;

            case 'claude':
                this.provider = new ClaudeProvider();
                break;

            case 'ollama':
                this.provider = new OllamaProvider();
                break;

            default:
                throw new Error(`Unsupported AI Provider: ${provider}`);
        }
    }

    async analyze(failureDetails) {

        const prompt = buildFailurePrompt(failureDetails);

        return await this.provider.analyze(prompt);
    }
}

module.exports = FailureAnalyzer;