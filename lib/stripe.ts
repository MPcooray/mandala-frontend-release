import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from Stripe dashboard
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default stripePromise; 