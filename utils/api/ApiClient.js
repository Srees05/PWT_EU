class ApiClient {

    constructor(request, baseURL) {

        this.request = request;
        this.baseURL = baseURL;
    }


    // =====================================================
    // BUILD FULL URL
    // =====================================================

    buildUrl(endpoint) {

        if (!endpoint) {
            throw new Error('API endpoint is required.');
        }

        return `${this.baseURL}${endpoint}`;
    }


    // =====================================================
    // GET
    // =====================================================

    async get(
        endpoint,
        options = {}
    ) {

        return await this.request.get(
            this.buildUrl(endpoint),
            options
        );
    }


    // =====================================================
    // POST
    // =====================================================

    async post(
        endpoint,
        data = {},
        options = {}
    ) {

        return await this.request.post(
            this.buildUrl(endpoint),
            {
                ...options,
                data
            }
        );
    }


    // =====================================================
    // PUT
    // =====================================================

    async put(
        endpoint,
        data = {},
        options = {}
    ) {

        return await this.request.put(
            this.buildUrl(endpoint),
            {
                ...options,
                data
            }
        );
    }


    // =====================================================
    // PATCH
    // =====================================================

    async patch(
        endpoint,
        data = {},
        options = {}
    ) {

        return await this.request.patch(
            this.buildUrl(endpoint),
            {
                ...options,
                data
            }
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    async delete(
        endpoint,
        options = {}
    ) {

        return await this.request.delete(
            this.buildUrl(endpoint),
            options
        );
    }
}


module.exports = ApiClient;