import { ValidateFieldsError } from 'async-validator'
import { castArray, isFunction } from 'lodash-es'
import { Component, createEffect, createMemo, mergeProps, on } from 'solid-js'
import { useGlobalConfig, useNamespace } from '@element-solid/hooks'
import { Arrayable, classNames, debugWarn } from '@element-solid/utils'

import {
  FormContextInstance,
  FormInstance,
  FormItemContextInstance,
  FormItemProp,
  FormProps,
  FormValidateCallback,
} from './type'
import { FormContext } from './hooks/use-form-context'

const defaultProps: Partial<FormProps> = {
  labelPosition: 'right',
  requireAsteriskPosition: 'left',
  validateOnRuleChange: true,
  hideRequiredAsterisk: true,
}
const Form: Component<FormProps> = (_props) => {
  const props = mergeProps(defaultProps, _props)

  const ns = useNamespace('form')
  const config = useGlobalConfig()
  const formSize = () => props.size || config.size

  const fields: FormItemContextInstance[] = []

  const formExpose: FormInstance = {
    addField,
    removeField,
    // resetFields,
    clearValidate,
    validateField,
    validate,
  }
  const context: FormContextInstance = mergeProps(formExpose, props)

  const propsRef = props.ref as (el: FormInstance) => void
  propsRef?.(formExpose)

  const isValidatable = createMemo(() => {
    const hasModel = !!props.model
    if (!hasModel) {
      debugWarn('Form', 'model is required for validate to work.')
    }
    return hasModel
  })
  createEffect(
    on(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          validate().catch(debugWarn)
        }
      }
    )
  )
  const scrollToField = (prop: FormItemProp) => {
    const field = filterFields(fields, prop)[0]
    if (field) {
      field.$el?.scrollIntoView()
    }
  }
  function addField(field: FormItemContextInstance) {
    fields.push(field)
  }
  function removeField(field: FormItemContextInstance) {
    fields.splice(fields.indexOf(field), 1)
  }

  function clearValidate(props: Arrayable<FormItemProp>) {
    filterFields(fields, props).forEach((field) => field.clearValidate())
  }
  function obtainValidateFields(props: Arrayable<FormItemProp>) {
    if (fields.length === 0) return []

    const filteredFields = filterFields(fields, props)
    if (!filteredFields.length) {
      debugWarn('Form', 'please pass correct props!')
      return []
    }
    return filteredFields
  }
  async function validate(callback?: FormValidateCallback) {
    return validateField(undefined, callback)
  }
  async function doValidateField(props: Arrayable<FormItemProp> = []) {
    if (!isValidatable()) return false
    const fields = obtainValidateFields(props)
    if (fields.length === 0) return true
    let validationErrors: ValidateFieldsError = {}
    for (const field of fields) {
      try {
        await field.validate('')
      } catch (fields) {
        validationErrors = {
          ...validationErrors,
          ...(fields as ValidateFieldsError),
        }
      }
    }
    if (Object.keys(validationErrors).length === 0) return true
    return Promise.reject(validationErrors)
  }
  async function validateField(
    modelProps: Arrayable<FormItemProp> = [],
    callback?: FormValidateCallback
  ) {
    const shouldThrow = !isFunction(callback)
    try {
      const result = await doValidateField(modelProps)
      // When result is false meaning that the fields are not validatable
      if (result === true) {
        callback?.(result)
      }
      return result
    } catch (e) {
      const invalidFields = e as ValidateFieldsError

      if (props.scrollToError) {
        scrollToField(Object.keys(invalidFields)[0])
      }
      callback?.(false, invalidFields)
      return shouldThrow && Promise.reject(invalidFields)
    }
  }

  function filterFields(
    fields: FormItemContextInstance[],
    props: Arrayable<FormItemProp>
  ) {
    const normalized = castArray(props)
    return normalized.length > 0
      ? fields.filter((field) => field.prop && normalized.includes(field.prop))
      : fields
  }
  return (
    <FormContext.Provider value={context}>
      <form
        class={classNames(
          ns.b(),
          ns.m(formSize()),
          ns.m(`label-${props.labelPosition}`),
          { [ns.m('inline')]: props.inline }
        )}
      >
        {props.children}
      </form>
    </FormContext.Provider>
  )
}

export default Form
