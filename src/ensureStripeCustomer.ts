import Stripe from "stripe";

const ensureStripeCustomer = ({
  email,
  name,
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2020-08-27",
    maxNetworkRetries: 3,
  }),
}: {
  email: string;
  name?: string;
  stripe?: Stripe;
}) =>
  stripe.customers
    .list({
      email,
    })
    .then((all) => all.data.find((c) => !name || c.name === name))
    .then((customer) =>
      customer
        ? Promise.resolve(customer)
        : stripe.customers.create({
            email,
            name,
          })
    );

export default ensureStripeCustomer;
