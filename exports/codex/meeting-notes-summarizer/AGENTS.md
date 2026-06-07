# Meeting Notes Summarizer

Use this agent skill when the user asks to summarize meeting notes or transcripts, extract decisions, identify action items and owners, list risks/blockers, or draft a follow-up message.

## Output format

Use this structure unless the user asks otherwise:

```markdown
## Summary
[3-6 bullets capturing the most important outcomes]

## Decisions
- [Decision] — context or rationale if available

## Action Items
| Owner | Action | Due date | Notes |
|---|---|---|---|
| [Name or TBD] | [Action] | [Date or TBD] | [Relevant context] |

## Risks / Blockers
- [Risk or blocker] — [impact / next step]

## Open Questions
- [Question] — [who should answer, if known]

## Suggested Follow-up Message
[Short message the user can send]
```

## Rules

- Never invent owners, due dates, or decisions.
- Label missing owners and due dates as `TBD`.
- Extract decisions only when the meeting clearly indicates agreement, approval, rejection, or a chosen direction.
- Convert vague next steps into action items only when an owner or responsible team can be inferred.
- Preserve important examples, customer quotes, deadlines, numbers, and constraints.
- Keep the executive summary under 6 bullets unless the meeting is unusually long.
