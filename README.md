# @dexchange/pay

SDK officiel Node.js / TypeScript pour l'API DEXPAY - Paiements Mobile Money pour l'Afrique de l'Ouest.

## Installation

```bash
npm install @dexchange/pay
# ou
yarn add @dexchange/pay
# ou
pnpm add @dexchange/pay
```

## Démarrage rapide

```typescript
import DexPay from '@dexchange/pay';

const dexpay = new DexPay({
  apiKey: 'pk_test_xxx', // Votre clé publique
  apiSecret: 'sk_test_xxx', // Votre clé secrète
});

// Créer une session de paiement
const session = await dexpay.checkoutSessions.create({
  reference: 'ORDER_123',
  item_name: 'Premium Plan',
  amount: 10000, // 10,000 XOF
  currency: 'XOF',
  success_url: 'https://example.com/success',
  failure_url: 'https://example.com/cancel',
  webhook_url: 'https://example.com/webhook',
});

// Rediriger le client vers la page de paiement
console.log(session.data.payment_url);
```

## Checkout Sessions

### Créer une session

```typescript
const session = await dexpay.checkoutSessions.create({
  reference: 'ORDER_123',
  item_name: 'Abonnement Premium',
  amount: 10000,
  currency: 'XOF',
  success_url: 'https://example.com/success',
  failure_url: 'https://example.com/cancel',
  webhook_url: 'https://example.com/webhook',
  metadata: {
    user_id: '123',
    plan: 'premium',
  },
  expires_at: '2025-12-31T23:59:59Z', // Optionnel
});
```

### Récupérer une session

```typescript
// Par ID
const session = await dexpay.checkoutSessions.retrieve('session_id');

// Par référence
const session = await dexpay.checkoutSessions.retrieveByReference('ORDER_123');
```

### Lister les sessions

```typescript
const sessions = await dexpay.checkoutSessions.list({
  page: 1,
  limit: 10,
});
```

### Créer une tentative de paiement

```typescript
const attempt = await dexpay.checkoutSessions.createPaymentAttempt(
  'ORDER_123',
  {
    payment_method: 'MOBILE_MONEY',
    operator: 'wave', // wave, orange_money, mtn, moov
    countryISO: 'SN', // SN, CI, ML, BF, etc.
    customer: {
      name: 'Jean Dupont',
      phone: '+221771234567',
      email: 'jean@example.com',
    },
  },
);

// Rediriger vers la page de paiement de l'opérateur
console.log(attempt.data.payment_url);
```

## Products

### Créer un produit

```typescript
// Produit ponctuel
const product = await dexpay.products.create({
  name: 'T-Shirt',
  price: 5000,
  currency: 'XOF',
  type: 'ONE_TIME',
});

// Produit récurrent
const subscription = await dexpay.products.create({
  name: 'Premium Plan',
  price: 10000,
  currency: 'XOF',
  type: 'RECURRING',
  billing_period: 'MONTHLY',
});
```

### Lister les produits

```typescript
const products = await dexpay.products.list({
  page: 1,
  limit: 10,
  type: 'RECURRING',
  is_active: true,
});
```

### Mettre à jour un produit

```typescript
const updated = await dexpay.products.update('prod_123', {
  price: 15000,
  is_active: false,
});
```

## Customers

### Créer un client

```typescript
const customer = await dexpay.customers.create({
  name: 'Jean Dupont',
  email: 'jean@example.com',
  phone: '+221771234567',
  country: 'SN',
  metadata: {
    source: 'website',
  },
});
```

### Rechercher un client

```typescript
// Par email
const customers = await dexpay.customers.list({
  email: 'jean@example.com',
});

// Par téléphone
const customers = await dexpay.customers.list({
  phone: '+221771234567',
});
```

## Subscriptions

### Créer un abonnement

```typescript
const subscription = await dexpay.subscriptions.create({
  customer_id: 'cus_123',
  product_id: 'prod_456',
  metadata: {
    referral_code: 'ABC123',
  },
});
```

### Annuler un abonnement

```typescript
await dexpay.subscriptions.cancel('sub_123');
```

## Payouts (Retraits)

### Créer un payout

```typescript
const payout = await dexpay.payouts.create({
  amount: 10000,
  currency: 'XOF',
  destination_phone: '+221771234567',
  destination_details: {
    operator: 'wave',
    countryISO: 'SN',
    recipient_name: 'Jean Dupont',
  },
  metadata: {
    invoice_id: 'INV_123',
  },
});
```

### Lister les payouts

```typescript
const payouts = await dexpay.payouts.list({
  page: 1,
  limit: 10,
  status: 'COMPLETED',
});
```

### Récupérer un payout

```typescript
const payout = await dexpay.payouts.retrieve('payout_123');
```

### Annuler un payout

```typescript
// Uniquement possible si le statut est PENDING
const cancelled = await dexpay.payouts.cancel('payout_123', 'Demande client');
```

## Gestion des erreurs

```typescript
import DexPay, { DexPayError } from '@dexchange/pay';

try {
  const session = await dexpay.checkoutSessions.create({...});
} catch (error) {
  if (error instanceof DexPayError) {
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Status:', error.statusCode);
  }
}
```

## Webhooks

Pour recevoir les notifications de paiement, configurez un endpoint webhook :

```typescript
// Express.js example
app.post('/webhook', express.json(), (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'checkout.completed':
      console.log('Paiement réussi:', event.data);
      break;
    case 'checkout.failed':
      console.log('Paiement échoué:', event.data);
      break;
    case 'subscription.created':
      console.log('Abonnement créé:', event.data);
      break;
    case 'subscription.cancelled':
      console.log('Abonnement annulé:', event.data);
      break;
  }

  res.json({ received: true });
});
```

## Configuration avancée

```typescript
const dexpay = new DexPay({
  apiKey: 'pk_live_xxx',
  apiSecret: 'sk_live_xxx',
  baseUrl: 'https://api-dpay.dexchange.sn/api/v1', // Optionnel
  timeout: 60000, // 60 secondes
});
```

## Devises supportées

| Code | Devise                                                             |
| ---- | ------------------------------------------------------------------ |
| XOF  | Franc CFA BCEAO (Sénégal, Côte d'Ivoire, Mali, Burkina Faso, etc.) |
| XAF  | Franc CFA BEAC (Cameroun, Gabon, Congo, etc.)                      |
| GNF  | Franc Guinéen                                                      |

## Opérateurs supportés

| Opérateur    | Code           | Pays               |
| ------------ | -------------- | ------------------ |
| Wave         | `wave`         | SN, CI, ML, BF     |
| Orange Money | `orange_money` | SN, CI, ML, BF, GN |
| MTN          | `mtn`          | CI, BF             |
| Moov         | `moov`         | CI, BF             |

## Support

- 📧 Email: support@dexchange.sn
- 📖 Documentation: https://docs.dexpay.africa
- 🐛 Issues: https://github.com/DEXCHANGE-GROUP/dexpay-node/issues

## License

MIT © [DEXCHANGE GROUP](https://dexchange.sn)
