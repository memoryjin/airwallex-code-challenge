import React from 'react'
import { render, fireEvent, waitForElement, getByText } from '@testing-library/react'
import mockAxios from 'jest-mock-axios'
import App from './App'

afterEach(() => {
  mockAxios.reset()
})

const getInviteDialog = () => document.querySelector('.airwallex__invite-dialog')
const getRequestInviteBtn = () => document.querySelector('.airwallex__body__btn')
const getSendBtn = () => getByText(document, 'Send')
const getNameInput = () => document.getElementById('name')
const getEmailInput = () => document.getElementById('email')
const getConfirmEmailInput = () => document.getElementById('confirmEmail')

const openInviteDialog = () => {
  fireEvent.click(getRequestInviteBtn())
}

test('shows invite dialog when invite button is clicked', () => {
  render(<App />)

  expect(getInviteDialog()).toBe(null)
  openInviteDialog()
  expect(getInviteDialog()).toBeInTheDocument()
})

test('if input fields is not complete，can\'t submit data', () => {
  const { queryByText } = render(<App />)

  openInviteDialog()
  fireEvent.click(getSendBtn())
  expect(queryByText('Full name can not be empty')).toBeInTheDocument()
  expect(queryByText('email can not be empty')).toBeInTheDocument()
  expect(queryByText('confirmEmail can not be empty')).toBeInTheDocument()
  expect(mockAxios.post).not.toHaveBeenCalled()
})

test('validate full name', () => {
  const { queryByText } = render(<App />)

  openInviteDialog()
  fireEvent.input(getNameInput(), { target: { value: '12' } })
  expect(queryByText('Full name should be at least 3 characters long')).toBeInTheDocument()
  fireEvent.input(getNameInput(), { target: { value: '' } })
  expect(queryByText('Full name can not be empty')).toBeInTheDocument()
  fireEvent.input(getNameInput(), { target: { value: '123' } })
  expect(queryByText('Full name can not be empty')).toBe(null)
  expect(queryByText('Full name should be at least 3 characters long')).toBe(null)
})

test('validate email', () => {
  const { queryByText } = render(<App />)

  openInviteDialog()
  fireEvent.input(getEmailInput(), { target: { value: '123' } })
  expect(queryByText('Please enter correct email')).toBeInTheDocument()
  fireEvent.input(getEmailInput(), { target: { value: '' } })
  expect(queryByText('email can not be empty')).toBeInTheDocument()
})

test('validate confirmEmail', () => {
  const { queryByText } = render(<App />)

  openInviteDialog()
  fireEvent.input(getEmailInput(), { target: { value: '352165019@qq.com' } })
  fireEvent.input(getConfirmEmailInput(), { target: { value: '352165010@qq.com' } })
  expect(queryByText('Confirm email and email are not the same')).toBeInTheDocument()
  fireEvent.input(getConfirmEmailInput(), { target: { value: '' } })
  expect(queryByText('confirmEmail can not be empty')).toBeInTheDocument()
})

test('test submit data', async () => {
  const { queryByText } = render(<App />)

  openInviteDialog()
  fireEvent.input(getNameInput(), { target: { value: 'jinchs' } })
  fireEvent.input(getEmailInput(), { target: { value: '352165019@qq.com' } })
  fireEvent.input(getConfirmEmailInput(), { target: { value: '352165019@qq.com' } })
  mockAxios.post.mockResolvedValueOnce({
    data: 'success'
  })
  fireEvent.click(getSendBtn())
  const okBtn = await waitForElement(() => getByText(document, 'OK'))
  expect(mockAxios.post).toHaveBeenCalledTimes(1)
  expect(queryByText('You will be one of the first to experience Broccoli & Co. When we launch.')).toBeInTheDocument()
  fireEvent.click(okBtn)
  expect(queryByText('You will be one of the first to experience Broccoli & Co. When we launch.')).not.toBeInTheDocument()
})
