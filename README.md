
# ADVISOR TRACKER - [https://github.com/justinhodge/advisor_tracker](https://github.com/justinhodge/advisor_tracker)

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

`docker-compose up --build` [http://localhost:8080](http://localhost:8080)

A live deployed demo is available on my personal Digital Ocean droplet containing
fictional data at [https://advisor-tracker.justinhodgesoftware.com](https://advisor-tracker.justinhodgesoftware.com).
This may be removed after review.

## WHO I BUILD FOR

I assumed advisors are busy, not especially technical, and already know their students
personally, so the tool should be an “extra brain” that answers one question fast:
who should I contact first? I also assumed the tool sits behind advisor-only
authentication (out of scope here).

## WHAT IT DOES

List, search, and filter students, open a detail view, and log a new contact note,
backed by a small Node/TypeScript API with SQLite.

### SMART FEATURE: PRIORITY SCORE

Each student’s score sums four capped signals: risk flag,
GPA, days since last contact, and concern keywords in past notes.
The list page sorts by it. Weights and the 30-day threshold are my assumptions.
The keyword scan is naive (it can’t handle negation like “no anxiety”), therefore
the score is a triage aid, not a judgment about a student.

## WHAT I NOTICED IN THE DATA

- Dates arrived in several Inconsistent formats. I normalized
  them to ISO on ingest assuming US standards; anything
  unparseable becomes null and is scored as “never contacted,”.
- Seed note N041 contains what appears to be a Social Security number.
  It is likely that there are other sensitive bits of data that I did
  not discover. Notes are stored and shown as-is, with a code comment marking the
  risk. I deliberately did not build text sanitization, since
  scrubbing free text reliably is a losing game of edge cases.
  With real data I’d rely on access control, keep note text
  out of list responses, add a “no sensitive identifiers” reminder
  at note entry, and have the data owner clean the source.

## WHAT I CUT

- Priority Score breakdown in the UI. The score is currently a
  sort-and-highlight aid only. The scoring breakdown could be a
  good V2 addition as advisors will likely trust a ranking
  more if they can see why a student ranks high.
- Single search box with a field selector instead of separate
  search and filters. Faster to build and extends with the schema,
  but less precise than dropdowns of known values and can’t combine
  filters. With advisor input I’d add dedicated filters for the
  few fields they actually use and/or fuzzy search.
- Edit/delete for notes, and validation of advisor names and
  contact types. Not needed for the core flow; although the
  lack of validation adds a risk of data errors over time.
- Automated tests. This is purely in consideration of time and scale
  for v1.
- Heavy design and external UI libraries. While styling is
  low priority for v1 the average end user can often be distracted
  from utility if there is too much design friction so I chose
  to include light design.

## HOW I USED AI

I used GeminiAI for quick scaffolding of project level boilerplate and then
inside my editor I use Windsurf for function level boilerplate. Furthermore
I use GeminiAI as a code reviewer and "smart rubber duck" when problems arise
much like a combined stackoverflow and junior peer. One example of that
"combined" approach is in the date parser found in `utils`. That is, roughly
speaking, a solved problem so this uses AI generated snippet with minor edits.
My final use of AI is as a prose editor. For instance this readme was written
stream of thought style then handed to Gemini to edit, then I would edit anything
that did not translate my thoughts well or remove injected fluff.

### WHERE I STEPPED IN

AI scaffolded the project (Docker files, client/server boilerplate) however
with that came many assumptions about design choices or outright errors. As an example,
early on the boilerplate the AI generated tsconfig for the server was set on commonjs
which I caught and replaced with nodenext as an example. Another example is after
I came up with the priority score feature and a rough outline of how to weight
the AI suggested calculating those on the fly in the frontend. I thought this would
be unwise as it would slow down rendering for a value that would change very infrequently
and required a search through all student notes even on the simple student table.
Instead I moved that to the backend as a part of the return from `/api/students`.
At this point I realized that the extra db call for notes could be a bottleneck
and the db engine itself could do this aggregation. This is where the AI was
brought back in to translate my nodjs logic into a cohesive sql query.

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
2. Race conditions could occur if, during a sync (whether real time or batch job),
  there were simultaneous updates in the CRM and this application.
3. Notes could be duplicated or conflicting if both systems CRM and
  advisor_tracker are used
4. The application currently assumes student_ids and note_ids are arbitrary. If
  the provided IDs are internal CRM IDs this could cause duplicated notes to be
  created. The CRM should be the primary source of truth if this case was discovered.
