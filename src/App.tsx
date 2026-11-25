import { useState } from 'react'
import { Button } from './components/Button/index.ts'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
} from './components/Card/index.ts'
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

function StudyArt() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Ink circle on warm stone">
      <rect width="320" height="180" fill="var(--color-quiet-hover)" />
      <circle cx="214" cy="74" r="48" fill="var(--color-bg-raised)" />
      <circle cx="214" cy="74" r="28" fill="var(--color-accent)" />
      <rect x="28" y="126" width="112" height="6" rx="3" fill="var(--color-accent)" />
      <rect
        x="28"
        y="142"
        width="72"
        height="4"
        rx="2"
        fill="var(--color-text-muted)"
        opacity="0.65"
      />
    </svg>
  )
}

export default function App() {
  const [saved, setSaved] = useState(false)
  const [noted, setNoted] = useState(false)
  const [pinned, setPinned] = useState(false)
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

      <section className={styles.section} id="cards">
        <h2>Card</h2>
        <p className={styles.lede}>
          A surface with a shadow border, token padding, and link or button
          states.
        </p>

        <div className={styles.subsection}>
          <p className={styles.kicker}>Variants</p>
          <div className={styles.cardGrid}>
            <div className={styles.cardItem}>
              <Card>
                <CardHeader>
                  <Text variant="caption" tone="muted">
                    Field note
                  </Text>
                  <Text variant="heading-sm" as="h3">
                    Warm stone, quiet ink
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text>
                    A resting surface for the studies posted between projects.
                    The edge is a shadow, so this 12 by 16 inset stays put.
                  </Text>
                </CardBody>
                <CardFooter>
                  <Text variant="caption" tone="muted">
                    Surface
                  </Text>
                  <Button variant="outline" onClick={() => setNoted(true)}>
                    {noted ? 'Saved' : 'Save'}
                  </Button>
                </CardFooter>
              </Card>
              <span className={styles.token}>--shadow-card</span>
            </div>

            <div className={styles.cardItem}>
              <Card variant="outline">
                <CardHeader>
                  <Text variant="caption" tone="muted">
                    Outline
                  </Text>
                  <Text variant="heading-sm" as="h3">
                    Hairline only
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text tone="muted">
                    The ring is the border. There is no lift until the card is
                    a link or a button.
                  </Text>
                </CardBody>
              </Card>
              <span className={styles.token}>--shadow-card-outline</span>
            </div>

            <div className={styles.cardItem}>
              <Card variant="elevated">
                <CardMedia>
                  <StudyArt />
                </CardMedia>
                <CardHeader>
                  <Text variant="caption" tone="muted">
                    Elevated
                  </Text>
                  <Text variant="heading-sm" as="h3">
                    Afternoon study
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text tone="muted">
                    Lifted off the page for a piece that should read first.
                  </Text>
                </CardBody>
              </Card>
              <span className={styles.token}>--shadow-card-elevated</span>
            </div>

            <div className={styles.cardItem}>
              <Card variant="ghost">
                <CardHeader>
                  <Text variant="caption" tone="muted">
                    Ghost
                  </Text>
                  <Text variant="heading-sm" as="h3">
                    Quiet row
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text tone="muted">
                    No fill and no ring. A link or button card fills on hover.
                  </Text>
                </CardBody>
              </Card>
              <span className={styles.token}>no shadow</span>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <p className={styles.kicker}>Padding</p>
          <div className={styles.cardStack}>
            <div className={styles.cardItem}>
              <Card padding="sm">
                <Text variant="heading-sm" as="h3">
                  Small
                </Text>
                <Text tone="muted">8px inline, 12px block.</Text>
              </Card>
              <span className={styles.token}>
                --space-card-inline-sm · --space-card-block-sm
              </span>
            </div>
            <div className={styles.cardItem}>
              <Card padding="md">
                <Text variant="heading-sm" as="h3">
                  Default
                </Text>
                <Text tone="muted">12px inline, 16px block.</Text>
              </Card>
              <span className={styles.token}>
                --space-card-inline · --space-card-block
              </span>
            </div>
            <div className={styles.cardItem}>
              <Card padding="lg">
                <Text variant="heading-sm" as="h3">
                  Large
                </Text>
                <Text tone="muted">16px inline, 24px block.</Text>
              </Card>
              <span className={styles.token}>
                --space-card-inline-lg · --space-card-block-lg
              </span>
            </div>
            <div className={styles.cardItem}>
              <Card padding="none" variant="elevated">
                <CardMedia>
                  <StudyArt />
                </CardMedia>
              </Card>
              <span className={styles.token}>none · --space-none</span>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <p className={styles.kicker}>Interactive</p>
          <div className={styles.cardStack}>
            <div className={styles.cardItem}>
              <Card as="a" href="#cards">
                <CardHeader>
                  <Text variant="caption" tone="muted">
                    Link
                  </Text>
                  <Text variant="heading-sm" as="h3">
                    Open the field note
                  </Text>
                </CardHeader>
                <CardBody>
                  <Text tone="muted">
                    The whole card is the link. Hover lifts the shadow. Tab to
                    it for the focus outline.
                  </Text>
                </CardBody>
                <CardFooter>
                  <Text variant="caption" tone="muted">
                    Hover, press, or tab
                  </Text>
                </CardFooter>
              </Card>
              <span className={styles.token}>as=&quot;a&quot; · --shadow-card-hover</span>
            </div>
            <div className={styles.cardItem}>
              <Card
                as="button"
                variant="outline"
                aria-pressed={pinned}
                onClick={() => setPinned((current) => !current)}
              >
                <Text as="span" variant="caption" tone="muted">
                  Button
                </Text>
                <Text as="span" variant="heading-sm">
                  {pinned ? 'Pinned to the board' : 'Pin this study'}
                </Text>
                <Text as="span" tone="muted">
                  The card is the button. type is button, so it does not submit
                  a form.
                </Text>
              </Card>
              <span className={styles.token}>
                as=&quot;button&quot; · --shadow-card-outline-active
              </span>
            </div>
            <div className={styles.cardItem}>
              <Card as="button" variant="elevated" disabled>
                <Text as="span" variant="heading-sm">
                  Archived study
                </Text>
                <Text as="span" tone="muted">
                  Disabled. It does not hover or press.
                </Text>
              </Card>
              <span className={styles.token}>disabled</span>
            </div>
          </div>
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
