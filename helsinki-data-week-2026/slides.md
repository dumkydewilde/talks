---
theme: none
title: The future of data teams
titleTemplate: '%s · Helsinki Data Week · MotherDuck'
author: Dumky de Wilde
info: |
  A 15-minute MotherDuck talk for The Data Team's New Tools at Helsinki Data Week,
  followed by Adrian Brudaru's dlt segment and panel discussion.
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1280
layout: default
class: cover-slide
transition: fade
fonts:
  provider: none
  sans: Aeonik Fono
  mono: Aeonik Mono
favicon: /favicon.svg
monaco: false
record: false
wakeLock: false
selectable: true
presenter: true
drawings:
  enabled: true
  persist: false
defaults:
  layout: default
---

<div class="cover-grid">
  <div>
    <div class="eyebrow">THE WORKBENCH OF THE FUTURE</div>
    <h1>The future<br />of data teams.</h1>
    <p class="cover-subtitle">New tools<br /><span class="underlined">New workflows</span></p>
    <div class="speaker-line"><strong>Dumky de Wilde</strong><span>Developer &amp; Agent Experience Engineer · MotherDuck</span></div>
    <div class="follow-along"><img src="/follow-along.svg" alt="QR code linking to the presentation" /><div><strong>Follow along</strong><span>Scan to open the slides</span><a href="https://dumkydewilde.github.io/talks/helsinki-data-week-2026/" target="_blank" rel="noopener noreferrer">Open the presentation ↗</a></div></div>
  </div>
  <div class="cover-art">
    <div class="orbit-label label-one">MORE QUESTIONS =/= BETTER QUESTIONS ↗</div>
    <img src="/brand/instance_size_yellow_duck_standard.png" alt="MotherDuck’s yellow duck mascot" />
    <div class="orbit-label label-two">HELSINKI, LET’S FLOCK.</div>
    <div class="cover-stamp"><span>15 MIN</span><span>+ A BIG CONVERSATION</span></div>
  </div>
</div>

<!--
00:00–00:45 / 45 seconds
Hello Helsinki. I'm Dumky, Developer & Agent Experience Engineer at MotherDuck.
This is the MotherDuck half of our workbench session. Adrian will show the dlt side next, and then we will challenge the implications together on the panel.
My argument isn't “AI replaces the data team.” It is that a much shorter path from question to evidence changes what a data team should optimize for.
No need for a full company history or feature list. Get to the room's experience.
-->

---
title: Agents have their own way of communicating
class: compact-slide
---

<div class="eyebrow">A STRANGE THING I FOUND IN MY OWN LOGS 🪵</div>

# Agents have their own way of communicating.

<AgentSpacing />

<!--
03:30–04:30 / 60 seconds
This is the real analysis from my Valise OpenCode sessions on 24–25 October: 599 messages across 19 sessions. The chart bundles only anonymized numerical measurements; the next slide contains three deliberately selected, non-identifying text excerpts. No full transcripts, session titles, or original IDs are bundled.
Blue is agent-to-agent writing; the dashed garden line is replies to me. Show the overview, then click “Follow one writer.” The overview stays visible; writers must not be pooled into a single line because they change on different clocks.
The summary is pooled first-six-hour vs last-three-hour medians: about 13.9 down to 4.0 spaces per 100 non-space characters. Reports and replies have a combined median around 16.8. Code, URLs, paths, and IDs were stripped; chart messages have more than 15 words. Lines are ±45-minute medians with gaps over 90 minutes broken.
Describe the observation, not an unproven mechanism: this doesn't prove that models invented a language, intended to save tokens, or became more efficient. It also doesn't measure correctness.
The lesson: agent workflows need inspectable traces, explicit tool contracts, and outcomes we can evaluate—not an assumption that they'll behave like a human using a GUI.
The original Dive link needs my MotherDuck access. Do not share dumky_dev just to make the presentation work.
-->

---
title: Same instructions. Fewer spaces.
class: compact-slide communication-slide
---

# Same instructions. Fewer spaces.

