import {
  Card as CardRoot,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
} from './Card.tsx'

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
  Media: typeof CardMedia
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
}) as CardComponent

export { CardBody, CardFooter, CardHeader, CardMedia }
export type { CardProps, CardPadding, CardVariant } from './Card.tsx'
