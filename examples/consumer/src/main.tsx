import { createRoot } from 'react-dom/client'
import '@mitame-ai/design-system/styles.css'
import './style.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Missing app root')
createRoot(root).render(<App />)