<div class="communication-examples">
  <div class="communication-example">
    <blockquote>Libraryrunner19pass3fail,8crossrouteLOGINscreenshotsREJECTED; nofullgate/readinessclaim. Yourrepairmustpreserveproofs andseparatemeasuredspeedvsjustifiedtimeoutbudget; no model/UIfunctionalchanges.</blockquote>
  </div>
  <div class="communication-example">
    <blockquote>FinishyourONEproviderfreebatchwithinexisting5mincap,preserveerrors/durableproof/cleanupandEXPLICIT4391releasepromptly, noextrabatch/fullgate/build/push. ParentwillgrantHaikufocused4241immediatelyafteryourrelease; no pressuretofakegreen. Deterministic/scriptedproofboundarykept,0paidcalls.</blockquote>
  </div>
  <div class="communication-example">
    <blockquote>No prompttuning/validatorphrasepatch/reprobe/anothermodel/bakeoffjusttogreen, no seededsubstitution. PreserveSANITIZEDrawsyntheticevidence/reviewlimitationsandpriorharnessfailuresinCOMMITTEDdocs/testsartifactsasappropriate(no secrets), writeactualnegativefindinganddownstreamUNREACHEDsteps.</blockquote>
  </div>
</div>

<!--
04:30–04:50 / 20 seconds, shared with the preceding chart's original 90-second slot.
These are exact contiguous excerpts from three agent-to-agent messages in the same local spacing/out/conversation.json used for the chart, not invented illustrations. Source message timestamps (epoch milliseconds): 1792877701669, 1792879692116, 1792880607632. They are from separate messages and should not be described as one writer's controlled progression.
Only these selected excerpts are included; no surrounding transcript, private IDs, paths, or session titles. Spelling, capitalization, punctuation, and spaces are unchanged.
Let the original messages speak for themselves: rejected screenshot evidence, a bounded test handoff, and a warning not to tune away a real failure.
This does not establish why the spacing changes, token savings, a new language, or whether an instruction was followed correctly.
-->

---
title: How do we make our tools work for us?
class: statement-slide
---

# Our tools are now faster then we are. How do we make them work _for_ us.

<!--
04:50–05:00 / 10 seconds, completing the agent section's original 90-second slot.
Pause on the question before moving to the room's workflow bottlenecks.
-->

---
title: Where is the bottleneck
---

<div class="eyebrow">QUICK SHOW OF HANDS</div>

# Where is the bottleneck?

<p class="lede">Think about the last analytical question someone asked you/your team</p>

<AudiencePrompt />

<!--
00:45–01:30 / 45 seconds
Ask for a show of hands: getting data, getting an answer, or trusting the answer?
Click the room's strongest response. This is a conversation starter, not an audience polling system.
There is no “correct” answer. Note which stage they choose and return to it during the panel.
Transition: whatever the bottleneck is, it determines how often we get to learn.
-->

---
title: Speed up the time to insight.
---

<div class="eyebrow">TIME TO INSIGHT → TIME TO LEARNING</div>

# Speed up the time to insight.

<p class="lede">More questions == more bets == more results</p>

<IterationLoop />

<!--
01:30–02:45 / 75 seconds
Use the six phases from Google's Design Sprint Kit: understand, define, sketch, decide, prototype, validate. Here they are arranged as a repeatable learning loop, not a claim about a fixed sprint duration.
Read the visual left to right: the tangle is an unclear problem; the spreading paths are competing explanations; the converged path is a chosen bet; the final curve is a prototype being tested and refined. The diamonds show expansion and narrowing, not quantitative data. The dotted return carries evidence into the next question.
For a data team: understand a business problem, define the question, sketch possible explanations, decide what to test, prototype the analysis, and validate it against evidence.
The next question should be better informed than the first. Shorten the path around the loop, rather than skipping the validation step. No numeric performance claim.
Review, organizational attention, and acting on the result are real constraints. Faster generation is worthless if checking becomes the new queue.
Transition: shortening the loop takes both more capable models and a different role for the people guiding them.
-->

---
title: How to speed up time to insight
class: insight-how-slide
---

<div class="eyebrow">HOW TO SPEED UP TIME TO INSIGHT</div>

# Models are speeding up. Let people guide.

<div class="insight-how-grid">
  <section class="insight-how-card">
    <span class="card-index">01 / MODELS</span>
    <h3>Take on more complex tasks,<br /> at faster speeds.</h3>
    <p>"Great catch, you're absolutely right!"</p>
    <div class="insight-how-principle">Build reliability through tests, evidence,<br /> and repeatable results, not blind trust.</div>
  </section>
  <section class="insight-how-card">
    <span class="card-index">02 / PEOPLE</span>
    <h3>Keep the context.<br />Not the queue.</h3>
    <p>Bring domain knowledge<br /> and guiding principles.</p>
    <div class="insight-how-principle">Set safe boundaries. Step aside within them.<br />Review exceptions.</div>
  </section>
