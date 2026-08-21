const { test } = require('@playwright/test');

const AuthService =
    require('../../services/api/AuthService');

const BookingService =
    require('../../services/api/BookingService');

const ApiAssertions =
    require('../../utils/api/ApiAssertions');

const ApiDataFactory =
    require('../../utils/api/ApiDataFactory');

const SchemaValidator =
    require('../../utils/api/SchemaValidator');

const BookingSchema =
    require('../../schemas/api/BookingSchema.json');


test(
    'API E2E 02 - Auth, PATCH and Negative Validation @api @regression',
    async ({ request }) => {

        // =====================================================
        // SERVICES
        // =====================================================

        const authService =
            new AuthService(request);

        const bookingService =
            new BookingService(request);


        // =====================================================
        // TEST DATA
        // =====================================================

        const bookingData =
            ApiDataFactory.booking({
                additionalneeds: 'Dinner'
            });


        // =====================================================
        // AUTHENTICATION
        // =====================================================

        const validToken =
            await authService.createToken();


        // =====================================================
        // CREATE BOOKING
        // =====================================================

        const created =
            await bookingService.createBooking(
                bookingData
            );


        ApiAssertions.created(
            created
        );


        ApiAssertions.fieldExists(
            created.body,
            'bookingid'
        );


        const bookingId =
            created.bookingId;


        // =====================================================
        // GET + CONTRACT VALIDATION
        // =====================================================

        const retrieved =
            await bookingService.getBooking(
                bookingId
            );


        ApiAssertions.success(
            retrieved
        );


        SchemaValidator.validate(
            BookingSchema,
            retrieved.body
        );


        // =====================================================
        // PATCH WITH VALID AUTHENTICATION
        // =====================================================

        const patchData = {

            totalprice: 450,

            additionalneeds:
                'Dinner and Airport Pickup'
        };


        const validPatch =
            await bookingService.updateBooking(
                bookingId,
                patchData,
                validToken
            );


        ApiAssertions.success(
            validPatch
        );


        ApiAssertions.fieldEquals(
            validPatch.body,
            'totalprice',
            450
        );


        ApiAssertions.fieldEquals(
            validPatch.body,
            'additionalneeds',
            'Dinner and Airport Pickup'
        );


        // =====================================================
        // VERIFY PATCH PERSISTED
        // =====================================================

        const afterPatch =
            await bookingService.getBooking(
                bookingId
            );


        ApiAssertions.success(
            afterPatch
        );


        ApiAssertions.fieldEquals(
            afterPatch.body,
            'totalprice',
            450
        );


        ApiAssertions.fieldEquals(
            afterPatch.body,
            'additionalneeds',
            'Dinner and Airport Pickup'
        );


        // =====================================================
        // NEGATIVE TEST
        // PATCH WITH INVALID TOKEN
        // =====================================================

        const invalidToken =
            'INVALID_TOKEN';


        const unauthorizedPatch =
            await bookingService.updateBooking(
                bookingId,
                {
                    additionalneeds:
                        'Unauthorized Change'
                },
                invalidToken
            );


        ApiAssertions.forbidden(
            unauthorizedPatch
        );


        // =====================================================
        // VERIFY FAILED PATCH DID NOT MODIFY DATA
        // =====================================================

        const afterInvalidPatch =
            await bookingService.getBooking(
                bookingId
            );


        ApiAssertions.success(
            afterInvalidPatch
        );


        ApiAssertions.fieldEquals(
            afterInvalidPatch.body,
            'additionalneeds',
            'Dinner and Airport Pickup'
        );


        // =====================================================
        // NEGATIVE TEST
        // GET NON-EXISTING BOOKING
        // =====================================================

        const nonExistingBookingId =
            999999999;


        const notFound =
            await bookingService.getBooking(
                nonExistingBookingId
            );


        ApiAssertions.notFound(
            notFound
        );


        // =====================================================
        // CLEANUP
        // DELETE USING VALID TOKEN
        // =====================================================

        const deleted =
            await bookingService.deleteBooking(
                bookingId,
                validToken
            );


        ApiAssertions.status(
            deleted,
            201
        );


        // =====================================================
        // VERIFY CLEANUP
        // =====================================================

        const afterDelete =
            await bookingService.getBooking(
                bookingId
            );


        ApiAssertions.notFound(
            afterDelete
        );
    }
);