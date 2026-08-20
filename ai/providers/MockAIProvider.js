class MockAIProvider {

    async analyze(prompt) {

        return `
Failure Category:
UI / Locator Failure

Probable Root Cause:
The checkout element may not be available within the configured timeout.

Suggested Investigation:
1. Verify the locator.
2. Check page navigation/state.
3. Review screenshot and trace.
4. Confirm whether the application UI changed.
        `;
    }
}

module.exports = MockAIProvider;