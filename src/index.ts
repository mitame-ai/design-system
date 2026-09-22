import './styles/tezawari.css'

export { Button, type ButtonProps, buttonVariants } from './components/Button'
export {
  Card,
  CardFooter,
  CardMedia,
  CardMeta,
  type CardProps,
  CardText,
  CardTitle,
  cardVariants,
} from './components/Card'
export {
  Field,
  FieldLabel,
  type FieldLabelProps,
  FieldNote,
  type FieldProps,
} from './components/Field'
export { Icon, type IconProps } from './components/Icon'
export { Input, type InputProps, inputVariants } from './components/Input'
export { Panel, type PanelProps } from './components/Panel'
export { PaperGrain } from './components/PaperGrain'
export { Rule } from './components/Rule'
export {
  Select,
  SelectContent,
  type SelectContentProps,
  SelectItem,
  type SelectItemProps,
  type SelectProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
  type SelectValueProps,
} from './components/Select'
export { TextArea, type TextAreaProps } from './components/TextArea'

export { useTezawari } from './hooks/useTezawari'
export { repaintAll, reseed, type SkinHandle } from './lib/tezawari/registry'
export type { Skin, TezawariOptions } from './lib/tezawari/types'
export { cn } from './lib/utils'
