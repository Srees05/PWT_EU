class ApiDataFactory {

    static randomString(prefix = 'Test') {

        const unique =
            `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        return `${prefix}_${unique}`;
    }


    static randomNumber(min = 100, max = 999) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }


    static futureDate(daysFromToday = 1) {

        const date =
            new Date();

        date.setDate(
            date.getDate() + daysFromToday
        );

        return date
            .toISOString()
            .split('T')[0];
    }


    static booking(overrides = {}) {

        const defaultData = {

            firstname:
                this.randomString('First'),

            lastname:
                this.randomString('Last'),

            totalprice:
                this.randomNumber(
                    100,
                    500
                ),

            depositpaid:
                true,

            bookingdates: {

                checkin:
                    this.futureDate(1),

                checkout:
                    this.futureDate(5)
            },

            additionalneeds:
                'Breakfast'
        };


        return {
            ...defaultData,
            ...overrides,

            bookingdates: {
                ...defaultData.bookingdates,
                ...(overrides.bookingdates || {})
            }
        };
    }
}


module.exports = ApiDataFactory;