</div>

<div class="bottom-line">Be a gatekeeper. Not a bottleneck.</div>

<!--
02:45–03:30 / 45 seconds
This is the “how” behind the previous slide's faster learning loop. Two changes have to happen together.
First, models can take on increasingly complex tasks at faster speeds. Higher trust has to be earned for the actual task through tests, source evidence, and repeatable outcomes—not assumed because a model is newer or faster. No universal accuracy or speed claim.
Second, humans still bring domain knowledge, business definitions, and guiding principles. The challenge is to learn where we can safely step aside, rather than personally approving every generated step.
Set the boundaries up front: what the agent may access or change, what success looks like, what is reversible, and which risks or exceptions must come back to a person. Let routine work proceed within those boundaries; sample and audit outcomes, and keep human approval for consequential decisions. Someone still owns the result.
Be a gatekeeper without becoming a bottleneck. Moving the entire queue from execution into review would not shorten time to insight.
Transition: this is why the workbench needs tools for both people and agents.
-->

---
title: A workbench for people and agents
---

<div class="eyebrow">WHAT MOTHERDUCK BRINGS TO THE WORKBENCH</div>

# Tools for people. Tools for agents.

<div class="workbench-grid">
  <div class="workbench-card"><span class="card-index">01 / THE DATA</span><h3>DuckDB +<br />MotherDuck</h3><p>SQL across local and cloud data. A shared place to ask and check.</p></div>
  <div class="workbench-card"><span class="card-index">02 / THE INTERFACE</span><h3>MCP +<br />context</h3><p>Agents discover schemas, run queries, and share pitfalls per column/table across the organisation.</p></div>
  <div class="workbench-card"><span class="card-index">03 / THE WORK</span><h3>Flights +<br />AI SQL</h3><p>Run Python jobs. Ingest, transform, and enrich text into queryable data.</p></div>
  <div class="workbench-card"><span class="card-index">04 / THE INSIGHT</span><h3>Dives</h3><p>Build and share interactive React + SQL views that query your MotherDuck data.</p></div>
</div>

<div class="bottom-line">The solution is not "everyone gets a chat". It's: how do we safely decentralize analytics, while feeding insights back to the larger organisation.</div>

<!--
05:00–06:00 / 60 seconds
Four building blocks, not a product catalogue.
DuckDB is the engine; MotherDuck provides the managed cloud warehouse and local/cloud workflows.
MCP is the tool interface for agents. Context still matters: data definitions, comments, and permissions.
A Flight is Python that MotherDuck runs, with access to your databases. Use it for ingestion, transformation, enrichment, and repeatable jobs. SQL compute does the heavy lifting.
A Dive is an interactive React component backed by live SQL, saved in the workspace. Sharing a Dive does not bypass permissions on the underlying data.
dlt fits inside the ingestion step; leave the actual dlt demonstration for Adrian.
-->

---
title: What can 1,250 interviews tell us?
class: demo-intro-slide
---

<div class="demo-intro">
  <div><div class="eyebrow">LET’S MAKE THIS CONCRETE</div><div class="huge-number">1,250<span>interviews</span></div><p class="dataset-credit">Anthropic Interviewer dataset<br />Workforce · Creatives · Scientists</p></div>
  <div><h1>Keeping humans<br /><span class="accent-word">in the loop</span></h1><p class="lede">Building personalized tools in peace and harmony ✌️</p><div class="demo-path"><span>Flight</span>→<span>AI SQL</span>→<span>Dive</span></div></div>
</div>

<!--
06:00–06:45 / 45 seconds
Use the interview-insights demo in the neighboring interview-insights project. The source is Anthropic/AnthropicInterviewer on Hugging Face: 1,000 workforce interviews, 125 creatives, 125 scientists.
The question fits this room: how are people changing their work with AI?
Don't claim these interviews are a representative survey of all workers. Cohorts have different sizes and sampling contexts; theme counts are not population prevalence. Multiple answers come from one participant.
The interesting part is moving from a large text corpus to an explicit, revisable coding process—not claiming to have objectively measured the future of work.
-->

