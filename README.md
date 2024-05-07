# Next SAAS starter

Integrates: Nextjs, Typescript, MongoDB, custom auth, Stripe, Tailwind CSS, DaisyUI,

## Stripe

For local development, run

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhooks
```

## Cloudflare

Create an R2 bucket and set appropriate CORS

Generate API token and copy the values into .env
