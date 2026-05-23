import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from '@/components/layout/Navigation'
import { Disclaimer } from '@/components/layout/Disclaimer'
import { GlossaryModal } from '@/components/glossary/GlossaryModal'
import { HomePage } from '@/pages/HomePage'
import { ModulesPage } from '@/pages/ModulesPage'
import { ModuleDetailPage } from '@/pages/ModuleDetailPage'
import { GreekSandboxPage } from '@/pages/GreekSandboxPage'
import { SandboxPage } from '@/pages/SandboxPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-zinc-950 text-white flex flex-col max-w-lg mx-auto">
        <Disclaimer />
        <main className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/modules/:slug" element={<ModuleDetailPage />} />
            <Route path="/greeks" element={<GreekSandboxPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
          </Routes>
        </main>
        <Navigation />
        <GlossaryModal />
      </div>
    </BrowserRouter>
  )
}
