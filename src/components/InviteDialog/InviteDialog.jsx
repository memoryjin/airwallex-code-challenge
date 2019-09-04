import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Input } from '@alifd/next'

import SubmitButton from '../SubmitButton'
import useField from '../../common/hooks/useField'
import Form from '../FieldForm'
import { isMobile } from '../../common/utils'
import { requestInvite } from './data'
import './InviteDialog.scss'

const formItemLayout = isMobile ?
  {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
  } :
  {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

export default function InviteDialog({ visible, onClose }) {
  const [requestHasSent, setRequestHasSent] = useState(false)
  const field = useField()
  const { init } = field

  const confirmEmailValidator = useCallback((name, value) => {
    return field.getValue('email') === value
  }, [field])

  const resetState = useCallback(() => {
    setRequestHasSent(false)
    field.reset()
  }, [field])

  const onSubmitData = useCallback(() => {
    const pass = field.validate()
    if (pass) {
      const payload = field.getValues('name', 'email')

      return requestInvite(payload)
        .then(() => {
          setRequestHasSent(true)
        })
    }
  }, [field])

  const onCloseDialog = useCallback(() => {
    onClose()
    resetState()
  }, [resetState, onClose])

  const renderFooter = useCallback(() => {
    return requestHasSent
      ? (
        <SubmitButton onClick={onCloseDialog}>
          OK
        </SubmitButton>
      )
      : (
        <SubmitButton onClick={onSubmitData}>
          Send
        </SubmitButton>
      )
  }, [requestHasSent, onCloseDialog, onSubmitData])

  return (
    <Dialog
      className="airwallex__invite-dialog"
      title={requestHasSent ? 'All done!' : 'Request an invite'}
      footer={renderFooter()}
      visible={visible}
      onClose={onCloseDialog}
    >
      {
        !requestHasSent
          ? (
            <Form field={field}>
              <Form.Item label={isMobile ? '' : 'full name'} required {...formItemLayout}>
                <Input
                  placeholder="enter full name"
                  {...init('name', {
                    rules: [
                      { required: true, message: 'Full name can not be empty' },
                      { pattern: /^.{3,}$/, message: 'Full name should be at least 3 characters long' }
                    ]
                  })}
                />
              </Form.Item>
      
              <Form.Item label={isMobile ? '' : 'email'} required {...formItemLayout}>
                <Input
                  trim
                  placeholder="enter your email"
                  {...init('email', {
                    rules: [
                      { required: true, message: 'email can not be empty' },
                      { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: 'Please enter correct email' }
                    ]
                  })}
                />
              </Form.Item>
      
              <Form.Item label={isMobile ? '' : 'confirmEmail'} required {...formItemLayout}>
                <Input
                  trim
                  placeholder="confirm your email"
                  {...init('confirmEmail', {
                    rules: [
                      { required: true, message: 'confirmEmail can not be empty' },
                      { validator: confirmEmailValidator, message: 'Confirm email and email are not the same' }
                    ]
                  })}
                />
              </Form.Item>
    
            </Form>
          )
          : (
            <div>
              You will be one of the first to experience Broccoli & Co. When we launch.
            </div>
          )
      }

    </Dialog>
  )
}

InviteDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}