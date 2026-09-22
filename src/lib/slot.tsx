import { cloneElement, isValidElement, type ReactNode } from 'react'

/**
 * asChild で渡された要素の内部構造を補完する。
 * シェル（.tz-shell）やラベルは Tezawari の表示に不可欠なため、置換先要素の内部にも挿入します。
 */
export function decorateChild(
  children: ReactNode,
  decorate: (inner: ReactNode) => ReactNode,
): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(children)) return children
  return cloneElement(children, undefined, decorate(children.props.children))
}

/** シェル要素。内部の SVG は描画エンジンが生成するため、React 側では空の要素として描画します */
export const Shell = () => <span className="tz-shell" aria-hidden="true" />
