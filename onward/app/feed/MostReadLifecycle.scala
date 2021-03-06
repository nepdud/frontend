package feed

import app.LifecycleComponent
import common.{JobScheduler, AkkaAsync}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.{Future, ExecutionContext}

class MostReadLifecycle(
  appLifecycle: ApplicationLifecycle,
  jobs: JobScheduler,
  akkaAsync: AkkaAsync,
  mostReadAgent: MostReadAgent
)(implicit ec: ExecutionContext) extends LifecycleComponent {

  appLifecycle.addStopHook { () => Future {
    jobs.deschedule("MostReadAgentRefreshJob")
  }}

  override def start(): Unit = {
    jobs.deschedule("MostReadAgentRefreshJob")

    // update every 30 min
    jobs.schedule("MostReadAgentRefreshJob",  "0 0/30 * * * ?") {
      mostReadAgent.update()
    }

    akkaAsync.after1s {
      mostReadAgent.update()
    }
  }
}
