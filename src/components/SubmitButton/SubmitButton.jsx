import React, { useState, useCallback } from 'react'
import { Button } from '@alifd/next'
import { isThenable } from '../../common/utils'

export default function SubmitButton({ onClick, ...props }) {
  const [ loading, setLoading ] = useState(false)

  const handleClick = useCallback(() => {
    if (!loading) {
      const returnedVallue = onClick()
      if (isThenable(returnedVallue)) {
        setLoading(true)
        returnedVallue.then(() => {
          setLoading(false)
        }).catch(() => {
          setLoading(false)
        })
      }
    }
  }, [loading, onClick])

  return (
    <Button
      loading={loading}
      size="large"
      type="primary"
      onClick={handleClick}
      {...props}
    />
  )
}