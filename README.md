# INTACT SERVICES · home page prototype

A one-page prototype of a simpler [intact-services.com](https://intact-services.com). It keeps the live site's look: the three colours, the fonts, the square edges and the hanging logo. It cuts the content, and gets a visitor from landing on the page to a booked call in a couple of taps.

**This is a prototype.** Prices are dummy values, and nothing a visitor types is sent anywhere.

## What's on the page

1. **Hero with a problem picker.** The headline is "Add HR capability, not HR headcount." Visitors pick a problem from one of two lists, "Just starting out" or "Already have HR". They then see the suggested role, can switch between 40, 80 or 160 hours a month, see the monthly price with the 30-day money-back guarantee, and get a **Book a call** button.
2. **How it works.** Three steps; the third is the 30-day money-back guarantee.
3. **Pricing: Pod calculator.** One +/− control per role, from L1 to L4, counted in hours a month (steps of 20; full-time = 160), with a running total. You can pick monthly, 6-month (10% off) or 12-month (15% off) billing. On phones a bar at the bottom shows the total.
4. **Why INTACT.** Three short points, plus a placeholder for a real client quote.
5. **Contact.** Book a call, WhatsApp or email.
6. **Booking dialog.** Pick a day and time, then enter a name and email. No calendar is connected yet.

## Change the dummy values

Everything lives at the top of [`assets/js/site.js`](assets/js/site.js):

| What | Constant |
|---|---|
| Monthly price per role for one full-time person (160 hrs a month) | `ROLES`, `FULL_TIME` |
| Commitment discounts | `TERMS` |
| Hero problems, the role each one suggests, and its starting hours | `PROBLEMS` |
| Hour choices in the hero | `FINDER_HOURS` |
| Calculator step, maximum and default Pod | `STEP`, `MAX`, `POD_DEFAULT` |
| Dummy call times (UTC) | `SLOT_HOURS_UTC` |

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Before this could go live

- Swap in real prices, or decide to show only "from" prices.
- Connect a real booking tool (Calendly, Cal.com or similar) in place of the dummy dialog.
- Add real client proof: logos, quotes, team photos.
- Confirm business claims with the owner: the guarantee wording, "managed delivery", "U.S. business hours".
- The logo and favicon are loaded from intact-services.com. Copy them into `assets/` if this site needs to stand on its own.
- Port the page into the WordPress block theme, so the team can keep editing in WordPress.

## Files

```
index.html            the page
assets/css/site.css   theme and layout
assets/js/site.js     problem picker, Pod calculator, booking dialog
```