---
title: From transcripts to a reusable research workflow
class: recording-slide
---

<InterviewRecording />

<!--
06:45–09:15 / 2 minutes 30 seconds
Main demo slot, now a local screen recording rather than a live Dive or screenshot walkthrough. Source: Screen Recording 2026-10-28 at 09.46.26.mov, supplied by Dumky. The full 31.55-second recording is repackaged as MP4 without re-encoding, trimming, or changing its audio or timing. The poster is its first frame.
The recording autoplays muted from the start each time this slide is entered; unmute with the native controls if needed. Use the controls to pause, seek, replay, adjust volume, or enter video fullscreen. Playback pauses when leaving the slide and stays paused while preloaded on neighboring slides. If the browser blocks autoplay, click Play. No network access to MotherDuck, login, Flight execution, or model calls are needed.
Use the remaining demo time to explain the research workflow: a Flight loads the interviews, prompt() drafts a codebook, prompt_jev() classifies answers, and the Dive lets a person inspect evidence and revise definitions. Describe only actions and results actually visible in the recording; do not imply that a staged edit is a completed writeback.
Close on sampling, definitions, source evidence, evaluation, safe execution, and a usable interface. No invented timing, accuracy, or cost claims.
-->

---
title: The workflow behind the insights
---

<div class="eyebrow">BEHIND THE INTERVIEW DIVE</div>

# The workflow behind the insights.

<InterviewFlow />

<!--
09:15–10:00 / 45 seconds, shared with the recording's original demo slot.
Read the five stages from left to right: Dive app → Flight loading data → human review and editing → Flight running SQL analysis with Jev → Dive with insights.
The Dive is the interface for starting and inspecting the work. The first Flight loads the interviews. A person reviews and edits the codebook: the domain knowledge and guiding principles from the earlier slide become explicit definitions here. The next Flight runs SQL analysis with prompt_jev(), using those definitions. The Dive presents the resulting insights for exploration.
This is a conceptual explanation of the workflow, not a claim that every step completed in the recording. The diagram does not execute a Flight, query, model call, or writeback. Retain source evidence and evaluate classifications; human review is not proof of model accuracy.
-->

---
title: Nine Dives, nine possibilities
class: compact-slide gallery-slide
---

<DiveGallery />

<!--
10:00–11:00 / 60 seconds
Nine favourite Dives from the public gallery, visible together without a large slide title. Follow the user's chosen order: DuckDB PyPI downloads, pivoting, database explorer, home-fit map, financial briefing book, Nikola Jokić career arc, NBA game-quality heatmap, Common Crawl, Jev jobs.
Point out capability, not nine separate demos: line and bar charts on queryable data; a practical pivot workflow; a genuinely useful database tool; custom map design; finance; visual storytelling; heatmaps and cross-filtering; open data at scale; AI SQL in the application.
All images are local copies of the public gallery screenshots. Each enlarged example links back to its public gallery page.
Click one if useful, Esc to close. Don't demo all nine. The point is that an answer can become an interactive interface shaped around the question.
Not every prototype should become a permanent dashboard. Keep the ones that prove useful, assign ownership, and retire the rest.
-->

---
title: The data team does not disappear
---

<div class="eyebrow">IF MORE PEOPLE CAN BUILD, WHAT DO WE OWN?</div>

# The questions change.<br />The responsibility doesn’t.

<div class="responsibility-table">
  <div class="responsibility-header"><span>LESS OF THE BOTTLENECK</span><span>MORE OF THE FOUNDATION</span></div>
  <div><span>“Can you pull this data for me?”</span><strong>Safe access &amp; reliable inputs</strong></div>
  <div><span>“Can you write this query?”</span><strong>Shared definitions &amp; business context</strong></div>
  <div><span>“Can you build this dashboard?”</span><strong>Reusable tools &amp; feedback loops</strong></div>
  <div><span>“The model said it, so it’s true.”</span><strong>Evidence, evaluation &amp; a named owner</strong></div>
</div>

<!--
11:00–12:30 / 90 seconds
These tasks don't vanish overnight. The mix changes, unevenly across BI, AE, DE, and company sizes.
Tie back to the interview workflow: access to transcripts, a versioned codebook, checking classifications, and retaining quotes all required explicit choices.
Democratizing the ability to ask questions is not the same as giving everyone unrestricted access to production data or write-capable agents.
A good foundation includes curated datasets, understandable definitions, a sandbox, query/access controls, traces, and an escalation path when evidence is weak.
The team increasingly makes other people effective, rather than being the only people allowed to answer a question. This is a hypothesis for the panel, not a claim that every organization must reorganize tomorrow.
-->

