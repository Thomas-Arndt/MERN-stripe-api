const stripe = require("stripe")('sk_test_51KbqcQHFjmgpUD3XUFdJGOpnilRT4FrkKx2TF4vL1PAYjvjatAZySz5mzHVcZqhsOni7zk8r2QWw9qP233IeunoF00pto0IUaO')
module.exports = app => {

    app.post("/api/create-payment-intent", async (req, res) => {
        const { items } = req.body;
        
        const calcualteOrderAmount = (items) => {
            let total = 0;
            for(item of items) {
                total += item.price;
            }
            return total;
        }

        const paymentIntent = await stripe.paymentIntents.create({
                amount: calcualteOrderAmount(items),
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true
                },
                receipt_email: 'arndtt42@gmail.com'
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    });

    app.post("/api/webhook", (req, res) => {
        let event = req.body;


        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return 200;

    })

};