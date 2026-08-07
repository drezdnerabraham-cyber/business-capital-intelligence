# Business Capital Intelligence Engine — Research & Validation Report

**Prepared:** August 7, 2026
**Status:** RESEARCH ONLY. No software has been built. This document is the evidence base for a go/no-go decision and, if "go," a 30-day experiment design — not a build spec.

**Evidence classification used throughout:**
- **A — PROVEN / STRONG EVIDENCE**: corroborated by independent, non-vendor sources (statute text, government data, academic study, multiple independent trade-press reports)
- **B — PROMISING / SOME EVIDENCE**: directionally supported but resting on vendor claims, single sources, or reasonable analogy
- **C — EXPERIMENTAL / HYPOTHESIS**: plausible, no real evidence either way — must be tested, not assumed
- **D — NOT RECOMMENDED**: evidence points against it, or risk/cost clearly outweighs plausible benefit

Every factual claim below is additionally tagged **[VERIFIED FACT]**, **[VENDOR CLAIM]**, or **[INFERENCE]** per your instructions. Sources are linked inline.

---

## 0. Runflo Investigation (pre-work, completed before this research)

"Runflo" is an ambiguous name matching three different tools. All three were checked:

1. **`ruvnet/ruflo`** (67k-star GitHub "agent meta-harness," closest plausible match) — **disqualified**. Independently verified: CVE-2026-59726 ("RufRoot"), CVSS 10.0, unauthenticated RCE via its MCP bridge (The Hacker News, CSO Online, InfoWorld, SecurityWeek, Noma Security); a real, already-executed prompt-injection supply-chain attack (v3.1.0-alpha.55–3.5.2 shipped tool descriptions with hidden instructions that silently added the repo owner as a contributor to users' repos); an obfuscated preinstall script removed as a supply-chain risk in v3.5.3; fabricated "security scan" and consensus-verification features (`verifySignature()` returns `true` unconditionally); a security audit (#1375) closed by the maintainer without resolving the findings; 544 open issues.
2. **`runflo.dev`** ("Next.js of AI Agents," Temporal-based) — exact spelling match, but its domain is blocked by this environment's egress proxy and no public GitHub repo could be located. Unverifiable — no basis to trust or install.
3. **`soasme/runflow`** — legitimate but unrelated Python/HCL2 workflow CLI, irrelevant to this project.

**RUNFLO STATUS: NOT INSTALLED.** Even setting security aside, neither candidate adds anything Claude Code doesn't already provide natively (the Agent/Workflow multi-agent orchestration used to produce this very report). If a different, specific Runflo was intended, provide the URL and it will be re-checked — but neither public candidate will be installed.

---

## 1. Executive Recommendation

**Conditional GO — but on a narrower, evidence-weighted version of the plan than originally scoped, not the full 7-strategy vision.**

The research does **not** support building a broad "predictive Business Capital Intelligence Engine" on exotic public-record trigger signals (permits, licenses, hiring surges, review growth) as the primary differentiator. That is the part of the plan the adversarial research most directly undermines: the data is already commoditized by 6-8+ existing vendors selling to this exact industry, the one closest real-world analog (mortgage trigger leads) was just banned by federal law for the exact mechanism this plan proposes, and none of the "sounds smart" signals beyond UCC filings have any MCA-specific evidence connecting them to conversion.

The research **does** support three narrower, real advantages:
1. **A genuinely useful Funding Readiness Tool** — every competitor reviewed (Nav, Fundera, Lendio, LendingTree, Bankrate, SBA Lender Match) uses "answer questions → get sold as a lead" as the model; none show the score/reasoning *before* the contact-info gate. That gap is real, low-risk, and buildable cheaply.
2. **UCC-1 filing data used narrowly** — the one signal with real corroborated evidence (multiple independent underwriting sources converge on "3+ filings in 90 days = stacking"), applied to the specific, well-precedented use case of "refinance/consolidate your existing MCA stack," not general capital-need prospecting.
3. **Selective, compliance-reviewed referral partnerships** in underexploited categories (general contractors, SBA-decline-waterfall partnerships, ERC-firm client lists) rather than the saturated categories (equipment dealers, CPAs) every competitor already runs.

Treat permit/license/hiring/review-based trigger signals as **cheap, small, falsifiable experiments** inside the 30-day test — not as the thesis of the business.

---

## 2-6. MCA Lead-Market Research, What's Working, What's Saturated, What to Avoid, Competitive Analysis

### 2.1 Traditional lead-type findings (17 types studied)

| Lead type | Verdict | Grade |
|---|---|---|
| UCC leads | Public record, zero exclusivity by definition. deBanked forum thread literally titled "Why You Should Avoid UCC Leads Like The Plague." [VERIFIED FACT] Useful narrowly for stacking-detection, not prospecting. | D (as prospecting), C (as refinance-angle signal) |
| Aged leads | Documented practice of relabeling month-old leads as "24-hour" leads before resale [VENDOR-reported, corroborated pattern]. | D |
| "Fresh"/real-time leads | Often broadcast via ping-post to 3-8 buyers before "post," despite "real-time" marketing. | D |
| Shared vs. "exclusive" leads | Exclusivity is essentially unverifiable by the buyer; one vendor openly resells the same lead 3x under "semi-exclusive" tiers. | D |
| Live transfers | Solves speed-to-lead genuinely, but quality is unauditable; overseas call-center exclusivity fraud is a documented practitioner concern. | C |
| Trigger leads (credit-pull) | Direct mortgage analog was **federally banned** (Homebuyers Privacy Protection Act, signed Sept 5 2025, effective March 5 2026) after 74% of consumers reported unwanted contact post-application, 66% got 10+ contacts. [VERIFIED FACT] Business-purpose equivalent is an unresolved gray zone — personal-guarantor credit pulls arguably fall under similar logic; multiple states are independently restricting trigger leads further. | D |
| Purchased/scraped lists | Same underlying UCC/SOS source data resold under dozens of brand names. | D |
| Facebook/Instagram ads | Still works self-run, but needs real budget (vendor claims $30-40k/mo minimum for larger funders) and Meta financial-services ad scrutiny. | B (self-run only) |
| Google Search PPC | Genuine intent at click time, viable if self-run; **critical open compliance question**: whether Google's cash-advance ad ban (61-day min term, ≤36% APR for *personal* loans) extends to B2B MCA is unresolved — deBanked is reported to discuss "a ban on paid advertising for all things cash advance" broadly, unconfirmed. **Verify with Google directly before committing ad spend.** | B, pending compliance confirmation |
| Affiliate-network leads | Opaque, multi-tiered, unauditable; classic locus for incentivized/fraudulent traffic. | D |
| Call-center leads | This is the production back-end behind most of the shared/aged/fraud problems above — an input mechanism, not a source. | D |
| Lead marketplaces/ping-trees | Industry's own commentary calls this "The Scourge Of Lead Gen." [Industry-insider characterization] | D |
| SEO-generated leads | Proven at scale (NerdWallet, LendingTree, Bankrate, Fundera all built real businesses on it) but head terms ("business loan," "MCA") are owned by these incumbents; long-tail/vertical is the opportunity. | B (long-tail only) |
| Email-generated leads | Merchants reportedly receive 15-20 MCA cold emails/day. [VENDOR-reported, striking saturation datapoint] Practitioner pushback exists against inflated "90% open rate" claims from MCA email agencies. | D |
| SMS leads | TCPA prior-express-written-consent required; 10DLC registration ≠ consent; Q1 2025 TCPA class actions up 112% YoY, ~80% of suits now class actions, avg settlement $6.6M. QuoteWizard held liable for marketplace-level TCPA violations — direct precedent for liability flowing to whoever benefits from the text, not just the sender. | D without an auditable consent chain |
| Direct mail | Baseline ~4.4% response (2025 ANA/DMA benchmark) [VERIFIED FACT]; likely **under-exploited** precisely because competitor spend is concentrated on faster digital/phone channels. | B |
| Referral networks | Genuinely exclusive/first-party by construction — the only category that structurally escapes the resale-economics problem. | B-A (see §13) |

### 2.2 Bottom-line synthesis [our inference from the above, not any single source]

The traditional MCA lead market's core problem isn't fake data — most of it is real. The problem is that the profitable *middle* of the market (UCC, aged, ping-tree "fresh," affiliate, purchased lists) runs on a resale economic model: new lead acquisition can cost the vendor 50/lead, so the vendor only profits by reselling 2+ times, regardless of "exclusive" labeling. **Only three channels escape this by construction: (1) fully self-run first-party digital acquisition, (2) referral relationships, (3) live transfers with independently verified exclusivity (rarely achievable in practice).**

### 2.3 Regulatory backdrop (context for everything else)
- FTC has fined lead generators directly: ITMedia Solutions ($1.5M, 2022), Blue Global Media (2017), a CA lead generator banned from telemarketing/robocalls (Jan 2024). [VERIFIED FACT]
- NY AG sued Yellowstone Capital (MCA effective APRs up to 820%), discharging $534M in merchant debt; a follow-on Jan 2025 settlement recovered $1B+ from a 25-company network; NY AG separately sued an arbitration platform ("Rapid Ruling") alleged to have been created in coordination with an MCA company to write pro-funder arbitration rules. [VERIFIED FACT] This is the enforcement climate any MCA broker now operates inside.
- Market size: MCA sector >$30B annual funding volume, average deal ~$58k [deBanked, Jan 2026 — trade-press reporting, not independently re-verified]. CAC per funded deal reported $500-$3,000+; typical commission 3-8% to 8-15% of funded amount. On a $58k deal at ~10%, gross commission ≈$5,800 — thin margin after a $3,000 CAC once overhead/compliance is layered in. [mix of VENDOR CLAIM + our inference]

---

## 7-9. Capital-Demand Signals, Ranked, and Best Combinations

### 7.1 60 candidate signals (grouped)

**Physical expansion/real estate (9):** new commercial lease (2nd/3rd location), TI/build-out permit, renovation/remodel permit, certificate of occupancy issued, sign permit, change-of-use permit, demolition+rebuild permit sequence, warehouse/industrial lease, new location added to multi-location Google Business Profile.

**Licensing (10):** liquor license application, liquor license transfer, new general business license, new food-service health permit, health-inspection closure→reopening permit, new contractor license, new cannabis license, new childcare license, new salon/cosmetology license, medspa/aesthetics equipment-adjacent license.

**Corporate/legal entity (8):** new LLC/corp formation (EIN/SS-4), ownership/EIN change on existing business, registered-agent change, new DBA filing, M&A/acquisition record, new franchise unit opening, new franchise agreement signed, new trademark filing coinciding with expansion.

**Debt-stacking/distress (8):** new UCC-1 filing by a funder, 3+ UCC filings in 90 days ("stacking"), UCC-3 termination (prior advance paid off), judgment lien filed, tax lien filed, bankruptcy filing, NSF/overdraft frequency (post-application only, not a prospecting signal), prior MCA default on file (underwriting-only, not prospecting).

**Government/institutional (5):** new SAM.gov registration, new federal contract award, peer/competitor SBA loan funded nearby, SBA disaster/EIDL loan recipient in a declared-disaster area, historical PPP loan size as a revenue proxy.

**Workforce (5):** hiring surge/job-posting spike, multi-location simultaneous postings, WARN Act mass-layoff notice (risk flag, not growth signal), rapid headcount growth, seasonal hiring buildup.

**Fleet/logistics (3):** new USDOT/MC operating authority (FMCSA), fleet size increase on FMCSA Company Snapshot, commercial vehicle purchase/registration.

**Digital footprint (5):** rapid Google review-count growth, review velocity spike right after reopening, e-commerce website traffic growth, new POS/payment-processor signup (no legitimate third-party data feed exists for this — excluded from build), new Shopify/e-commerce storefront launch.

**Vertical-specific (7):** Certificate of Need filing (healthcare), new medical/dental equipment purchase, new NPPES provider-location registration, new DEA registration, new environmental/manufacturing permit, seasonal inventory buildup, regional auto-claims spike (speculative).

### 7.2 Ranked signal scoring (1-10 scale; our synthesis from the underlying research)

| Signal | Capital-need probability | Timing advantage | Freshness | Availability | Cost | Scalability | Automation difficulty | Competition | Contactability | Compliance risk | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| UCC-1 stacking (3+ filings/90 days) | 8 | 3 (lagging — financing already happened) | 6 | 6 (11-state API; 50-state needs enterprise) | 5 | 6 | 3 | 9 (commoditized, many vendors sell this) | 6 | 6 | **A** for the narrow refinance use case; **D** as a general "capital need" targeting signal |
| New federal contract award (SAM.gov/USASpending) | 6 | 8 (mobilization gap is real and timed) | 9 | 10 (free, no-auth API) | 10 (free) | 8 | 2 | 3 (underused by MCA brokers specifically) | 5 | 3 | **B** |
| New FMCSA operating authority (trucking) | 6 | 8 | 9 | 10 (free, FMCSA SAFER) | 10 (free) | 7 | 2 | 4 | 5 | 3 | **B** |
| New liquor license application | 5 | 7 | 7 | 5 (state-by-state, no national API) | 6 | 4 | 6 | 5 | 4 | 5 | **C** |
| New building/renovation permit | 4 | 6 | 7 | 4 (300+ city systems, or $599+/mo paid aggregator) | 4 | 5 | 7 | 6 | 4 | 5 | **C** |
| Hiring surge/job postings (standalone) | 3 | 5 | 7 | 6 (Revelio Labs, paid) | 4 | 6 | 4 | 6 | 5 | 4 | **C**, and vendors selling "buying signals" themselves rank isolated job postings as a *weak* standalone signal |
| Rapid review growth | 2 | 4 | 8 | 7 | 3 | 7 | 3 | 7 | 6 | 5 | **D** — platforms actively flag/suppress spikes as manipulation; no causal link to capital position established anywhere in this research |
| Franchise Item-20 unit growth | 7 | 6 | 5 | 5 (FRANdata, licensed) | 4 | 5 | 4 | 4 | 6 | 5 | **B** |
| Judgment/tax lien filed | 7 (need is real) | 2 (distress, not growth) | 6 | 6 | 5 | 6 | 4 | 6 | 4 | 4 | **C**, and underwriting-adverse — route to a restructuring product path, not standard growth outreach |
| Reddit/forum public funding-intent post | 4 (when found) | 9 (self-declared, real-time) | 3 (rare) | 1 (Reddit commercial API ≈$12k+/mo minimum, discretionary approval) | 1 | 1 | 9 | 2 | 2 (mostly pseudonymous) | 4 | **D** — see §10 |

### 7.3 Best signal combinations (our synthesis, underwriting-logic-grounded)

1. **Established restaurant + 2nd-location permit + liquor-license application + hiring surge at the new address.** Any one signal alone is ambiguous; together they triangulate a single narrative — a proven operator (verified via existing Location A history) actively opening Location B, with a concrete, time-boxed capital need before Location B has its own receivables.
2. **New FMCSA authority + zero existing UCC filings + CDL-driver job postings.** A "clean file" — real, well-understood cash-timing gap (freight-broker payment lag) with no stacking risk yet, confirmed as actually operating (not dormant) by the hiring signal.
3. **Federal contract award + no prior award history at this size.** Mobilization-gap financing need, with revenue independently verifiable via public record rather than self-reported bank statements — closer to "verified revenue" than any other combination.
4. **Renovation permit at an address with a recent health-inspection-forced closure, followed by a new health-permit application.** Converts an ambiguous distress signal into a time-boxed, milestone-verifiable need (reopening).
5. **Franchise Item-20 unit growth + new lease by an existing multi-unit franchisee.** Proven concept (system-wide FDD economics), proven operator, benchmarkable capital need (FDD Item 7 investment range) — stronger than #1 because the capital request can be sanity-checked against known unit economics.
6. **[Anti-pattern, explicitly flagged] New EIN/LLC + new lease + zero UCC history, with no franchise or multi-location track record.** Looks identical to #1/#5 on the surface but lacks any track record to underwrite against — score/price this differently (smaller advance, higher risk), don't treat it as equally strong.
7. **[Do-not-prospect pattern] 3+ UCC filings in 90 days + a recent judgment lien.** Genuine capital need, but this is the exact profile underwriting guides use to *decline* files. Route to a debt-consolidation product path or exclude from standard prospecting.

---

## 10. Public Funding-Intent Strategy — Grade: D (deprioritize)

Reddit's free API access effectively ended in 2023; by 2026 even the unauthenticated JSON endpoints scrapers relied on return 403s. [Reported across multiple 2026 developer sources; not independently confirmed at Reddit's primary page — egress-blocked in this research] Commercial API access is reported at ≈$0.24/1,000 calls with a ~$12,000/month minimum and requires Reddit's discretionary approval — and Reddit's policy explicitly calls out ad-targeting/outbound-solicitation as requiring separate written sign-off it does not appear to grant. Pushshift (the old free bulk-data route) is dead.

