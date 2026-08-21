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
    'API E2E 01 - Booking Lifecycle @api @regression',
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
            ApiDataFactory.booking();


        // =====================================================
        // AUTHENTICATION
        // =====================================================

        const token =
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
        // VALIDATE CREATED BOOKING
        // =====================================================

        ApiAssertions.fieldsMatch(
            created.booking,
            bookingData
        );


        // =====================================================
        // GET BOOKING
        // =====================================================

        const retrieved =
            await bookingService.getBooking(
                bookingId
            );


        // HTTP Status Validation
        ApiAssertions.success(
            retrieved
        );


        // Response Header Validation
        ApiAssertions.jsonContentType(
            retrieved
        );


        // JSON Contract / Schema Validation
        SchemaValidator.validate(
            BookingSchema,
            retrieved.body
        );


        // Business Data Validation
        ApiAssertions.fieldsMatch(
            retrieved.body,
            bookingData
        );


        // =====================================================
        // PARTIAL UPDATE
        // =====================================================

        const updateData = {

            additionalneeds:
                'Airport Pickup'
        };


        const updated =
            await bookingService.updateBooking(
                bookingId,
                updateData,
                token
            );


        ApiAssertions.success(
            updated
        );


        ApiAssertions.fieldEquals(
            updated.body,
            'additionalneeds',
            'Airport Pickup'
        );


        // =====================================================
        // VERIFY UPDATE IS PERSISTED
        // =====================================================

        const verified =
            await bookingService.getBooking(
                bookingId
            );


        ApiAssertions.success(
            verified
        );


        ApiAssertions.fieldEquals(
            verified.body,
            'additionalneeds',
            'Airport Pickup'
        );


        // =====================================================
        // DELETE BOOKING
        // =====================================================

        const deleted =
            await bookingService.deleteBooking(
                bookingId,
                token
            );


        ApiAssertions.status(
            deleted,
            201
        );


        // =====================================================
        // NEGATIVE VALIDATION AFTER DELETE
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