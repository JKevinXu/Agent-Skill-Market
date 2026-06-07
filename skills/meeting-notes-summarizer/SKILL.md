---
name: meeting-notes-summarizer
description: Use when turning raw meeting notes or transcripts into concise summaries, decisions, action items, owners, dates, risks, and follow-up questions.
version: 1.0.0
author: JKevinXu
license: MIT
metadata:
  hermes:
    tags: [meetings, productivity, summarization, action-items]
    related_skills: []
---

# Meeting Notes Summarizer

## Overview

Use this skill to transform messy meeting transcripts, live notes, or pasted chat logs into a structured meeting brief. The output should be concise, decision-oriented, and easy to forward to stakeholders.

This is a content-only sample skill for Agent Skill Market. It does not require shell commands, network access, credentials, MCP servers, or file writes.

## When to Use

Use this skill when the user asks to:

- summarize meeting notes or a transcript
- extract action items and owners
- identify decisions made in a meeting
- list risks, blockers, and unresolved questions
- produce a follow-up email or Slack/WeChat message from meeting notes
- turn rambling notes into a concise executive brief

Do not use this skill for:

- legal minutes requiring exact verbatim recordkeeping
- medical, legal, or financial advice beyond summarizing what was said
- executing follow-up actions without explicit user confirmation

## Output Format

When summarizing, use this structure unless the user asks otherwise:

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

## Procedure

1. Identify meeting topic, participants, and date if present.
2. Separate facts from assumptions. Label missing owners or due dates as `TBD`.
3. Extract decisions only when the transcript clearly indicates agreement, approval, rejection, or a chosen direction.
4. Convert vague next steps into action items only when an owner or responsible team can be inferred. Otherwise put them under Open Questions.
5. Keep the summary short and remove repeated discussion.
6. Preserve important examples, customer quotes, deadlines, numbers, and constraints.
7. If the user asks for a message, write it in the requested channel style and tone.

## Quality Bar

- The action item table should be directly usable.
- Never invent owners, due dates, or decisions.
- Flag ambiguity instead of pretending it is resolved.
- Prefer concrete verbs: `Draft`, `Review`, `Send`, `Schedule`, `Decide`, `Validate`.
- Keep the executive summary under 6 bullets unless the meeting is unusually long.

## Example Prompt

"Use Meeting Notes Summarizer on this transcript and list owners for each action item."
