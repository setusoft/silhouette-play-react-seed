import java.net.InetSocketAddress

import com.typesafe.sbt.packager.Keys._
import play.sbt.PlayImport.PlayKeys._
import play.sbt.{ Play, PlayRunHook }
import sbt.Keys._
import sbt._

/**
 * NPM plugin.
 */
object NpmPlugin extends AutoPlugin {

  /**
   * An exception that indicates that the `npm` command was not found.
   */
  case object NpmMissingException extends RuntimeException("`npm` was not found on your PATH")

  /**
   * An exception that indicates that the base directory doesn't exists.
   *
   * @param base The base directory.
   */
  case class NpmMissingDirectory(base: File) extends RuntimeException(
    s"The base directory `${base.getAbsolutePath}` doesn't exists"
  )

  /**
   * The auto imports.
   */
  object autoImport {
    val Npm = config("npm")
    lazy val npmDirectory = SettingKey[File]("The directory were the npm app is located") in Npm
    lazy val npmExec = SettingKey[String]("The npm command") in Npm
    lazy val npmClean = SettingKey[String]("The npm clean command") in Npm
    lazy val npmCompile = SettingKey[String]("The npm command to compile the application") in Npm
    lazy val npmStart = SettingKey[String]("The npm command to start the server on localhost:3000") in Npm
    lazy val npmDist = SettingKey[String]("The npm command to create the dist files") in Npm
    lazy val npmTest = SettingKey[String]("The npm command to run the tests") in Npm
    lazy val npmDir = SettingKey[String]("The directory where the NPM project is located") in Npm
    lazy val npmLogLevel = settingKey[NpmLogLevel]("Log level for npm commands") in Npm

    /**
     * Valid log levels for npm command from docs at: https://docs.npmjs.com/misc/config#loglevel
     *
     * @param level The log level as string.
     */
    sealed abstract class NpmLogLevel(level: String) {
      override def toString: String = level
    }
    object NpmLogLevel {
      case object Silent extends NpmLogLevel("silent")
      case object Error extends NpmLogLevel("error")
      case object Warn extends NpmLogLevel("warn")
      case object Http extends NpmLogLevel("http")
      case object Info extends NpmLogLevel("info")
      case object Verbose extends NpmLogLevel("verbose")
      case object Silly extends NpmLogLevel("silly")
    }
  }
  import autoImport._

  /**
   * Defines OS properties.
   */
  object OS {
    object Name extends Enumeration {
      type Name = Value
      val Windows, Linux, Mac = Value
    }

    /**
     * The current OS name.
     */
    lazy val name = sys.props.get("os.name").flatMap(n =>
      OS.Name.values.find(v => n.contains(v.toString))
    ).getOrElse(sys.error("Unknown OS name!"))
  }

  /**
   * The NPM tasks.
   */
  lazy val npmCleanTask = npmCmdTask(npmClean)
  lazy val npmCompileTask = npmCmdTask(npmCompile)
  lazy val npmStartTask = npmCmdTask(npmStart)
  lazy val npmDistTask = npmCmdTask(npmDist)
  lazy val npmTestTask = npmCmdTask(npmTest)

  /**
   * Define project settings.
   */
  override lazy val projectSettings: Seq[Setting[_]] = Seq(
    npmDirectory := baseDirectory.value / npmDir.value,
    npmExec := (OS.name match {
      case OS.Name.Windows => "npm"
      case OS.Name.Linux   => "npm"
      case OS.Name.Mac     => "npm"
    }),
    npmClean := "clean",
    npmCompile := "compile",
    npmStart := "start",
    npmDist := "deploy:prod",
    npmTest := "test",
    npmLogLevel := NpmLogLevel.Verbose,

    // The dist and stage are linked with the Play tasks
    dist := dist.dependsOn(npmDistTask).value,
    stage := stage.dependsOn(npmDistTask).value,

    // All other tasks can be executed independently from Play
    compile in Npm := inc.Analysis.Empty,
    compile in Npm := (compile in Npm).dependsOn(npmCompileTask).value,
    clean in Npm := (clean in Npm).dependsOn(npmCleanTask).value,
    test in Npm := (),
    test in Npm := (test in Npm).dependsOn(npmTestTask).value,

    playRunHooks += runHook(
      npmExec.value,
      npmDirectory.value,
      npmStart.value,
      Keys.streams.value.log,
      npmLogLevel.value
    ),
    // Allow all the NPM command to be run within sbt
    commands ++= npmExec { (exec) => Seq(npm(exec)) }.value
  )