---
title: Make more bets, keep someone accountable
class: takeaway-slide
---

<div class="eyebrow">THE FUTURE OF DATA TEAMS</div>

<h1>Make more bets.<br /><span class="accent-word">Know who's<br />accountable.</span></h1>

<div class="takeaway-bottom"><div class="takeaway-steps"><div><b>01</b><span>Build <strong>tools</strong> that fit your workflow</span></div><div><b>02</b><span>Create a <strong>shared and trusted</strong> context.</span></div><div><b>03</b><span><strong>Measure</strong> what changes. And by whom</span></div></div><div class="follow-along follow-along-compact"><img src="/follow-along.svg" alt="QR code linking to the presentation" /><div><strong>Follow along</strong><span>Scan for the slides</span><a href="https://dumkydewilde.github.io/talks/helsinki-data-week-2026/" target="_blank" rel="noopener noreferrer">Open ↗</a></div></div></div>

<!--
12:30–14:30 / 2 minutes
Return to the audience's opening bottleneck. What would it take to shorten that particular loop safely?
Leave three concrete actions: pick a workflow; make the data, tools, and definitions available; measure the result and assign responsibility.
Measure time to a checked answer—not just token generation or query speed. Also look at correction rate, cost, freshness, and whether anyone actually acted on the result.
Who can authorize a new data source? Who reviews generated code? Who approves an agent taking action? Who responds when an answer is wrong? Those are workflow and organizational design questions.
The future of data teams is not one giant autonomous agent. It is better-informed people, shorter feedback loops, and responsibility that doesn't get lost between a prompt and a tool call.
If ahead of time, invite the room to think of one workflow to redesign. If behind, give the three actions and move on.
-->

---
title: Over to Adrian
class: handover-slide
---

<div class="handover-grid"><div><div class="eyebrow">NEXT / THE OTHER HALF OF THE WORKBENCH</div><h1>Good questions<br />need good data.</h1><p class="lede">Over to Adrian for the dlt side<br />of the workflow.</p><div class="handover-name"><strong>Adrian Brudaru</strong><span>Co-founder · dltHub</span></div></div><div class="handover-arrow">↗</div></div>

<!--
14:30–15:00 / 30 seconds. End of the 15-minute MotherDuck talk.
We have seen what happens when text becomes queryable and the answer becomes explorable. Adrian will show the dlt side of making data available.
Don't promise a specific Adrian demo or pipeline that hasn't been agreed with him.
Stop here during his segment. The following four slides are panel material, outside this talk's 15-minute budget.
-->

---
title: The panel — data teams after AI
class: panel-title-slide
---

<div class="eyebrow">PANEL DISCUSSION / THE DATA TEAM’S NEW TOOLS</div>

<h1>The tools changed.<br /><span class="accent-word">What needs to<br />change with them?</span></h1>

<div class="panel-people"><div><strong>Adrian Brudaru</strong><span>Co-founder<br />dltHub</span></div><div><strong>Amy Raygada</strong><span>Head of Data &amp; AI Central Europe<br />Thoughtworks</span></div><div><strong>Stijn Zanders</strong><span>Data &amp; IT<br />Aiven</span></div></div>

<!--
Panel only. Begin after Adrian's talk.
Event agenda: 16:00–17:00 panel, then networking. Introduce the panelists using the event listing; confirm current titles with them before the event.
Suggested hour: 5 min introductions, 25 min across the four themes, 10 min accountability question, 15 min audience questions, 5 min closing round.
Opening round, 60 seconds each: name one workflow that has genuinely changed for your team, not one you hope will change.
The next slide is a non-linear menu. Follow the room's energy instead of forcing a checklist.
-->

---
title: Four questions for the panel
class: compact-slide
---

<div class="eyebrow">ROLES → ADOPTION → VALUE → ACCESS</div>

# What are we adapting for?

<PanelTopics />

