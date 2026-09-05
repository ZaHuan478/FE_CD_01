import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../../shared/api/auth.api'
import type { DevelopmentAccount } from '../../../entities/user/model/types'
import { useAuth } from '../model/session'
import { roleOrder, getRoleCode, getAccountIdentifier } from '../model/developmentAccounts'

export function useDevelopmentLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  // Accounts list state
  const [accounts, setAccounts] = useState<DevelopmentAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')

  // Form input state - password is NEVER prefilled
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setLoginError] = useState('')

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true)
    setAccountsError('')
    try {
      const result = await authApi.listDevelopmentAccounts()
      setAccounts(result.items)
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : String(reason)
      if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('Load failed')) {
        setAccountsError('Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại dịch vụ.')
      } else {
        setAccountsError('Không tải được danh sách tài khoản demo. Vui lòng thử lại.')
      }
    } finally {
      setAccountsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((left, right) => {
      const leftOrder = roleOrder.indexOf(getRoleCode(left))
      const rightOrder = roleOrder.indexOf(getRoleCode(right))
      return (leftOrder < 0 ? 99 : leftOrder) - (rightOrder < 0 ? 99 : rightOrder)
    })
  }, [accounts])

  const selectedAccount = useMemo(() => {
    const trimmed = identifier.trim().toLowerCase()
    if (!trimmed) return null
    return sortedAccounts.find((account) =>
      getAccountIdentifier(account).toLowerCase() === trimmed ||
      account.username.toLowerCase() === trimmed ||
      (account.email && account.email.toLowerCase() === trimmed)
    ) ?? null
  }, [identifier, sortedAccounts])

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value)
    if (loginError) setLoginError('')
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (loginError) setLoginError('')
  }

  const handleSelectDemoAccount = (chosenIdentifier: string) => {
    if (!chosenIdentifier) return
    setIdentifier(chosenIdentifier)
    if (loginError) setLoginError('')
    // Password is intentionally NOT set - user must type it
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')

    const trimmedIdentifier = identifier.trim()
    if (!trimmedIdentifier || !password) {
      setLoginError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.')
      return
    }

    setSubmitting(true)
    try {
      const result = await authApi.loginDevelopment(trimmedIdentifier, password)

      // Update session state inside Context
      await login(result.accountId)

      // Resolve safe redirect target
      const rawRedirect = searchParams.get('redirect')
      let target = '/employee-lifecycle'
      if (rawRedirect) {
        try {
          const decoded = decodeURIComponent(rawRedirect)
          if (decoded.startsWith('/') && !decoded.startsWith('//')) {
            target = decoded
          }
        } catch {
          target = '/employee-lifecycle'
        }
      }

      navigate(target, { replace: true })
    } catch (reason: unknown) {
      const rawMessage = reason instanceof Error ? reason.message : String(reason)
      if (
        rawMessage.includes('Failed to fetch') ||
        rawMessage.includes('NetworkError') ||
        rawMessage.includes('Load failed')
      ) {
        setLoginError('Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại dịch vụ.')
      } else {
        const cleanMessage = rawMessage.replace(/^Backend request failed:\s*/, '')
        setLoginError(cleanMessage || 'Tài khoản hoặc mật khẩu không đúng.')
      }
      setSubmitting(false)
    }
  }

  return { accounts, accountsLoading, accountsError, identifier, password, showPassword, setShowPassword, submitting, loginError, sortedAccounts, selectedAccount, loadAccounts, handleIdentifierChange, handlePasswordChange, handleSelectDemoAccount, handleSubmit }
}
