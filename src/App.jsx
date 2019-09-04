import React, { useState, useRef } from 'react'
import '@alifd/next/index.scss'
import { Button } from '@alifd/next'
import InviteDialog from './components/InviteDialog'

import './App.scss'

export default function App() {
  const [isInviteDialogVisible, setIsInviteDialogVisible] = useState(false)
  const { current: height } = useRef(window.innerHeight)

  return (
    <div className="airwallex" style={{ height }}>
      <header className="airwallex__header">
        Broccoli & Co
      </header>

      <div className="airwallex__body">
        <div className="airwallex__body__title">
          A better way to enjoy every day.
        </div>
        <div className="airwallex__body__desc">
          Be the first to know when we launch.
        </div>
        <Button
          className="airwallex__body__btn"
          size="large"
          type="primary"
          onClick={() => setIsInviteDialogVisible(true)}
        >
          Request an invite
        </Button>
      </div>

      <footer className="airwallex__footer">
        <div>Made with ❤ in Melbourne.</div>
        <div>@2019 Broccoli & Co. All rights reserved.</div>
      </footer>

      <InviteDialog
        visible={isInviteDialogVisible}
        onClose={() => setIsInviteDialogVisible(false)}
      />
    </div>
  )
}
