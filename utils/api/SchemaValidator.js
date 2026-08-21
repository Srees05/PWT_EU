const Ajv = require('ajv');

class SchemaValidator {

    // =========================================================
    // VALIDATE RESPONSE AGAINST JSON SCHEMA
    // =========================================================

    static validate(schema, responseBody) {

        const ajv = new Ajv({
            allErrors: true,
            strict: false
        });

        const validate =
            ajv.compile(schema);

        const isValid =
            validate(responseBody);


        if (!isValid) {

            const errors =
                JSON.stringify(
                    validate.errors,
                    null,
                    2
                );

            throw new Error(
                `API Schema Validation Failed:\n${errors}`
            );
        }


        return true;
    }
}

module.exports = SchemaValidator;