Even with compliant access: Reddit is pseudonymous by design; our estimate is that only 5-15% of funding-intent posts are plausibly tied to an identifiable, contactable real business [**INFERENCE**, no dataset exists]. Realistic national volume estimate: **15-150 usable leads/month across all relevant subreddits combined** [**INFERENCE** — order of magnitude only]. That is a boutique volume, not a scalable channel, and a bare public post is not TCPA/CAN-SPAM consent for any subsequent contact.

**Recommendation: do not build automated infrastructure around this. If pursued at all, treat as a single low-cost manual side-experiment (a person periodically reading 3-4 relevant subreddits and manually vetting/reaching out to self-identified businesses) — not a pipeline.**

---

## 11. Funding Readiness Tool Strategy — Grade: B (promising, build this)

Every existing competitor tool converts the questionnaire into a lead-capture funnel before delivering value:

| Tool | Mechanism | Gap |
|---|---|---|
| Nav.com | Free signup → matches from 160+ lenders; markets "2x more likely to be approved" [VENDOR CLAIM] | Recurring complaint pattern (BBB/Trustpilot/ConsumerAffairs): gated "optional" credit-monitoring upsells |
| Fundera (NerdWallet) | Questionnaire → soft pull → advisor calls | Users report a "barrage of calls" post-submission [aggregator-sourced] |
| Lendio | 15-min form → soft pull vs. 75-lender network → AI matching → funding expert contacts within hours | Most sophisticated matching engine found, still fundamentally a lead-distribution funnel |
| SBA Lender Match (official, sba.gov) | Free, no upsell, 2-business-day email with lender contacts | The one genuine non-commercial utility in the space — but slow, narrow (SBA only), no MCA/alt-lending |
| Bankrate | Comparison table → only the selected lender gets the lead | Single-lender model is more consumer-protective than the rest, still a rate table not a diagnostic |
| LendingTree | Form → **multiple lenders get the same lead simultaneously** | The "barrage of calls" model in its purest form |

