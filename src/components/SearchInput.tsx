'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

type Props = {
  isAuthenticated: boolean
  defaultValue?: string
}

export function SearchInput({ isAuthenticated, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue ?? '')
  const router = useRouter()

  const showClear = isAuthenticated && value.trim().length > 0

  return (
    <form method="GET" className="search-form">
      <Input
        name="q"
        type="search"
        disabled={!isAuthenticated}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isAuthenticated ? 'Поиск по названию...' : 'Войдите для поиска'}
        autoComplete="off"
        className="search-form__input"
      />
      {showClear && (
        <button
          type="button"
          className="search-form__clear"
          aria-label="Сбросить поиск"
          onClick={() => {
            setValue('')
            router.push('/products')
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      <button
        type="submit"
        disabled={!isAuthenticated}
        className="search-form__btn"
        aria-label="Найти"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  )
}
