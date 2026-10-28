import { useState } from 'react'
import { Button } from './components/Button/index.ts'
import styles from './App.module.css'

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 3.5v9M3.5 8h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const [saved, setSaved] = useState(false)

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Light theme</p>
        <h1>Button</h1>
        <p className={styles.lede}>
          One component. The colors, type, radius, and focus ring come from the
          theme.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Variants</h2>
        <div className={styles.row}>
          <div className={styles.example}>
            <Button onClick={() => setSaved(true)}>
              {saved ? 'Saved' : 'Save'}
            </Button>
            <span className={styles.token}>--color-accent</span>
          </div>
          <div className={styles.example}>
            <Button variant="outline">Outline</Button>
            <span className={styles.token}>--color-border</span>
          </div>
          <div className={styles.example}>
            <Button variant="ghost">Ghost</Button>
            <span className={styles.token}>--color-text</span>
          </div>
        </div>
        <div className={styles.row}>
          <Button icon={<PlusIcon />}>Primary</Button>
          <Button variant="outline" icon={<PlusIcon />}>
            Outline
          </Button>
          <Button variant="ghost" icon={<PlusIcon />}>
            Ghost
          </Button>
        </div>
      </section>
    </main>
  )
}
