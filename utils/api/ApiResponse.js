class ApiResponse {

    // =========================================================
    // PARSE API RESPONSE
    // =========================================================

    static async parse(response) {

        let body = null;

        const contentType =
            response.headers()['content-type'] || '';


        // -----------------------------------------------------
        // JSON RESPONSE
        // -----------------------------------------------------

        if (contentType.includes('application/json')) {

            try {

                body =
                    await response.json();

            } catch (error) {

                body = null;
            }

        }

        // -----------------------------------------------------
        // TEXT RESPONSE
        // -----------------------------------------------------

        else {

            try {

                body =
                    await response.text();

            } catch (error) {

                body = null;
            }
        }


        // -----------------------------------------------------
        // STANDARD RESPONSE OBJECT
        // -----------------------------------------------------

        return {

            response,

            status:
                response.status(),

            statusText:
                response.statusText(),

            ok:
                response.ok(),

            headers:
                response.headers(),

            body
        };
    }
}


module.exports = ApiResponse;