import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import {html} from './home.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = html();

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
