const ApiClient =
    require('../../utils/api/ApiClient');

const ApiResponse =
    require('../../utils/api/ApiResponse');


class AuthService {

    constructor(request) {

        this.apiClient =
            new ApiClient(
                request,
                'https://restful-booker.herokuapp.com'
            );
    }


    // =========================================================
    // CREATE AUTH TOKEN
    // =========================================================

    async createToken(
        username = 'admin',
        password = 'password123'
    ) {

        const payload = {
            username,
            password
        };


        const response =
            await this.apiClient.post(
                '/auth',
                payload,
                {
                    headers: {
                        'Content-Type':
                            'application/json',

                        'Accept':
                            'application/json'
                    }
                }
            );


        const result =
            await ApiResponse.parse(
                response
            );


        // -----------------------------------------------------
        // Validate token exists before returning it
        // -----------------------------------------------------

        if (
            result.status !== 200 ||
            !result.body ||
            !result.body.token
        ) {

            throw new Error(
                `Authentication failed. Status: ${result.status}`
            );
        }


        return result.body.token;
    }
}


module.exports = AuthService;