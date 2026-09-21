import { useField, type FieldContext } from 'vee-validate'
import type { MaybeRefOrGetter } from 'vue'

/**
 * _FieldContext['handleChange']_ is used for both _@input_ and _@change_ event listeners
 * */

type HandleChange = FieldContext['handleChange']
type EventListener = (event: Event) => void

type ValidationListeners =
  | { blur: EventListener; input: HandleChange; change?: never }
  | { blur: EventListener; input?: never; change: HandleChange }

type ValidatedFieldContext<TValue> = Omit<FieldContext<TValue>, 'handleChange' | 'handleBlur'> & {
  validationListeners: ValidationListeners
}

/**
 * https://vee-validate.logaretm.com/v4/guide/composition-api/custom-inputs/#handling-events
 *
 * - __handleChange__: updates the field _value_. It triggers the validation by default.
 *
 * - __handleBlur__: does not mutate the _value_ of the field. It only sets the _meta.touched_ to _true_.
 * It does not validate the current value by default, you have to pass _true_ as a second argument to trigger the validation
 */

/**
 * We have two user experiences for validation.
 *
 * - __BLUR__ validates when the user leaves the input, regardless of whether its value has changed or not.
 *
 * - __KEYPRESS__ validates while the user types and on `blur`.
 * */

export function useValidatedField<TValue>(
  name: MaybeRefOrGetter<string>,
  validateOnKeypress: boolean,
  validateOnBlur: boolean
): ValidatedFieldContext<TValue> {
  const { handleChange, handleBlur, ...rest } = useField<TValue>(name)
  const validationListeners = { blur: (event: Event) => handleBlur(event, validateOnBlur) } as ValidationListeners
  if (validateOnKeypress) validationListeners.input = handleChange
  else validationListeners.change = handleChange

  return { validationListeners, ...rest }
}
