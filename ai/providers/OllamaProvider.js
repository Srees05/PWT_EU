class OllamaProvider {

    constructor() {

        this.baseUrl =
            process.env.OLLAMA_URL ||
            'http://localhost:11434';

        this.model =
            process.env.OLLAMA_MODEL ||
            'llama3.2:3b';
    }


    async analyze(prompt) {

        const response = await fetch(
            `${this.baseUrl}/api/generate`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `Ollama API failed: ${response.status} ${response.statusText}`
            );
        }


        const data =
            await response.json();


        return data.response;
    }
}


module.exports =
    OllamaProvider;