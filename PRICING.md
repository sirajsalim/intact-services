# Pricing: research and proposed rate card

Research done 24 Nov 2026 from published pages. Every figure links to its source below. The prices in the prototype are **examples** built from this research. The owner needs to approve real prices.

## The short version

INTACT sits between two markets:

| | Offshore staffing (unmanaged or lightly managed) | **INTACT (proposed)** | U.S. fractional HR | U.S. in-house hire |
|---|---|---|---|---|
| L1 coordinator / recruiter, full-time | $1,200–2,250/mo | **$2,400/mo** | $70–125/hr | $6,900–9,400/mo + ~$5,500 to hire |
| L2 generalist, full-time | $1,700–3,400/mo | **$3,600/mo** | $75–150/hr | ~$8,900/mo |
| L3 HR business partner | few published | **$5,200/mo** | $62–125/hr | ~$11,800/mo |
| L4 senior HR partner | ~$4,000–4,400/mo at most | **$7,200/mo** | $125–250/hr; $4–8K/mo for 1–2 days a week | ~$20,300/mo |

- **The old rates ($1,199–3,599) sat at the bottom of offshore staffing.** That reads as cheap labour, not a managed HR team.
- **The proposed rates sit just above offshore staffing.** That covers what INTACT adds: management, senior backup and a 30-day money-back guarantee, which almost no offshore provider offers.
- **They still cost 55–75% less than hiring in-house, and roughly a third of U.S. fractional HR rates.**

## Proposed rate card (examples)

Hours are per month; full-time is 160. Small blocks cost more per hour, the same way every fractional HR firm prices them (for example, Jumpstart HR charges $197/hr for 10 hrs but $167/hr for 40). The prototype uses `price = full-time price × (hours ÷ 160)^0.75`, rounded to $10.

| Level | 20 hrs | 40 hrs | 80 hrs | 120 hrs | 160 hrs (full-time) | per hour at 20 → 160 hrs | In-house, fully loaded |
|---|---|---|---|---|---|---|---|
| L1 Coordinator / Recruiter | $500 | $850 | $1,430 | $1,930 | **$2,400** | $25 → $15 | $6,900 / $9,400 |
| L2 Generalist | $760 | $1,270 | $2,140 | $2,900 | **$3,600** | $38 → $22.50 | $8,900 |
| L3 HR Business Partner | $1,090 | $1,840 | $3,090 | $4,190 | **$5,200** | $55 → $32.50 | $11,800 |
| L4 Senior HR Partner | $1,510 | $2,550 | $4,280 | $5,800 | **$7,200** | $76 → $45 | $20,300 |

Commitment discounts stay at 10% for 6 months and 15% for 12 months. Published offshore providers offer about 7–10% (MyOutDesk).

**If that's too big a jump for launch,** a middle step is L1 $1,800, L2 $2,800, L3 $4,000, L4 $5,500. That is still at the top of the offshore range, so it no longer looks like the cheapest option.

## Currencies and in-house cost by market (used on the site)

The site has a currency picker next to every price. It sets both the currency prices are shown in and the country used for the in-house comparison: **$ USD = the U.S.**, **£ GBP = England**, **AED = Dubai**. By default it picks GBP for U.K. time zones, AED for Dubai and USD for everyone else, and it remembers the visitor's choice.

Our prices are set in US$ and converted at example rates: **£0.75** per $1 (X-Rates showed 0.746 on 1 Nov 2026) and **AED 3.6725** per $1 (the dirham is pegged). Both are in `MARKETS` in `assets/js/site.js`. For launch, separate GBP and AED price lists may work better than converting; see the savings below.

In-house costs come from the owner's salary table (24 Nov 2026): average annual salary plus additional employer costs, giving the full annual cost of employment.

| Role | U.S. (USD) | England (GBP) | Dubai (AED) |
|---|---|---|---|
| HR Coordinator (L1) | $82,351 | £35,643 | AED 211,860 |
| HR Recruiter (L1) | $113,031 | £46,263 | AED 224,700 |
| HR Generalist (L2) | $106,267 | £63,533 | AED 276,060 |
| HR Business Partner (L3) | $141,606 | £62,383 | AED 481,500 |
| Senior HR Partner (L4) | $243,304 | £81,071 | AED 834,600 |

The site shows these per month (÷ 12), rounded to the nearest 100.

**What the savings come to, at full-time (160 hrs a month):**

| Role | U.S. | England | Dubai |
|---|---|---|---|
| HR Coordinator | $2,400 vs $6,900 · **65% less** | £1,800 vs £3,000 · **40% less** | AED 8,810 vs 17,700 · **50% less** |
| HR Recruiter | $2,400 vs $9,400 · **74% less** | £1,800 vs £3,900 · **54% less** | AED 8,810 vs 18,700 · **53% less** |
| HR Generalist | $3,600 vs $8,900 · **60% less** | £2,700 vs £5,300 · **49% less** | AED 13,220 vs 23,000 · **43% less** |
| HR Business Partner | $5,200 vs $11,800 · **56% less** | £3,900 vs £5,200 · **25% less** | AED 19,100 vs 40,100 · **52% less** |
| Senior HR Partner | $7,200 vs $20,300 · **65% less** | £5,400 vs £6,800 · **21% less** | AED 26,440 vs 69,600 · **62% less** |