**The gap every one of them leaves open:** none show the score and the reasoning *before* asking for contact info, and none give a real improvement path ("at 24 months in business you'd qualify for X instead of Y").

**What would make ours materially better** (design intent, not yet built):
1. Show score + reasoning breakdown before any phone-number gate.
2. Give an actual improvement path, not just a match.
3. Show real cost transparency (APR-equivalent alongside factor rate) proactively — this is also a defensibility asset against the FTC's active MCA-deception enforcement pattern (§23).
4. Be explicit about what happens to the data and who will follow up, before asking for it.

Quiz-funnel conversion-rate claims (40%+ opt-in, etc.) are **all VENDOR CLAIM** from companies selling quiz-building software — treat as directional at best, not a number to plan revenue around; measure your own funnel instead.

---

## 12. Search-Ad Strategy — Grade: B, pending one compliance confirmation

- Google requires financial-services advertiser verification/certification. [VERIFIED FACT, high confidence, though the primary policy page could not be directly loaded in this session — confirm before spend]
- Google's "Personal loans" policy bans cash-advance/payday/sub-61-day-term loans and caps APR at 36% for *personal* loans; **whether this extends to B2B merchant cash advance is not clearly resolved** by anything found in this research. One summarized source suggests a broader "ban on paid advertising for all things cash advance" — **this must be confirmed directly with Google Ads policy/support before committing any budget to MCA-labeled search campaigns.**
- CPC benchmarks are vendor-published (WordStream: all-industry avg $5.42, financial services $4-12+) — no credible source gives an exact CPC for "merchant cash advance" or "business loan" specifically; pull this live from Keyword Planner/SEMrush/Ahrefs rather than trusting a blog figure.
- **Best honest landing-page angle identified by this research, grounded in a real regulatory fact**: SBA loan programs can no longer be used to refinance existing MCA/factoring debt as of a June 2025 SBA policy change [reported across multiple lending trade sources]. A "stacked MCA, can't use SBA to refinance anymore — here's what still works" campaign is truthful, specific, and speaks to a real, structural pain point rather than a generic "get funded fast" claim.
- Tier 1 (transactional): "consolidate merchant cash advances," "MCA refinance," "business loan with existing debt," "get out of MCA stack." Tier 2 (comparison-stage): loan-type calculators/comparisons. Tier 3 (generic curiosity): "what is a business loan" — not worth premium bids.

