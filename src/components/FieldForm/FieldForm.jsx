import React from 'react'
import { Form } from '@alifd/next'

const FieldForm = ({ children, field, ...props }) => {
  if (Array.isArray(children)) {
    const newChildren = children.map((item) => {
      if (Array.isArray(item.props.children)) {
        return item
      }

      const state = field.getState(item.props.children.props.name) || 'success'

      const help = state === 'error' ? field.getError(item.props.children.props.name) : ''

      return {
        ...item,
        props: {
          ...item.props,
          validateState: state,
          help
        }
      }
    })

    return (
      <Form
        {...props}
      >
        {newChildren}
      </Form>
    )
  }

  const state = field.getState(children.props.children.props.name) || 'success'
  const help = state === 'error' ? field.getError(children.props.children.props.name) : ''

  const newChildren = {
    ...children,
    props: {
      ...children.props,
      validateState: state,
      help
    }
  }

  return (
    <Form
      {...props}
    >
      {newChildren}
    </Form>
  )
}

FieldForm.Item = Form.Item

export default FieldForm
