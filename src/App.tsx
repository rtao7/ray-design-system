import { useState } from 'react'
import { Button } from './components/Button/index.ts'
import { ChatComposer } from './components/ChatComposer/index.ts'
import { ReplyBox } from './components/ReplyBox/index.ts'
import { Switch } from './components/Switch/index.ts'
import { Text } from './components/Text/index.ts'
import type { TextVariant } from './components/Text/index.ts'
import styles from './App.module.css'

const typeRamp = [
  { step: '4xl', name: '--text-4xl', size: '2.986rem' },
  { step: '3xl', name: '--text-3xl', size: '2.4883rem' },
  { step: '2xl', name: '--text-2xl', size: '2.0736rem' },
  { step: 'xl', name: '--text-xl', size: '1.728rem' },
  { step: 'lg', name: '--text-lg', size: '1.44rem' },
  { step: 'md', name: '--text-md', size: '1.2rem' },
  { step: 'sm', name: '--text-sm', size: '1rem' },
  { step: 'xs', name: '--text-xs', size: '0.8333rem' },
  { step: '2xs', name: '--text-2xs', size: '0.6944rem' },
] as const

const textStyles: { variant: TextVariant; size: string; sample: string }[] = [
  { variant: 'display', size: '2.986rem', sample: 'Ray' },
  { variant: 'heading-lg', size: '2.0736rem', sample: 'Ray' },
  { variant: 'heading-md', size: '1.44rem', sample: 'Ray' },
  { variant: 'heading-sm', size: '1rem', sample: 'Ray' },
  {
    variant: 'body-lg',
    size: '1.2rem',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    variant: 'body',
    size: '0.8333rem',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    variant: 'body-sm',
    size: '0.6944rem',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  { variant: 'label', size: '0.8333rem', sample: 'Label' },
  { variant: 'caption', size: '0.6944rem', sample: 'Caption' },
  { variant: 'code', size: '0.6944rem', sample: 'ray-ui' },
]

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
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
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([])

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
        <div className={styles.row}>
          <Button icon={<PlusIcon />} aria-label="Add" />
          <Button variant="outline" icon={<PlusIcon />} aria-label="Add outline" />
          <Button variant="ghost" icon={<PlusIcon />} aria-label="Add ghost" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Switch</h2>
        <div className={styles.row}>
          <div className={styles.example}>
            <Switch>Off</Switch>
            <span className={styles.token}>--color-control</span>
          </div>
          <div className={styles.example}>
            <Switch defaultChecked>On</Switch>
            <span className={styles.token}>--color-accent</span>
          </div>
          <div className={styles.example}>
            <Switch icon={<CloseIcon />}>Icon</Switch>
          </div>
          <div className={styles.example}>
            <Switch icon={<CloseIcon />} checkedIcon={<CheckIcon />}>
              Swap
            </Switch>
          </div>
          <div className={styles.example}>
            <Switch disabled>Disabled</Switch>
          </div>
          <Switch aria-label="Notifications" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Reply</h2>
        <ReplyBox
          recipient="Alex"
          defaultValue="Sounds good. I'll send the notes after the meeting."
          placeholder="Write a reply"
        />
      </section>

      <section className={styles.section}>
        <h2>Chat</h2>
        {messages.length > 0 ? (
          <ol className={styles.messages} aria-live="polite" aria-label="Sent messages">
            {messages.map((message) => (
              <li key={message.id} className={styles.message}>
                {message.text}
              </li>
            ))}
          </ol>
        ) : null}
        <ChatComposer
          onSend={(text) => {
            setMessages((current) => [...current, { id: current.length + 1, text }])
          }}
        />
      </section>

      <section className={styles.section}>
        <h2>Typography</h2>
        <div className={styles.stack}>
          {typeRamp.map((step) => (
            <div key={step.name} className={styles.example}>
              <p className={styles.ramp} data-step={step.step}>
                Ray
              </p>
              <span className={styles.token}>
                {step.name} · {step.size}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.stack}>
          {textStyles.map((style) => (
            <div key={style.variant} className={styles.example}>
              <Text variant={style.variant} as="p">
                {style.sample}
              </Text>
              <span className={styles.token}>
                {style.variant} · {style.size}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.row}>
          <div className={styles.example}>
            <Text variant="body">Default</Text>
            <span className={styles.token}>--color-text</span>
          </div>
          <div className={styles.example}>
            <Text variant="body" tone="muted">
              Muted
            </Text>
            <span className={styles.token}>--color-text-muted</span>
          </div>
        </div>
      </section>
    </main>
  )
}