Things to check:
- **England, L3 and L4:** the saving drops to 21–25% at full-time, because U.K. senior HR salaries are much lower than U.S. ones. That's still a saving, but a thin one. A cheaper GBP price list for senior roles may be worth considering.
- **England, HR Business Partner:** the table puts it slightly *below* the Generalist (£62,383 vs £63,533), although L3 is the more senior role. Worth double-checking.
- **U.S., Recruiter vs Generalist:** the in-house Recruiter costs more than the Generalist ($113,031 vs $106,267). That can be true of the market, but it's worth a second look.
- **Recruiting cost:** the "≈ $5,500 to recruit one" line is U.S. data (SHRM), so it only shows when $ USD is picked. The other markets just say "before recruiting costs".

## Earlier U.S. estimate (cross-check)

Before the owner's table, the U.S. comparison used public data: fully loaded cost = salary ÷ 0.70 ÷ 12. In private industry, wages are 70% of total compensation and benefits are 30% ([BLS ECEC, June 2026](https://www.bls.gov/news.release/ecec.nr0.htm)).

| Role | Salary used | Source | Per month |
|---|---|---|---|
| HR coordinator | $50,610 median (HR assistants) | BLS OEWS May 2025 | $6,025 |
| Recruiter | $75,940 median (HR specialists) | BLS OEWS May 2025 | $9,040 |
| HR generalist | $74,500 mid | [Robert Half 2027 Salary Guide](https://www.roberthalf.com/us/en/job-details/hr-generalist) | $8,869 |
| HR business partner | $104,750 mid | [Robert Half](https://www.roberthalf.com/us/en/job-details/hr-business-partner) | $12,470 |
| Senior HR (HR director) | $138,750 mid | [Robert Half](https://www.roberthalf.com/us/en/job-details/hr-director) | $16,518 |

Hiring costs come on top: about $5,475 per non-executive hire and a median of 39 days to fill the role ([SHRM 2025](https://www.shrm.org/mena/about/press-room/shrm-releases-2025-benchmarking-reports--how-does-your-organizat), [SHRM](https://www.shrm.org/topics-tools/research/recruiting-benchmarking)).

## Offshore staffing: published prices

| Provider | Role | Price | Notes |
|---|---|---|---|
| [Hire Overseas](https://hireoverseas.com/pricing) | Any role | $2,000–4,000/mo | Managed; 14-day money-back |
| [Wing Assistant](https://wingassistant.com/blog/hr-virtual-assistant-salary) | HR VA | $1,299–1,999/mo | Account manager; no trial |
| [MyOutDesk](https://www.myoutdesk.com/blog/hr-virtual-assistant-cost) | HR VA | $1,788–1,988/mo | Success manager; 6- and 12-month discounts |
| [VA Masters](https://vamasters.com/services/hr-recruitment) | HR / recruiting | $8.50–14/hr | Philippines |
| [Virtual Latinos](https://www.virtuallatinos.com/pricing) | Any role, 1–9+ yrs | $1,600–4,400/mo | Not managed |
| [Pearl Talent](https://www.pearltalent.com/pricing) | Any role | From $3,000/mo | Success manager |
| [Wisemonk](https://wisemonk.io/dedicated-recruiter) | Recruiter (India) | $1,199/mo | Month-to-month |
| [HR Ways](https://clutch.co/profile/hr-ways/recruiting-package) | Recruiter (Karachi) | $1,500/mo | Supervised |
| [Athena](https://www.athena.com/pricing) / [Prialto](https://www.prialto.com/pricing) | Managed EA | $3,000–3,600/mo | Fully managed with backup |

Money-back guarantees are rare in this market. Only Hire Overseas (14 days) and VirtualStaff.ph (30 days, first seat) publish one.

## U.S. fractional HR: published prices

| Provider | Service | Price |
|---|---|---|
| [Jumpstart HR](https://jumpstart-hr.com/product/flexible-hr-support-subscription/) | 10 / 20 / 40 hrs a month | $1,970 / $3,546 / $6,698 |
| [Savvy HR](https://www.savvyhrconsultingllc.com/small-business-subscription) | 4 / 8 / 12 hrs a month | $595 / $1,195 / $1,795 |
| [HR Business Partners](https://www.hrbponline.com/post/how-much-does-fractional-hr-cost) | 10 hrs a week | $2,900/mo |
| [FlexHR](https://www.flexhr.work/guides/fractional-chro-cost) | Head of People (about 1 day a week) / fractional CHRO (about 2 days) | From $4,000 / $8,000 a month |
| [Go Fractional](https://www.gofractional.com/insights/rates/human-resources-business-partner/united-states) | HRBP / CHRO, average rate | $115/hr / $174/hr |
| [Dover](https://dover.com/blog/fractional-recruiter-cost) | Fractional recruiter | $75–250/hr |
| [Bambee](https://www.capterra.com/p/250287/Bambee/pricing/) | HR manager by chat/email, by headcount | $299–2,499/mo |
| [Justworks](https://www.justworks.com/pricing) | PEO plus dedicated HR consulting | $79–124 plus $30 per employee per month |

Go Fractional and Dover sell fractional work themselves, so treat their numbers as interested benchmarks.
