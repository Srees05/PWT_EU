const { expect } = require('@playwright/test');

class ApiAssertions {

    // =========================================================
    // STATUS CODE
    // =========================================================

    static status(result, expectedStatus) {

        expect(
            result.status,
            `Expected HTTP ${expectedStatus}, but received ${result.status}`
        ).toBe(expectedStatus);
    }


    // =========================================================
    // SUCCESS RESPONSE - 2XX
    // =========================================================

    static success(result) {

        expect(
            result.status,
            `Expected successful 2xx response, but received ${result.status}`
        ).toBeGreaterThanOrEqual(200);

        expect(result.status).toBeLessThan(300);
    }


    // =========================================================
    // COMMON STATUS ASSERTIONS
    // =========================================================

    static created(result) {

        expect(
            [200, 201],
            `Expected successful create response, but received ${result.status}`
        ).toContain(result.status);
    }


    static noContent(result) {

        expect(result.status).toBe(204);
    }


    static notFound(result) {

        expect(result.status).toBe(404);
    }


    static unauthorized(result) {

        expect(result.status).toBe(401);
    }


    static forbidden(result) {

        expect(result.status).toBe(403);
    }


    static badRequest(result) {

        expect(result.status).toBe(400);
    }


    // =========================================================
    // RESPONSE BODY
    // =========================================================

    static bodyExists(result) {

        expect(result.body).not.toBeNull();
        expect(result.body).not.toBeUndefined();
    }


    // =========================================================
    // FIELD EXISTS
    // =========================================================

    static fieldExists(body, fieldName) {

        expect(body).toHaveProperty(fieldName);
    }


    // =========================================================
    // FIELD VALUE
    // =========================================================

    static fieldEquals(body, fieldName, expectedValue) {

        expect(body).toHaveProperty(
            fieldName,
            expectedValue
        );
    }


    // =========================================================
    // MULTIPLE FIELD VALIDATION
    // =========================================================

    static fieldsMatch(body, expectedData) {

        for (const [field, expectedValue]
            of Object.entries(expectedData)) {

            expect(
                body,
                `Expected field "${field}" to match`
            ).toHaveProperty(
                field,
                expectedValue
            );
        }
    }


    // =========================================================
    // HEADER EXISTS
    // =========================================================

    static headerExists(result, headerName) {

        const headers = result.headers;

        expect(
            headers[headerName.toLowerCase()]
        ).toBeDefined();
    }


    // =========================================================
    // HEADER VALUE
    // =========================================================

    static headerContains(
        result,
        headerName,
        expectedValue
    ) {

        const actualValue =
            result.headers[
                headerName.toLowerCase()
            ];

        expect(actualValue).toBeDefined();

        expect(actualValue).toContain(
            expectedValue
        );
    }


    // =========================================================
    // JSON CONTENT TYPE
    // =========================================================

    static jsonContentType(result) {

        this.headerContains(
            result,
            'content-type',
            'application/json'
        );
    }
}


module.exports = ApiAssertions;