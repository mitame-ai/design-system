import { cloneElement, isValidElement, type ReactNode } from 'react'

/**
 * asChild で渡された要素の中身を包み直す。
 * 殻とラベルは部品の作りの一部なので、差し替えた要素の中にも要る。
 */
export function decorateChild(
  children: ReactNode,
  decorate: (inner: ReactNode) => ReactNode,
): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(children)) return children
  return cloneElement(children, undefined, decorate(children.props.children))
}

/** 殻。中身は塗師が書き込むので、React 側は空のままにしておく */
export const Shell = () => <span className="tz-shell" aria-hidden="true" />
