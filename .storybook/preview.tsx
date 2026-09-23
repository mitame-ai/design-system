import type { Decorator, Preview } from '@storybook/react-vite'
import { PaperGrain } from '../src/components/PaperGrain'
import '../src/styles/index.css'

/* index.html の body と同じ地に置く : 紙の繊維が無いと見えかたが変わる */
const onPaper: Decorator = (Story) => (
  <>
    <PaperGrain />
    <div className="tz-stage mx-auto min-h-screen max-w-[880px] px-7 pt-16 pb-24 font-tz">
      <Story />
    </div>
  </>
)

const preview: Preview = {
  decorators: [onPaper],
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['手触り', ['目次', '*']],
      },
    },
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
  },
}

export default preview
