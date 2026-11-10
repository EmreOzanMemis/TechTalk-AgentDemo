# My Spring App

## Interactive Agent Workflow Dashboard

The home page includes five keyboard-accessible agent cards with role details.
Choose **Start Agent Workflow** to simulate PLAN → DEVELOP → REVIEW → TEST → COMPLETE
(about eight seconds). The Orchestrator stays active during every handoff.
**Reset Demo** cancels the run immediately and restores the initial state; completed runs can be replayed.
All statuses, metrics, and activity are browser-only simulated demo data—not live
GitHub telemetry or real agent, build, or test execution. JavaScript is required;
there are no additional dependencies or backend changes.

Use **Demo Scenario** to choose Successful Delivery, Code Review Failed, or
Automated Test Failed. Failure scenarios pause with a simulated blocked/failed
status and a **Fix & Retry** action. Retry repeats the failed validation stage,
then continues to completion without changing source code or running real tests.
Reset or switching scenarios cancels the current run and clears its history.

Trying to get started with Java on Azure? See these resources:

- [Azure Samples](https://github.com/azure-samples?q=java&type=&language=&sort=)
- [Java on App Service Quickstart](https://docs.microsoft.com/en-us/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Java and CosmosDB Tutorial](https://docs.microsoft.com/en-us/azure/app-service/tutorial-java-spring-cosmosdb)
- [Maven plugins](https://docs.microsoft.com/it-it/java/api/overview/azure/maven/azure-webapp-maven-plugin/readme?view=azure-java-stable#quick-start)
