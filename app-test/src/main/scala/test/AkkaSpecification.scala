package test

import akka.actor.{ Actor, ActorRef, Props }
import akka.testkit.TestProbe
import play.api.inject.BindingKey

import scala.reflect.ClassTag

/**
 * A specification which contains some Akka specific configuration.
 */
trait AkkaSpecification extends BaseSpecification {

  /**
   * A context.
   */
  trait AkkaContext extends BaseContext {

    /**
     * The actor system.
     */
    implicit lazy val actorSystem = application.actorSystem

    /**
     * The test probe.
     */
    lazy val theProbe = TestProbe()

    /**
     * Helper to get an [[ActorRef]] from the name to which the actor was bound in the DI system
     *
     * @param name The name to which the actor was bound in the DI system.
     * @return The actor ref for the actor.
     */
    def actorRef(name: String): ActorRef = injector.instanceOf(BindingKey(classOf[ActorRef]).qualifiedWith(name))

    /**
     * Helper to get an [[ActorRef]] for the given actor class.
     *
     * @tparam T The type of the actor.
     * @return The actor ref for the actor.
     */
    def actorRef[T <: Actor: ClassTag]: ActorRef = actorSystem.actorOf(Props[T])

    /**
     * Helper to get an [[ActorRef]] for the given actor class.
     *
     * @tparam T The type of the actor.
     * @return The actor ref for the actor.
     */
    def actorRef[T <: Actor: ClassTag](args: Any*): ActorRef =
      actorSystem.actorOf(Props(implicitly[ClassTag[T]].runtimeClass, args: _*))
  }
}
