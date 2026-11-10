# My Spring App

## Interactive Agent Workflow Dashboard

The home page is a **client-side simulation**, not live agent execution or telemetry.
- Select Planner, Developer, Reviewer, Tester, or Orchestrator to open role details, responsibilities, and the current simulated status. Keyboard: Tab to a card, Enter/Space to open, Escape to close.
- **Start Agent Workflow** simulates PLAN → DEVELOP → REVIEW → TEST → COMPLETE (about two seconds per agent stage). Orchestrator coordinates during the run; cards, open details, progress, demo metrics, and activity stay synchronized.
- **Reset Workflow** cancels the current run and restores pending stages, idle coordination, and initial metrics/activity, including during a run or after completion. Reset before replaying; overlapping runs are prevented.
- All execution statuses, metrics, activity, and success results are illustrative. No agents, builds, tests, deployments, or external services are invoked by the dashboard.

Implemented with existing Thymeleaf/Bootstrap styling and local `static/js/dashboard.js`; no backend or Azure configuration changes.

Trying to get started with Java on Azure? See these resources:

- [Azure Samples](https://github.com/azure-samples?q=java&type=&language=&sort=)
- [Java on App Service Quickstart](https://docs.microsoft.com/en-us/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Java and CosmosDB Tutorial](https://docs.microsoft.com/en-us/azure/app-service/tutorial-java-spring-cosmosdb)
- [Maven plugins](https://docs.microsoft.com/it-it/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme?view=azure-java-stable#quick-start)
