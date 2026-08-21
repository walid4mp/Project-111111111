# WarHex — نظام الدفع PayPal الجاهز

هذه النسخة تحتوي على:
- PayPal Sandbox وLive.
- إنشاء طلب الدفع من الخادم فقط.
- Capture من الخادم والتحقق من ملكية الطلب.
- USD وEUR.
- سجل مدفوعات في Supabase.
- إضافة الجواهر/VIP بعد الدفع فقط.
- منع تكرار منح المكافأة لنفس العملية (Idempotency).
- PayPal Webhook موثّق للتحقق من عمليات الدفع المكتملة.

## 1) الأسرار

انسخ `.env.example` إلى `.env.local` ثم اكتب بياناتك بنفسك:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYPAL_EUR_RATE=0.92
NEXT_PUBLIC_PAYPAL_EUR_RATE=0.92
```

**لا تضع PayPal Secret أو Supabase Service Role Key في أي متغير يبدأ بـ `NEXT_PUBLIC_` ولا ترفع `.env.local` إلى GitHub.**

## 2) Supabase

افتح Supabase → SQL Editor → New query، ثم شغّل ملف `supabase.sql` كاملًا.

قسم الدفع ينشئ جدول `payment_orders` ودالة `grant_payment_reward` التي تقفل سجل العملية وتمنع إضافة المكافأة مرتين.

## 3) تشغيل الاختبار

```bash
npm install
npm run build
npm run dev
```

ثم افتح `/store` وسجّل الدخول واختر باقة. أثناء الاختبار استخدم `PAYPAL_ENV=sandbox` وحساب Sandbox Personal/Buyer من PayPal Developer Dashboard.

## 4) Webhook

بعد نشر WarHex على HTTPS، من PayPal Developer Dashboard → التطبيق → Webhooks أنشئ:

`https://YOUR-DOMAIN/api/payments/paypal/webhook`

فعّل على الأقل:

`PAYMENT.CAPTURE.COMPLETED`

ثم ضع Webhook ID في:

`PAYPAL_WEBHOOK_ID=`

## 5) تشغيل Live

بعد نجاح Sandbox فقط:

```env
PAYPAL_ENV=live
PAYPAL_CLIENT_ID=LIVE_CLIENT_ID
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN
```

أنشئ أيضًا Webhook Live منفصل وضع ID الخاص به في `PAYPAL_WEBHOOK_ID`.

**Visa/Mastercard:** ظهور خيار البطاقة في PayPal Checkout يعتمد على أهلية حساب التاجر، بلد المشتري، إعدادات PayPal وطرق الدفع المتاحة؛ لذلك الواجهة لا تضمن أن البطاقة ستظهر لكل مستخدم.