---

## 13. Referral-Network Strategy — Grade: B, with a real compliance ceiling

**Legal baseline:** RESPA's anti-kickback rule does **not** apply to commercial/MCA financing — it's scoped to consumer residential mortgages only. [VERIFIED FACT] The "name-and-number referral fee is legal without a license" doctrine is real but **borrowed from commercial-mortgage practice, not built for MCA**, and it's narrowing fast:

| State | Requirement | Effective |
|---|---|---|
| Virginia | First state to require registration of both providers AND brokers of sales-based financing | Nov 2022 |
| Utah | CFRDA — registration + disclosure | Jan 2023 |
| Connecticut | Providers and brokers of sales-based financing ≤$250k must register | 2023 |
| Missouri | MCA providers must be licensed | 2024/2025 |
| Texas | HB 700 — NMLS registration required by Dec 31, 2026; penalties up to $10k/violation, $100k aggregate | Sept 2025 |
| California | SB 1235 disclosure regime in force; some reporting suggests a move toward licensing all commercial loan brokers [unconfirmed, developing] | Dec 2022+ |

The operative line: a referral partner who makes a passive "call this company" introduction is very likely outside these registration regimes; a partner who presents specific offers/terms is very likely inside them. **Referral agreements must contractually bar rate/term discussion and document collection by the partner.**

**Category ranking (best opportunity = least saturated + good proximity):**
- **Saturated already** (every MCA competitor runs a program here): equipment dealers/vendors, POS reps (often captive to their own in-house financing — Square Loans, Clover Capital — locking independents out of the best version of this channel anyway), CPAs (constrained further by AICPA independence rules on attest clients), franchise consultants.
- **Underexploited, worth prioritizing:** general contractors (real pain point — mobilization/progress-payment gaps — largely unexploited vs. equipment dealers), SBA-decline-waterfall partnerships with SBA packagers/CDCs (monetizes deals the packager was going to lose anyway), ERC/tax-resolution firms (proven-convertible client lists as ERC winds down), invoice-factoring brokers (natural cross-referral).
- **Legally fraught, use non-cash comp instead:** business attorneys (ABA Model Rule 5.4/7.2 and conflict-of-interest rules make cash referral fees genuinely risky — expect reciprocal non-cash arrangements, not commissions).

---

## 14. Calculator/Content SEO Strategy — Grade: B, long-tail only