  /** This plugin requires the sbt Play plugin to be enabled */
  override def requires: Plugins = Play

  /**
   * Creates a NPM command task.
   *
   * @param cmd The command value.
   * @return A task.
   */
  private def npmCmdTask(cmd: SettingKey[String]) = Def.task {
    run(npmExec.value, npmDirectory.value, List("run", cmd.value), Keys.streams.value.log, npmLogLevel.value)
  }

  /**
   * Allows user to execute arbitrary npm command from the SBT console with working directory set
   * to `npmDirectory`.
   *
   * @param exec The NPM executable.
   * @return A command.
   */
  private def npm(exec: String) = Command.args(exec, "<" + exec + "-command>") { (state, args) =>
    val extracted = Project.extract(state)
    try {
      val base = extracted.get(npmDirectory)
      val logger = extracted.get(sLog)
      val logLevel = extracted.get(npmLogLevel)
      run(exec, base, args.toList, logger, logLevel)
      state
    } catch {
      case NpmMissingException => state.fail
      case _: Throwable        => state
    }
  }

  /**
   * Run npm.
   *
   * @param exec The NPM executable.
   * @param base The NPM working dir.
   * @param args The list of NPM arguments.
   * @param logger The logger instance.
   * @param npmLogLevel The npm log level.
   * @return A process.
   */
  private def run(exec: String, base: File, args: List[String], logger: Logger, npmLogLevel: NpmLogLevel): Int = {
    val process = fork(exec, base, args, logger, npmLogLevel)
    process.exitValue() match {
      case code if code == 0 => code
      case code              => throw new Exception(s"Cannot run `${process.toString}` command; got code: $code")
    }
  }

  /**
   * Fork npm.
   *
   * @param exec The NPM executable.
   * @param base The NPM working dir.
   * @param args The list of NPM arguments.
   * @param logger The logger instance.
   * @param npmLogLevel The npm log level.
   * @return A process.
   */
  private def fork(exec: String, base: File, args: List[String], logger: Logger, npmLogLevel: NpmLogLevel): Process = {
    val whichCode = which("npm").!
    if (whichCode != 0) {
      logger.info("`which npm` had a nonzero exit code: " + whichCode)
      logger.info("'npm' is required. Please install it and add it to your PATH.")
      throw NpmMissingException
    }

    if (!base.exists()) {
      logger.info(s"Skipping NPM server start. Npm application directory ${base.getAbsolutePath} not found.")
      throw NpmMissingDirectory(base)
    }
    val process = proc(exec, base, s"--loglevel $npmLogLevel" :: args)
    // NPM logs some output to stderr, so we log stdout and sdterr as info, to avoid error logs for NPM output
    val processLogger = new ProcessLogger {
      override def error(s: => String) = logger.info(s)
      override def info(s: => String) = logger.info(s)
      override def buffer[T](f: => T) = f
    }

    logger.info(s"Will run: ${process.toString} in ${base.getPath}")
    process.run(processLogger, connectInput = true)
  }

  /**
   * Gets the process builder which defines the command to run NPM.
   *
   * @param exec The NPM executable.
   * @param base The NPM working dir.
   * @param args The list of NPM arguments.
   * @return A process builder.
   */
  private def proc(exec: String, base: File, args: List[String]): ProcessBuilder = {
    OS.name match {
      case OS.Name.Windows => Process("cmd" :: "/c" :: exec :: args, base)
      case _               => Process(exec :: args, base)
    }
  }

  /**
   * Check if a program exists in PATH.
   *
   * @param program The program to check for.
   */
  private def which(program: String) = OS.name match {
    case OS.Name.Windows => Process(s"where $program")
    case _               => Process(s"which $program")
  }

  /**
   * Creates a Play run hook.
   *
   * @param exec The NPM executable.
   * @param base The NPM working dir.
   * @param cmd The NPM command to execute.
   * @param logger The logger instance.
   * @param logLevel The npm log level.
   * @return A Play run hook.
   */
  private def runHook(exec: String, base: File, cmd: String, logger: Logger, logLevel: NpmLogLevel): PlayRunHook = {
    object WebpackHook extends PlayRunHook {
      var process: Option[Process] = None

      override def afterStarted(addr: InetSocketAddress): Unit = {
        logger.info(s"Starting NPM server in development mode")
        process = Some(fork(exec, base, "run" :: cmd :: Nil, logger, logLevel))
      }

      override def afterStopped() = {
        logger.info("Attempting to stop NPM server")
        process.foreach(_.destroy())
        process = None
      }
    }

    WebpackHook
  }
}
