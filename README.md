
# Advisor Tracker

## HOW TO RUN

There are several ways to run this application.

clone advisor_tracker
```bash
cd advisor_tracker
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to see the app in the browser.
server can be curled at [http://localhost:4000](http://localhost:4000)

### Alternatives

```docker-compose up --build``` [http://localhost:8080](http://localhost:8080)

A live deployed demo is available on my personal Digital Ocean droplet containing
fictional data at [https://advisor-tracker.justinhodgesoftware.com](https://advisor-tracker.justinhodgesoftware.com).
This may be removed after review.

## WHO I BUILD FOR

I assumed advisors are busy, not especially technical, and already know their students
personally, so the tool should be an “extra brain” that answers one question fast:
who should I contact first? I also assumed the tool sits behind advisor-only
authentication (out of scope here). I had no access to real advisors, so everything
below is an assumption they should confirm.

## WHAT IT DOES

List, search, and filter students, open a detail view, and log a new contact note,
backed by a small Node/TypeScript API with SQLite.

### SMART FEATURE: PRIORITY SCORE

Each student’s score sums four capped signals: risk flag (High 40 / Medium 20),
GPA below 2.5 (up to 30), days since last contact beyond a 30-day grace period
(up to 30; never-contacted counts as max), and concern keywords in past notes
(10 per hit, up to 30). The list page sorts by it. I chose transparent rules over
a model because there’s no outcome data to train on, and the rules are simple
enough to explain and adjust. Weights and the 30-day threshold are my assumptions.
The keyword scan is naive (it can’t handle negation like “no anxiety”), and
the score is a triage aid, not a judgment
about a student.

## WHAT I NOTICED IN THE DATA

I stayed within the timebox and fixed what I ran into rather than auditing the files.

- Inconsistent date formats. Dates arrived in several formats.
I normalize them to ISO on ingest assuming US standards; anything
unparseable becomes null and is scored as “never contacted,” so
uncertainty raises priority rather than hiding a student.
- Restricted data in free-text notes. Seed note N041 contains
what appears to be a Social Security number. Notes are
stored and shown as-is, with a code comment marking the
risk. I deliberately did not build text sanitization, since
scrubbing free text reliably is a losing game of edge cases.
With real data I’d rely on access control, keep note text
out of list responses, add a “no sensitive identifiers” reminder
at note entry, and have the data owner clean the source.

## WHAT I CUT

- Score breakdown in the UI. The score is a sort-and-highlight
aid. First thing I’d add in V2, since advisors will trust a
ranking more if they can see why.
- Single search box with a field selector instead of separate
search and filters. Faster to build and extends with the schema,
but less precise than dropdowns of known values and can’t combine
filters. With advisor input I’d add dedicated filters for the
few fields they actually use or fuzzy search.
- Edit/delete for notes, and validation of advisor names and
contact types. Not needed for the core flow; the cost is
inconsistent values over time.
- Automated tests. First I’d add tests
for the score logic and date normalization.
- Heavy design and external UI libraries. I kept
light, hand-written CSS so the tool doesn’t distract
advisors from evaluating the workflow.

## HOW I USED AI

AI scaffolded the project (Docker files, client/server boilerplate)
and wrote first drafts of code I’d specified. I made the design decisions,
then refactored its output to my style. Where I stepped in: it
suggested CommonJS modules in the tsconfig, which I corrected to NodeNext.
The scoring rules and weights were mine. I first wrote them as a
TypeScript function, then moved them into the SQL query for
performance, and AI translated my logic into the query. The date
parser is commodity logic with no business rules in it, so AI wrote
it and I reviewed it. On the other end of the process AI was used as a code
reviewer. When I feel a feature is complete I show the result to the AI and
look for feedback like potential edge cases I may have missed or
at the very least force myself to defend decisions made along the way.

## QUESTIONS FOR V2

1. How are risk flags defined and used?
2. Is each student assigned to one advisor, or do several see them?
3. How often should a student be contacted, and what counts as “too long”?
4. What’s the policy on what may be written in notes?
5. What fields are the most important and used filtering and searching features?

## CONNECTING THIS TO THE CRM

### CONNECTION

Because the API is completely decoupled from the frontend there is extreme flexibility
in the way we could proceed. We could go the route of middleware in which logging
a contact or new student with the CRM would pass through the api en route
assuring the real time sync of both systems at the cost of more overhead
and complexity. Alternatively if this dashboard does not need to be true
real time with the CRM we could simply set a low traffic period syncing method
either a job inside the CRM that calls this API or a job within this application
that pulls from the CRM depending on which direction would make the data flow
easiest and most reliable given what the CRM exposes.

### FAILURE MODES

1. The biggest danger here is schema changes within the CRM that this application
has no built in way to respect reliably.
2. Race conditions could occur if during a sync (whether real time or batch job)
there was simultaneous updates in the CRM and this application.
3. Notes could be duplicated or conflicting if both systems CRM and
advisor_tracker are used
4. The application currently assumes student_ids and note_ids are arbitrary. If the
provided IDs are internal CRM IDs this could cause duplicated notes to be created.
The CRM should be the primary source of truth if this case was discovered. 
