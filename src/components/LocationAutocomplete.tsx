import { useEffect, useMemo, useRef, useState } from 'react'
import './LocationAutocomplete.css'

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  seedOptions: string[]
  storageKey: string
  label: string
}

const MAX_LEARNED = 25

function readLearned(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function rememberLocation(storageKey: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return
  try {
    const existing = readLearned(storageKey).filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase())
    const next = [trimmed, ...existing].slice(0, MAX_LEARNED)
    localStorage.setItem(storageKey, JSON.stringify(next))
  } catch {
    /* storage unavailable — autocomplete just won't learn this session */
  }
}

function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  seedOptions,
  storageKey,
  label,
}: LocationAutocompleteProps) {
  const [learned, setLearned] = useState<string[]>(() => readLearned(storageKey))
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const options = useMemo(() => {
    const combined = [...learned, ...seedOptions.filter((option) => !learned.includes(option))]
    const query = value.trim().toLowerCase()
    if (!query) return combined.slice(0, 6)
    return combined.filter((option) => option.toLowerCase().includes(query)).slice(0, 6)
  }, [learned, seedOptions, value])

  const commit = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  const handleBlur = () => {
    rememberLocation(storageKey, value)
    setLearned(readLearned(storageKey))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === 'Enter' && options[highlightIndex]) {
      e.preventDefault()
      commit(options[highlightIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="location-autocomplete" ref={rootRef}>
      <label className="photo-consent__field">
        <span>{label}</span>
        <input
          type="text"
          inputMode="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => {
            onChange(e.target.value)
            setHighlightIndex(0)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </label>
      {isOpen && options.length > 0 && (
        <ul className="location-autocomplete__menu" role="listbox">
          {options.map((option, index) => (
            <li key={option} role="option" aria-selected={index === highlightIndex}>
              <button
                type="button"
                className={index === highlightIndex ? 'is-active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault()
                  commit(option)
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LocationAutocomplete