<!--
Panel discussion menu, roughly 25 minutes. Click a theme to show its main question and follow-up.
1. Flatter boundaries: BI can ingest, AE can do DE. Do all of us need to become AI engineers? Distinguish AI literacy, tool use, and building/operating AI systems.
2. Uneven change: BI/AE/DE, small company/large enterprise, regulated/unregulated. Ask for actual workflows and constraints rather than abstract adoption claims.
3. A team of one: if everyone can answer questions, what does the data team contribute? Force the operational detail: what changes next Monday?
4. Access for everyone: distinguish data access, agent access, and authority to act. Ask what tools the data team should supply and what should remain restricted.
Use one directed first answer, then invite a contrasting perspective. Don't ask every panelist every question.
-->

---
title: An agent can act, but cannot be accountable
class: accountability-slide
---

<div class="eyebrow">THE QUESTION UNDERNEATH ALL THE OTHERS</div>

<blockquote class="amy-quote">“agent can act,<br />but can not<br />be accountable”</blockquote>

<div class="quote-credit">AMY RAYGADA <span>/ A THOUGHT TO DISCUSS</span></div>

<div class="accountability-question">So who owns the decision—and what does that change about the workflow?</div>

<!--
Panel only, roughly 10 minutes.
Quote as provided in Dumky's rough notes; not independently verified as a published quotation. Confirm wording and attribution with Amy before presenting.
Invite Amy to unpack the distinction. A system can take an action; that does not make it accountable for the consequences.
Concrete scenario: a data agent identifies a drop in revenue, changes a transformation, and posts a recommendation to leadership. Who can authorize each step? Which changes need review? What evidence is retained? Who owns recovery?
Follow up with Adrian and Stijn: what does this imply for permissions, approval boundaries, monitoring, and team roles? Where should an agent stop and ask a person?
-->

---
title: What will you change on Monday?
class: closing-slide
---

<div class="eyebrow">AUDIENCE QUESTIONS + ONE LAST ROUND</div>

<h1>What will you<br /><span class="accent-word">change on Monday?</span></h1>

<div class="closing-prompts"><span>A workflow to redesign.</span><span>A boundary to make explicit.</span><span>A question worth another bet.</span></div>

<div class="closing-links"><a href="https://motherduck.com/" target="_blank" rel="noopener noreferrer">motherduck.com ↗</a><a href="https://dlthub.com/" target="_blank" rel="noopener noreferrer">dlthub.com ↗</a><a href="https://luma.com/flock-in-Helsinki" target="_blank" rel="noopener noreferrer">The event ↗</a></div>

<!--
Panel only. Reserve roughly 15 minutes for audience questions, then a 5-minute closing round.
Ask each panelist for one concrete recommendation, not a prediction.
Final synthesis: make it easier for more people to learn from data, but don't confuse capability with permission or action with accountability.
Thank the panelists, hosts, and audience. Networking follows at the brewhouse.
-->

---
title: Links & resources
class: resources-slide
---

<div class="eyebrow">KEEP EXPLORING</div>

# Links &amp; resources.

<div class="resources-grid">
  <section class="resource-card"><span class="card-index">THE SPEAKERS</span><a href="https://www.linkedin.com/in/dumkydewilde/" target="_blank" rel="noopener noreferrer">Dumky de Wilde <span>LinkedIn ↗</span></a><a href="https://www.linkedin.com/in/data-team/" target="_blank" rel="noopener noreferrer">Adrian Brudaru <span>LinkedIn ↗</span></a><a href="https://www.linkedin.com/in/amy-raygada/" target="_blank" rel="noopener noreferrer">Amy Raygada <span>LinkedIn ↗</span></a><a href="https://www.linkedin.com/in/stijnzanders/" target="_blank" rel="noopener noreferrer">Stijn Zanders <span>LinkedIn ↗</span></a></section>
  <section class="resource-card resource-featured"><span class="card-index">THE INTERVIEW WORKFLOW</span><a href="https://motherduck.com/docs/cookbook/interview-transcript-insights/" target="_blank" rel="noopener noreferrer"><strong>Interview transcript insights</strong><span>Cookbook recipe ↗</span></a><a href="https://motherduck.com/dive-gallery/dives/interview-insights" target="_blank" rel="noopener noreferrer"><strong>Interview insights</strong><span>Explore the Dive ↗</span></a></section>
</div>

<!--
Panel close / resources slide. Share the follow-along deck URL and point attendees to the recipe and Dive that inspired the interview-insights demo.
LinkedIn links are the public profiles for the four speakers listed in the event agenda.
-->
