import { useRef, useReducer } from 'react'

export default function useField(initialValue = {}) {
  const forceUpdate = useReducer(x => x + 1, 0)[1]
  const ref = useRef(initialValue)

  const formMeta = ref.current

  const setValue = (name, val, update = true) => {
    if (!formMeta[name]) {
      formMeta[name] = {
        state: '',
        name,
        value: val,
        errors: []
      }
      forceUpdate()
    } else if (val !== formMeta[name].value) {
      formMeta[name].value = val
      if (update) {
        forceUpdate()
      }
    }
  }

  const setValues = (obj) => {
    Object.keys(obj).forEach((name) => {
      setValue(name, obj[name], false)
    })
    forceUpdate()
  }

  const getValue = name => (formMeta[name] || {}).value

  const getValues = (...args) => {
    if (!args.length) {
      args = Object.keys(formMeta)
    }

    return args.reduce((prev, cur) => {
      prev[cur] = getValue(cur)
      return prev
    }, {})
  }

  const getError = (name) => {
    return ((formMeta[name] || {}).errors || [])[0] || ''
  }

  const getErrors = (names = []) => {
    names = names.length ? names : Object.keys(formMeta)

    return names.reduce((prev, cur) => {
      prev[cur] = getError(cur)
      return prev
    })
  }

  const getState = (name) => {
    return (formMeta[name] || {}).state
  }

  const validate = (...names) => {
    if (!names.length) {
      names = Object.keys(formMeta)
    }
    names.forEach((name) => {
      const val = getValue(name)
      validateField(name, val, false)
    })
    forceUpdate()

    return !names.filter(name => formMeta[name].state === 'error').length
  }

  const remove = (...names) => {
    if (!names.length) {
      names = Object.keys(formMeta)
    }

    names.forEach((name) => {
      if (name in formMeta) {
        delete formMeta[name]
      }
    })

    forceUpdate()
  }

  const validateField = (name, val, update = true) => {
    const { rules } = formMeta[name] || {}
    if (rules) {
      const errors = rules
        .map((rule) => {
          if (rule.required && !val) {
            return rule.message || `${name}不能为空`
          }

          if (rule.pattern && !rule.pattern.test(val)) {
            return rule.message
          }

          if (rule.validator && !rule.validator(name, val)) {
            return rule.message
          }

          return ''
        })
        .filter(msg => msg)

      formMeta[name].errors = errors
      formMeta[name].state = errors.length ? 'error' : 'success'
      if (update) {
        forceUpdate()
      }
    }
  }

  const initFieldMeta = (name, options = {}, props = {}) => {
    if (!formMeta[name]) {
      formMeta[name] = {
        ...options,
        ...props,
        state: '',
        name,
        value: options.initValue || '',
        errors: []
      }
    }
  }

  const reset = (...names) => {
    if (!names.length) {
      names = Object.keys(formMeta)
    }
    names.forEach((name) => {
      setValue(name, formMeta[name].initValue || '', false)
      formMeta[name].state = ''
      formMeta[name].errors = []
    })
    forceUpdate()
  }

  const init = (name, options = {}, props = {}) => {
    const value = formMeta[name]
      ? formMeta[name].value || ''
      : options.initValue || ''

    const onChange = (val) => {
      setValue(name, val)
      if (options.rules) {
        validateField(name, val)
      }
    }

    initFieldMeta(name, options, props)

    return {
      name,
      value,
      onChange,
      ...props
    }
  }

  return {
    init,
    getValue,
    getValues,
    setValue,
    setValues,
    getError,
    getErrors,
    getState,
    remove,
    validate,
    reset,
    formMeta
  }
}
