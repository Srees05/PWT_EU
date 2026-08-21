const ApiClient =
    require('../../utils/api/ApiClient');

const ApiResponse =
    require('../../utils/api/ApiResponse');


class BookingService {

    constructor(request) {

        this.apiClient =
            new ApiClient(
                request,
                'https://restful-booker.herokuapp.com'
            );
    }


    // =========================================================
    // COMMON HEADERS
    // =========================================================

    getJsonHeaders() {

        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }


    getAuthenticatedHeaders(token) {

        return {
            ...this.getJsonHeaders(),

            'Cookie': `token=${token}`
        };
    }


    // =========================================================
    // CREATE BOOKING
    // POST /booking
    // =========================================================

    async createBooking(bookingData) {

        const response =
            await this.apiClient.post(
                '/booking',
                bookingData,
                {
                    headers:
                        this.getJsonHeaders()
                }
            );


        const result =
            await ApiResponse.parse(
                response
            );


        return {
            ...result,

            bookingId:
                result.body?.bookingid,

            booking:
                result.body?.booking
        };
    }


    // =========================================================
    // GET BOOKING
    // GET /booking/{id}
    // =========================================================

    async getBooking(bookingId) {

        const response =
            await this.apiClient.get(
                `/booking/${bookingId}`,
                {
                    headers: {
                        'Accept':
                            'application/json'
                    }
                }
            );


        return await ApiResponse.parse(
            response
        );
    }


    // =========================================================
    // UPDATE BOOKING
    // PATCH /booking/{id}
    // =========================================================

    async updateBooking(
        bookingId,
        updateData,
        token
    ) {

        const response =
            await this.apiClient.patch(
                `/booking/${bookingId}`,
                updateData,
                {
                    headers:
                        this.getAuthenticatedHeaders(
                            token
                        )
                }
            );


        return await ApiResponse.parse(
            response
        );
    }


    // =========================================================
    // FULL UPDATE
    // PUT /booking/{id}
    // =========================================================

    async replaceBooking(
        bookingId,
        bookingData,
        token
    ) {

        const response =
            await this.apiClient.put(
                `/booking/${bookingId}`,
                bookingData,
                {
                    headers:
                        this.getAuthenticatedHeaders(
                            token
                        )
                }
            );


        return await ApiResponse.parse(
            response
        );
    }


    // =========================================================
    // DELETE BOOKING
    // DELETE /booking/{id}
    // =========================================================

    async deleteBooking(
        bookingId,
        token
    ) {

        const response =
            await this.apiClient.delete(
                `/booking/${bookingId}`,
                {
                    headers:
                        this.getAuthenticatedHeaders(
                            token
                        )
                }
            );


        return await ApiResponse.parse(
            response
        );
    }
}


module.exports = BookingService;