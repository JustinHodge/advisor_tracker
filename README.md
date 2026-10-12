How to Run It: Keep it dead simple. Step 1: npm install (or podman-compose up --build). Step 2: Open http://localhost:5173. Mention that runtime .db files are git-ignored.

    Who It’s For & Assumptions: Built for a busy academic advisor who needs a lightning-fast triage tool, not an administrative heavy system. Assumption: Advisors care most about who hasn't been spoken to recently or who has risk flags, so speed and visibility trump deep analytics.

    What You Cut: Auth (skipped for local scope), fancy UI component libraries (used Pico CSS/lightweight styling for zero bloat), and complex automated email sync.

    How You Used AI: Be direct—you used AI as a structural sounding board for setting up atomic SQLite inserts with better-sqlite3, managing containerized workflows with podman-compose, and rapidly scaffolding the frontend architecture while maintaining strict control over the code logic.

2. Prepping for the Presentation's Big Questions

The presentation asks two classic enterprise architecture questions that they will love talking through with you:
Question A: "What would you ask the advisors before building a second version?"

    Good answers to highlight:

        "Do you prefer a push workflow (automated email nudges) or a pull workflow (this dashboard)?"

        "How do you define a 'risk flag' in practice—is it purely GPA-based, or tied to missed class attendance?"

        "Do you need multi-advisor sharing, or is this strictly a single-advisor portfolio view?"

Question B: "How would you connect this to an enterprise CRM (like Salesforce), and what could go wrong?"

    The Architecture: You wouldn't point a production Salesforce instance directly at a local SQLite file. Instead, you'd treat your Node API as a lightweight middle tier (or middleware) that syncs data using Salesforce's REST API or Bulk API via secure OAuth 2.0 credentials.

    What could go wrong (Failure Modes):

        Rate Limiting & Throttling: Salesforce API limits can choke real-time UI polling if not cached carefully.

        Data Sync Conflicts / Race Conditions: If an advisor logs a note locally while another system updates the student record in Salesforce, you face conflicting state.

        Schema Drift: Enterprise CRM fields change constantly based on institutional policy, breaking rigid local relational schemas.
