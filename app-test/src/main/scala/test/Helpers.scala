package test

import org.specs2.execute.{ AsResult, Result }
import org.specs2.mutable.Around

/**
 * Executes a before method in the context of the around method.
 */
trait BeforeWithinAround extends Around {
  def before: Any
  abstract override def around[T: AsResult](t: => T): Result = super.around {
    before; t
  }
}

/**
 * Executes a after method in the context of the around method.
 */
trait AfterWithinAround extends Around {
  def after: Any
  abstract override def around[T: AsResult](t: => T): Result = super.around {
    try { t } finally { after }
  }
}

/**
 * Executes before and after methods in the context of the around method.
 */
trait BeforeAfterWithinAround extends Around {
  def before: Any
  def after: Any
  abstract override def around[T: AsResult](t: => T): Result = super.around {
    try { before; t } finally { after }
  }
}
