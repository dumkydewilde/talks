# Infrastructure for Answers - Working Outline

Working thesis: a generic dbt project already contains much of the infrastructure an agent needs to answer questions. The job is to expose that context through tools, measure behavior with evals, and promote repeated fixes back into dbt and the database.

## Act 1 - From Copy-Paste SQL To The Loop

1. **Title + QR**  
   Infrastructure for Answers. From copy-paste SQL to context-rich data agents that answer faster, cheaper, and more correctly.

2. **Where We Are**  
   Your dbt project is becoming an answer engine. The interface is shifting from dashboards to agents.

3. **Ordinary Question**  
   Start with a normal analytics prompt: “What’s the average order value?” The agent writes plausible SQL against `raw_orders`.

4. **The Catch**  
   `raw_orders.order_total` is stored in cents. The correct €169.90 comes from dividing the plausible-looking 16,990.42 raw result by 100.

5. **Actual Answer**  
   The correct answer is €169.90, not €16,990.42. This is not a SQL syntax problem; it is a missing-context problem.

6. **Why?**  
   The loop did what it was asked to do. The missing piece was the data meaning the loop had access to.

7. **Three Levels Of Agentic SQL**  
   Copy-paste SQL, agentic clients, and owning the loop. Use duckling / working duck / Duckzilla imagery as the metaphor.

8. **Animated Agentic Loop**  
   Show prompt -> LLM -> MCP -> dbt/database -> correction -> answer. The model is only one node in the system.

9. **Owning The Loop Is Cheap**  
   A tool-calling loop is basically a while loop. Owning it lets you swap models, log traces, and control failure behavior.

## Act 2 - Context Determines Performance

10. **Context Was The Problem**  
   Once the loop exists, answer quality depends on what the agent can see, trust, and learn from.

11. **Context Stack**  
   Useful context comes from schema, dbt, memory, and traces. These layers compound when connected.

12. **Context That Ships With Data**  
   `COMMENT ON`, dbt docs, and tested models keep meaning close to the data object instead of in a drifting prompt file.

13. **Benchmark Reality**  
   DABstep shows real analytics questions are hard: joins, filters, units, docs, and recovery are the actual problem shape.

14. **Context Beats Model Choice**  
   Schema and context improvements can beat bigger models: explicit names and full-context modeling produce large hard-question gains.

15. **Prose Context Drifts**  
   Separate manuals can contradict evolving schemas. Promote stable knowledge into comments, views, macros, and dbt docs.

16. **Eval Loop**  
   The agentic loop creates behavior; the eval loop tells you if behavior improved across accuracy, speed, and cost.

## Act 3 - Turn dbt Into Answer Infrastructure

17. **Package The Context**  
   Stop making every agent rediscover the warehouse. Package context once and expose it through tools.

18. **mcp-memory-layer Pattern**  
   Extract dbt manifest slices, serve corrections, and observe popular joins/failures as a lightweight memory layer.

19. **dbt Already Has It**  
   dbt already contains semantic material: descriptions, tests, lineage, semantic models, saved queries, owners, and metrics.

20. **Generic dbt Project**  
   Use the familiar dbt project as the input: SQL models, YAML descriptions, tests, lineage, and metrics.

21. **What dbt Already Has**  
   dbt is not just transformation code; it is context engineering you have already been doing.

22. **Context Layer**  
   Fragments move from rumor to lore to canon. Frequently reused context should become reviewed dbt objects.

23. **Workflow Is The Product**  
   Compile, wrap, evaluate, promote, operate. The workflow around dbt turns models into answer infrastructure.

24. **New Job**  
   The analytics engineering role shifts from dashboard builder to steward of the answer substrate.

25. **Three Things Monday**  
   Score 25 questions, expose dbt context through MCP, and promote repeated fixes into dbt/database artifacts.

26. **Resources**  
   Point to `mcp-memory-layer`, the agentic loop workshop, MotherDuck Labs harnesses, key readings, and the design/Scenario asset sources.

27. **Closing QR**  
   Leave people with the slides and repo so they can follow the workflow after the talk.