NerdWallet, LendingTree, Fundera, and Bankrate have all built real lead-gen businesses on calculator content (NerdWallet's household-debt study alone reportedly drew 2,600+ referring domains [VENDOR/SEO-tool-derived, directionally informative]). **Head terms are dominated by these high-domain-authority incumbents; a standalone MCA company cannot realistically outrank them for "business loan calculator."**

25 tool ideas were generated across general, restaurant, retail, construction, trucking, and healthcare verticals (full list in the underlying research); the strongest opportunities are **vertical- and moment-specific long-tail tools where competition is thin**: contractor mobilization/progress-payment-gap calculator (validated pain point, thin competition — flagged as the single best opportunity), MCA factor-rate-to-APR true-cost calculator (bottom-of-funnel — searcher already knows the product), inventory/seasonal-cash-flow calculators for retail, owner-operator cost-per-mile calculator for trucking. Avoid competing head-on for "SBA loan calculator" or "working capital calculator" — that ground is already lost to incumbents.

---

## 15. Data-Source / API Table

*(Full 50+ row table with per-source cost/API/coverage/recommendation is in the underlying trigger-signal research; condensed to the sources actually worth using below.)*

| Category | Best source | Cost | Recommendation |
|---|---|---|---|
| Federal contracts/awards | USASpending.gov, SAM.gov | Free, no-auth REST API | **Use first** — cheapest, best-documented, most under-used by MCA brokers specifically |
| UCC filings | Cobalt Intelligence (11-state API) + Lien Solutions/CSC (enterprise, nationwide) | $0.50-2/lookup (Cobalt) + enterprise quote | Cobalt for pilot/verification workflow; enterprise only once volume justifies it |
| Trucking authority/fleet | FMCSA SAFER | Free | **Use first** — clean federal data |
| Liquor licenses | NY (data.ny.gov), TX (TABC open feed), CA ABC (flat file, no API) | Free | Pilot in NY/TX first — cleanest APIs |
| Building permits | Municipal Socrata portals (NYC, Chicago, LA, Seattle, etc.) free; Shovels.ai (~$599/mo) or BuildZoom for national scale | Free (city-by-city) to $599+/mo | Start with free city portals in your pilot metro; don't pay for national coverage until proven |
| Business entity formation | Census BFS (free, aggregate only) + OpenCorporates (paid tiers from £2,250/yr for commercial use) | Free (aggregate) / £2,250+/yr | BFS for market sizing only, not entity-level targeting |
| Franchise data | FRANdata (FDD database + Multi-Metric API) | Enterprise, not published | Get a quote if franchise vertical is pursued |
| Contact enrichment | Apollo.io (free/$49/user/mo), People Data Labs ($100/mo+), Cobalt Intelligence (business verification) | $0-$100+/mo | Apollo.io for lean start |
| SBA loan/disaster data | data.sba.gov FOIA datasets | Free | Use for peer-lending and disaster-recovery signals |

**Explicitly NOT RECOMMENDED sources:** scraping LoopNet/Crexi/Yelp beyond official API limits (ToS violation risk); scraping Indeed/LinkedIn job postings (no license permits this — use Revelio Labs instead); credit-bureau "trigger lead" data for business lending (regulatory direction is toward restriction, and MCA's own trade press treats this as commercially unproven); any third-party "scraper" tool for a source that already has a free official API (SAM.gov, Socrata, FMCSA).

---

## 16. Contact-Enrichment Options

(See §15 table and §22 cost table.) **Recommendation for a lean start:** Apollo.io free/Basic tier for phone/email discovery once a business is identified, Cobalt Intelligence for verifying the business is a real, active registered entity (directly useful for a lightweight underwriting-style pre-qualification pass before a caller ever dials).

---

## 17. Capital Need Score — Design

Explainable, 0-100, additive, every component sourced and dated. Example:

```
BUSINESS: Joe's Restaurant
CAPITAL NEED SCORE: 91/100  [illustrative — weights below are a starting hypothesis, not calibrated]

+20  Second location detected — commercial lease signed, filed with NYC DOB (source: NYC Socrata permit portal, detected 2026-08-01, HIGH confidence)
+15  Construction/build-out permit filed at new address (source: NYC DOB permit portal, filed 2026-07-29 — 9 days ago, HIGH confidence)
+15  Liquor license application filed (source: NY State Liquor Authority open data, filed 2026-07-25, HIGH confidence)
+14  11 job openings posted for the new address (source: [enrichment vendor], detected 2026-08-03, MEDIUM confidence — job-posting signals are independently rated a weak standalone signal per this research; only counted because combined with 3 other signals)
+10  Existing business history — Location A operating 4+ years, no bankruptcy/judgment on file (source: SOS entity record + [lien/judgment API], MEDIUM confidence)
+17  Additional evidence: Google review growth at Location A (+40% MoM) — LOW confidence, unverified predictive value, included transparently rather than silently

CAPITAL USE HYPOTHESIS (labeled as hypothesis, not fact): build-out, kitchen equipment, pre-opening payroll, initial inventory
RECOMMENDED OUTREACH ANGLE: "I noticed you appear to be expanding — are you already fully funded for the new location, or still evaluating working-capital options?"
```

**Design rules (non-negotiable):**
- Every point value traces to a named source and a detected-date.
- Confidence is labeled per component (HIGH/MEDIUM/LOW), not just for the total score.
- Weak/unverified signals (job postings alone, review growth) are included when present but weighted low and explicitly flagged as low-confidence, never silently treated as equal to UCC/permit-grade evidence.
- Nothing is fabricated. If a component can't be verified, it's omitted or marked "uncertain," never guessed.
- The "stacking" pattern (3+ UCC filings/90 days + judgment/lien) generates a **negative** modifier and routes to a different queue (see §7.3, combination #7) rather than being scored as a positive capital-need signal.

---

## 18. Caller Workflow

Dashboard card per the format you specified — Business / Industry / Location / Score / Priority / Contact / Why Flagged / Source Evidence / Signal Date / Likely Capital Need / Suggested Opening / Last Contact / Call Outcome / Next Action. Two hard rules for the caller experience, both derived directly from the adversarial research:

1. **The suggested opening must be a question, never an assertion of certainty** ("I noticed you appear to be expanding — are you fully funded?" not "I know you need money for your new location"). This is both an ethical requirement and a practical one: permits/UCC filings are noisy, lagging, or ambiguous signals (§7.2-7.3), and overclaiming certainty is exactly the kind of "we know something about you" framing that made mortgage trigger leads infuriating enough to get banned.
2. **Every call to a signal-sourced contact must be logged with the signal that triggered it**, feeding the learning loop (§20/§30) — no exceptions, even for calls the caller places on their own initiative.

---

## 19-20. CRM Architecture & Automation Architecture

**Pipeline (as you specified):** Data Sources → Trigger Detection → Business Matching → Deduplication → Contact Enrichment → Capital Need Score → AI Research Summary → CRM → Caller → Call Outcome → Application → Funded → Learning Loop.

**What Claude Code can build directly, at near-zero marginal cost, without a paid platform:**
- Pulling and normalizing data from free-API sources (USASpending, SAM.gov, FMCSA SAFER, Socrata city permit portals, state open-data liquor/business-license feeds) — straightforward scripted ingestion.
- Business-entity matching/deduplication logic (name/address normalization, fuzzy matching) — this is exactly the kind of scripting task Claude Code is well-suited to without a paid dedup service.
- The Capital Need Score computation itself (rules-based, explainable scoring engine) — pure logic, no paid dependency.
- AI research-summary generation per flagged business (drafting the "why flagged" narrative from the structured signal data) — a direct Claude use case.
- A lightweight internal dashboard/CRM view (if starting on a free CRM tier like HubSpot/Zoho, Claude Code can build the integration/sync layer; if starting fully custom, Claude Code can build a simple web dashboard against a Supabase free-tier Postgres database).
- The learning-loop analytics (correlating trigger combinations to funded-deal outcomes) once outcome data exists — this is a data-analysis task Claude Code can do directly.

**What genuinely requires a paid external service (unavoidable):**
- Contact enrichment beyond free tiers (Apollo.io, Cobalt Intelligence) once volume exceeds free-tier limits.
- Predictive/power dialer for real outbound call volume (no free tier exists that includes actual dialing infrastructure).
- Phone/email deliverability verification at scale (Telnyx/NumVerify, ZeroBounce) — free tiers cover only very low volume.
- Paid data-source tiers once free/city-level sources are exhausted (Shovels.ai/BuildZoom for national permit coverage, FRANdata for franchise data, enterprise UCC coverage).
- SMS/TCPA compliance tooling if texting is pursued (litigator scrub, consent-certificate services) — deferred until call/text volume is large enough to justify it (§22).

---

## 21. Claude Code Automation Opportunities (explicit list)

1. Scripted ingestion + normalization from every free-API source in §15.
2. Entity/address deduplication and fuzzy matching across sources.
3. Capital Need Score computation engine with full source/confidence traceability.
4. Per-lead AI research-summary drafting for the caller dashboard.
5. Signal-combination backtesting against outcome data once it exists (the core of the learning loop, §30).
6. A/B experiment tracking and statistical significance checks for the 30-day test (§24-26).
7. Compliance guardrails as code: a rules engine that flags any contact record missing a legitimate outreach channel (e.g., cell number + no consent record + autodial flag = blocked, per §23) before a caller ever sees it.
8. Lightweight dashboard/CRM UI if a fully custom build is preferred over HubSpot/Zoho free tiers.

None of this requires a development team — it requires sequencing the above build tasks after this research phase is approved.

---

## 22. Actual External Costs (August 2026 pricing, from direct research)

| Category | Cheapest viable option | Cost to start |
|---|---|---|
| Phone lookup | Telnyx Number Lookup (or NumVerify free 100/mo) | $0-$0.007/lookup |
| Email verification | ZeroBounce (free 100/mo, credits never expire) | $0 to start |
| Contact enrichment | Apollo.io free/Basic | $0-$49/user/mo |
| Predictive dialer | Close.com Growth (bundled CRM) | $99/seat/mo — cheapest tier with an actual power dialer |
| CRM | HubSpot free or Zoho CRM free (3 users) | $0/mo |
| SMS/TCPA compliance baseline | FTC National DNC Registry (first 5 area codes free) | $0/yr at small scale |
| Database/infra | Supabase free tier → Pro | $0 → $25/mo |
| **Bootstrapped monthly floor** | One operator, one area code, low volume | **≈$99-150/month**, plus small metered phone/email verification costs |

**Could not verify current pricing for (flag before budgeting):** Data Axle self-serve pricing, CallFire, Contact Center Compliance/Litigator Scrub, Blacklist Alliance, LendSaaS, MCA Suite/Fundivo, Kixie's real all-in cost (published tiers vs. reported actual invoices diverge), ReadyMode's current tier (vendor-listed vs. third-party-reported prices conflict), TrustedForm/Jornaya per-certificate pricing.

MCA-specific CRMs (LendSaaS, MCA Suite, Cloudsquare $75/user/mo + required Salesforce license, Centrex ~$25/user/mo unconfirmed) are worth evaluating **only once deal volume justifies it** — none publish self-serve pricing, itself a signal they're not built for a bootstrapped entry point.

---

## 23. Compliance Considerations (consolidated)

1. **TCPA is the single largest legal-tail-risk item in this entire plan.** The B2B exemption covers live-agent calls to a published business landline — it does **not** cover cell phones (even the owner's personal cell used for business), autodialers/AI-dialers, or texts, regardless of B2B framing. [VERIFIED FACT] TCPA class actions were up 44-112% YoY in early 2025 depending on the measure, ~80% of suits are class actions, statutory damages are $500-1,500/violation with no proof of harm required, average settlement ~$6.6M. At least 5 states have "mini-TCPA" laws layering additional state exposure. **Any outreach plan involving autodialing or SMS to numbers sourced from public records needs a documented consent theory before it scales, not after.**
2. **10 states now require commercial-financing disclosure** (CA, CT, FL, GA, KS, MO, NY, TX, UT, VA), several with broker-specific compensation-disclosure duties and (VA/UT/CT/TX/MO) broker/provider **registration** requirements. This constrains referral-partner structuring (§13) and sales scripting alike.
3. **FTC has an active, multi-year MCA enforcement pattern**: $17M settlement (Mar 2025) over deceptive funding-amount/speed claims, a Nov 2024 suit over deceptive ads, a permanent ban + $20.3M judgment against an individual MCA operator (Jonathan Braun) for deceiving merchants and improperly seizing assets. Any marketing claim about speed, amount, or approval odds sits directly in this enforcement zone — copy must be conservative and defensible.
4. **CPA/attorney referral fees carry professional-conduct exposure** independent of state financing law: AICPA independence rules bar CPAs from accepting referral fees from attest clients; ABA Model Rules constrain attorney fee-sharing/referral payments. Structure these as non-cash reciprocal relationships where cash comp is legally fraught.
5. **Reddit/social scraping**: hiQ v. LinkedIn establishes that scraping public pages doesn't by itself violate the federal CFAA, but that case still ended in a $500,000 judgment and a permanent injunction against hiQ under state-law/ToS-breach theories — platforms can and do still win on breach-of-contract/trespass grounds even post-hiQ. Not a safe harbor for bulk Reddit/LinkedIn/Facebook scraping.
6. **The mortgage trigger-lead ban (effective March 5, 2026) is the most important compliance signal in this entire research pass** — it demonstrates that the exact "notice a public trigger → contact them fast" mechanism this plan considered for MCA was recently outlawed in its closest real-world analog after sustained consumer complaints (74% reported unwanted contact, up to 100+ contacts within 24 hours in some cases). Build outreach cadence and volume with this precedent explicitly in mind, not just current-law minimums.

---

## 24-27. The 30-Day Experiment, KPIs, Funnel Math, Break-Even

### 24.1 Experimental groups (revised from your draft, informed by the evidence above)

| Group | Description | Why this design |
|---|---|---|
| **A — Trigger-based (narrow)** | UCC-stacking signal used for a refinance/consolidation angle ONLY, in 1 pilot metro (see Day 1 plan) + the strongest signal *combination* (#1 or #2 from §7.3), not isolated weak signals (permits alone, hiring alone) | Tests the one signal with real corroborating evidence, and the combination hypothesis, without betting on unverified single signals |
| **B — Public funding intent** | Manual, small-batch (not automated) monitoring of 3-4 relevant subreddits/forums by one person, capped at a fixed weekly time budget | Sized to match the realistic 15-150/month national volume estimate — treat as a probe to confirm or kill, not a channel to scale prematurely |
| **C — Funding Readiness Tool (inbound)** | Build and launch the tool (§11); drive traffic via a small SEO/content push + a capped search-ad budget on Tier-1 keywords (§12), pending the Google policy confirmation | This is the highest-evidence-supported channel (real market gap, real precedent that quiz/tool funnels outperform static pages directionally) — should carry the most weight for hitting 30 hot leads |
| **D — Control** | One paid batch of leads from a reputable, named vendor offering the closest-to-genuinely-exclusive product found in this research (live transfer or a vetted "fresh" batch), purchased at normal market price | Without this, you cannot tell whether Groups A-C are actually better than what you'd get just buying leads the conventional way — this is the baseline every other group must beat |
| **E — Referral pilot** | 3-5 hand-picked partners from the underexploited categories in §13 (general contractors, one SBA packager, one ERC/tax-resolution firm), simple written agreements barring rate/term discussion | Small enough to manage compliance carefully; tests the channel with the best long-run unit economics without over-committing before it's proven at your specific deal profile |

### 24.2 Sample size

Given industry-reported baseline conversion rates (2-4% lead-to-close overall; ~2% cold-call-to-genuine-interest; 12-20% for bank-statement-verified/high-quality leads) [VENDOR/INDUSTRY CLAIM, triangulated], and needing enough volume per group to distinguish a real difference from noise at these low base rates:

**Recommended: 300-400 businesses per group × 5 groups = 1,500-2,000 total**, at the upper end of your suggested 500-2,000 range. Below ~300/group, a single unusually good or bad week will swing the result more than the underlying channel quality does — you won't be able to tell signal from noise. Group C (inbound) will naturally self-limit to whatever traffic the tool actually attracts; don't force it to an arbitrary count by buying traffic you wouldn't otherwise buy.

### 24.3 KPIs (tracked identically across all groups, same salespeople)

Contact rate → decision-maker conversation rate → interested-merchant rate → **hot-lead rate** → application rate → documented-application rate → approval rate → funded-deal rate → funded volume ($) → revenue → profit → **revenue per 1,000 prospects** → **cost per hot lead** → **cost per application** → **cost per funded deal**.

### 24.4 Expected funnel math [our inference, using the base rates above — treat as a planning assumption to test, not a promise]

If "hot lead" requires genuine, verified interest (not just a completed contact), and cold/trigger-sourced outreach converts contact→interest around the ~2% industry-reported cold-outreach rate rather than the 30%+ rate seen only for leads that opted in themselves: hitting 30 hot leads from outbound-heavy groups (A, E) alone could require on the order of **1,000-1,500 outbound touches**. Group C (inbound, self-selected) should convert far better per contact but is volume-capped by traffic, not by conversion rate. **This is exactly why Group D (control) and Group C (inbound) are the two most likely sources of your 30 hot leads in month one** — don't over-index the 30-day success metric on the trigger/public-intent arms, which are explicitly there to generate learning data for scaling decisions, not to carry the near-term number.

### 24.5 Break-even economics

Using the $58k average deal / ~10% commission (~$5,800 gross) and $500-$3,000 reported CAC-per-funded-deal range: at the high end of CAC ($3,000), gross margin per deal is ~$2,800 before overhead/compliance/tooling (§22, ≈$100-150/month fixed) — meaning the whole experiment's infrastructure cost is recovered by a fraction of a single funded deal. The real economic question the 30-day test needs to answer is not "can we afford the tools" (we clearly can, per §22) but **"which group's cost-per-funded-deal beats the $3,000 CAC benchmark, and by how much"** — that comparison is the entire point of running a control group.

---

## 28. Failure Conditions (pre-committed, so you know when to stop a group early)

- **Group A (trigger):** if cost-per-hot-lead exceeds Group D's (control) after 2 weeks with no improving trend, kill it — the evidence base for isolated signals is too weak to justify continued spend past that point.
- **Group B (public intent):** if fewer than 5 usable, contactable posts are found in the first 2 weeks at the capped time budget, kill it — this would confirm the volume estimate in §10 and the channel is not worth automating.
- **Group C (tool):** if visitor-to-score completion is healthy but score-to-contact-request conversion is near zero, the value-delivery-before-ask design (§11) isn't working as theorized — revisit the UX, don't abandon the concept.
- **Group E (referral):** if any partner starts presenting specific offer terms to their clients (crossing the line in §13), pause that partner immediately regardless of lead volume — this is a compliance failure condition, not a performance one.
- **Overall:** if total funded deals across all groups after 30 days is materially below what Group D (buying leads normally) would have produced at the same spend, that is evidence the "proprietary intelligence" thesis does not currently beat simply buying leads well — say so plainly rather than rationalizing another 30 days.

---

## 29. 90-Day Scaling Plan (conditional on 30-day results)

- **Days 1-30:** run the experiment above exactly as designed; no scaling decisions until it's read.
- **Days 31-45:** kill/scale decisions per §28; double down on whichever of Groups A/C/E showed real signal, drop what didn't; if Group A's narrow UCC-refinance angle worked, expand geographic coverage of UCC data (11-state Cobalt API → evaluate the enterprise nationwide option) before expanding to new signal types.
- **Days 46-75:** if the Funding Readiness Tool (Group C) is working, invest in the long-tail calculator content identified in §14 to compound its organic traffic; if the referral pilot (Group E) is working, formalize written partner agreements and expand within the same underexploited categories before trying new ones.
- **Days 76-90:** reassess the Capital Need Score weights against actual funded-deal outcomes collected so far (§30) — this is the first point at which you'll have enough real outcome data to move signal weights from "our starting hypothesis" to "evidence-calibrated."
- Do not attempt to build the full multi-source trigger-detection pipeline (§7.1's 60 signals) before this point — the 30/90-day data should tell you which 3-5 signals are worth the ongoing data-source cost, not intuition.

---

## 30. Long-Term Moat

The honest answer from this research: **none of the individual data sources are a moat** — UCC filings, permits, licenses, and federal contract data are either public record or available from multiple commercial vendors to any competitor with a budget (§6 of the adversarial research; academic literature on B2B first-mover advantage finds 80%+ of first movers lose their initial edge). The moat, if one exists, is **the proprietary outcome dataset**: which specific signal combinations, in which verticals, actually correlated with funded deals and profit — the "TRIGGER A + TRIGGER C = 5.2x normal funding rate" pattern you described. That dataset only exists after running real outreach and recording real outcomes (§19's learning loop); it cannot be bought, and a competitor starting today has to run their own version of this exact 30/90-day experiment to build their own copy of it. **The moat is the experiment discipline itself, sustained over time — not any single signal.**

---

## 31. Go/No-Go Recommendation

**GO — narrowed as described in §1.** Specifically:
- **GO** on the Funding Readiness Tool (Grade B, real product gap, low compliance risk, cheap to build with Claude Code).
- **GO, narrowly**, on UCC-stacking data used for a refinance/consolidation angle (Grade A evidence for the signal itself, but only for this specific use, not general prospecting).
- **GO, cautiously**, on referral partnerships in underexploited categories (Grade B, real compliance ceiling requiring reviewed contracts).
- **GO, small**, on the search-ad channel pending direct confirmation of Google's policy scope for B2B MCA (Grade B, contingent).
- **TEST SMALL, DON'T BUILD AROUND**, the broader trigger-signal thesis (permits, licenses, hiring surges, review growth) — Grade C, unverified, and the closest real-world analog to the whole approach was just federally banned.
- **NO-GO** on automated public-intent (Reddit) scraping/monitoring at any scale beyond a single manual side-experiment — Grade D, tiny realistic volume, weak identifiability, and a real API-cost/approval barrier.
- **NO-GO** on any of the traditional purchased-lead categories except as a one-time control-group benchmark (Grade D across UCC/aged/shared/affiliate/purchased-list/cold-email categories) and except live transfers/exclusive batches specifically as the control (Grade C).

If the 30-day experiment shows Group D (control, ordinary purchased leads) outperforms every proprietary channel on cost-per-funded-deal, the honest conclusion is that the "intelligence engine" thesis is not yet proven and the right move is to keep buying leads conventionally while continuing to build the proprietary data asset (§30) at low intensity until it earns its keep — not to declare failure or to double down blindly.

---

## Day 1 — Exact Plan

- **Vertical:** Independent restaurants/bars, 2+ years in operation, showing evidence of considering or actively pursuing a second location. Chosen because this vertical has the richest *free* public-signal availability (liquor licenses, health permits, building permits all publicly tracked) and matches the strongest evidenced signal combination (§7.3, combination #1).
- **Geography:** New York State to start (New York City specifically for permit data). Chosen because NY State Liquor Authority publishes a free, daily-updated Socrata API [VERIFIED FACT], NYC has a free, well-documented Socrata permit API, and NY is one of the largest MCA markets in the country.
- **Signals for Day 1:** (a) new liquor-license application filed in the last 30 days at a *different* address than an existing operator's registered business address (the "2nd location" trigger); (b) cross-reference against UCC filings via Cobalt Intelligence's API if NY is in its 11-state coverage (confirm at signup) to check for existing stacking — businesses with 3+ recent UCC filings get routed to the exclude/different-queue list per §7.3 combination #7, not the standard outreach list.
- **Where to get the first data:** NY State Liquor Authority open data (data.ny.gov) — free, no signup required for basic access; NYC DOB permit data via NYC Open Data (Socrata) — free.
- **Accounts/APIs needed for Day 1:** none paid yet. Free Socrata API access for both NY SLA and NYC Open Data. Optionally sign up for Cobalt Intelligence's free trial (20 free lookups) to test UCC cross-referencing before committing spend.
- **Expected cost:** $0 for data. Budget for the first small batch: the Group D control-purchase (one modest live-transfer or vetted-exclusive batch, priced at whatever that vendor quotes — get 2-3 quotes first) plus the $99-150/month infrastructure floor from §22 once you're ready to actually call (Close.com or free CRM + free-tier verification).
- **How many businesses to collect:** Start with the full universe of NY liquor-license applications + qualifying restaurant permits from the trailing 60 days (likely a few hundred records in NYC alone) — this becomes the seed list for Group A; no need to cap it artificially low, since the data is free.
- **How to enrich them:** Cobalt Intelligence for entity/UCC verification; Apollo.io free tier for owner contact info once a business is confirmed as a real, matching entity (not just a name collision).
- **How to score them:** Apply the Capital Need Score design in §17 — a fresh restaurant liquor-license application at a new address, cross-referenced against the operator's existing Location A history (age, no bankruptcy/judgment), scores in the "worth calling" range; a brand-new entity with no track record and the same permit scores lower per the anti-pattern flagged in §7.3.
- **How callers should approach them:** Use the question-framed opening from §18 ("I noticed you appear to be expanding — are you already fully funded, or still evaluating options?"), never an assertion of certainty; log the specific signal and its date on every call record, per the caller workflow rule in §18.
- **Exactly what to measure:** every KPI in §24.3, starting from day one of calling, so Group A has a real, timestamped baseline to compare against Group D once the control-batch purchase is made in parallel.

---

*This document reflects research completed August 7, 2026. No code has been written and no infrastructure has been provisioned. The next step, pending your approval, is to scope and build the pieces needed to execute the Day 1 plan and launch the 30-day experiment — not the full platform described in the original brief.*
