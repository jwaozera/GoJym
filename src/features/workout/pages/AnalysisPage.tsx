import { BarChart3, ChevronDown, Medal } from 'lucide-react'
import { Card } from '../../../components/ui'

const evolutionPoints = [
  { week: 'S1', value: 60 },
  { week: 'S2', value: 65 },
  { week: 'S3', value: 62 },
  { week: 'S4', value: 70 },
  { week: 'S5', value: 72 },
  { week: 'S6', value: 75 },
  { week: 'S7', value: 78 },
  { week: 'S8', value: 80 },
]

const rhythmData = [
  { week: 'S1', sets: 72 },
  { week: 'S2', sets: 85 },
  { week: 'S3', sets: 68 },
  { week: 'S4', sets: 80 },
  { week: 'S5', sets: 92 },
  { week: 'S6', sets: 88 },
  { week: 'S7', sets: 95 },
  { week: 'S8', sets: 102 },
]

const highlights = [
  { name: 'Supino reto', range: '60kg -> 80kg', progress: '+33%' },
  { name: 'Agachamento', range: '80kg -> 100kg', progress: '+25%' },
  { name: 'Desenvolvimento', range: '30kg -> 36kg', progress: '+20%' },
]

const maxSets = Math.max(...rhythmData.map((item) => item.sets))

export const AnalysisPage = () => {
  const linePath = evolutionPoints
    .map((point, index) => {
      const x = 18 + index * 39
      const y = 112 - ((point.value - 58) / 24) * 80
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <div className="flex flex-col gap-3 px-5 pt-14 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white leading-[1.4]">Análise</h1>
        <button
          type="button"
          className="h-10 px-3 rounded-gj-lg bg-gj-surface-elevated border border-gj-border flex items-center gap-1.5 text-white hover:border-white/30 hover:bg-white/5 focus:border-white/30 focus-visible:outline-white/40 transition-colors cursor-pointer"
          aria-label="Selecionar período"
        >
          <span className="text-xs font-semibold leading-[1.33]">8 semanas</span>
          <ChevronDown size={14} className="text-gj-text-secondary" />
        </button>
      </div>

      <button type="button" className="w-full text-left cursor-pointer">
        <Card className="!p-4 h-[240px] hover:border-gj-accent/30 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white leading-[1.43]">Supino reto</h2>
              <p className="text-[10px] text-gj-text-secondary leading-[1.5]">
                Evolução de carga máxima
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gj-success leading-[1.4]">+33%</div>
              <div className="text-[10px] text-gj-text-secondary leading-[1.5]">60kg → 80kg</div>
            </div>
          </div>

          <div className="h-[128px] rounded-gj-lg bg-gj-bg/50 px-3 py-2">
            <svg viewBox="0 0 300 112" className="h-full w-full overflow-visible" aria-hidden="true">
              <path d={linePath} fill="none" stroke="#FF6B35" strokeWidth="2" />
              {evolutionPoints.map((point, index) => {
                const x = 18 + index * 39
                const y = 112 - ((point.value - 58) / 24) * 80
                return (
                  <circle
                    key={point.week}
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#FF6B35"
                    stroke="#0A0E1A"
                    strokeWidth="3"
                  />
                )
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between px-1 pt-2">
            {evolutionPoints.map((point) => (
              <span key={point.week} className="text-[10px] text-gj-text-secondary leading-[1.5]">
                {point.week}
              </span>
            ))}
          </div>
        </Card>
      </button>

      <button type="button" className="w-full text-left cursor-pointer">
        <Card className="!p-4 h-[194px] hover:border-gj-accent/30 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white leading-[1.43]">Ritmo no período</h2>
            <BarChart3 size={16} className="text-gj-text-secondary" />
          </div>
          <p className="mb-3">
            <span className="text-xl font-bold text-white leading-[1.4]">680 </span>
            <span className="text-xs text-gj-text-secondary leading-[1.33]">séries totais</span>
          </p>

          <div className="flex h-[102px] items-end justify-between gap-2">
            {rhythmData.map((item) => (
              <div key={item.week} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.sets}</span>
                <div className="flex h-[64px] w-full items-end justify-center">
                  <div
                    className="w-full max-w-[28px] rounded-[10px]"
                    style={{
                      height: `${Math.max((item.sets / maxSets) * 64, 24)}px`,
                      background: 'linear-gradient(0deg, #FF6B35 0%, #FF8F5E 100%)',
                    }}
                  />
                </div>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.week}</span>
              </div>
            ))}
          </div>
        </Card>
      </button>

      <button type="button" className="group w-full text-left cursor-pointer">
        <Card className="!p-4 group-hover:border-gj-accent/30 group-focus-visible:border-gj-accent/30 transition-colors">
          <h2 className="mb-4 text-sm font-semibold text-white leading-[1.43]">Resumo do período</h2>
          <div className="grid grid-cols-3">
            {[
              { value: '32', label: 'Sessões' },
              { value: '26h', label: 'Tempo total' },
              { value: '67t', label: 'Carga total' },
            ].map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-white leading-[1.4]">{metric.value}</span>
                <span className="text-[10px] text-gj-text-secondary leading-[1.5]">{metric.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </button>

      <Card className="!p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white leading-[1.43]">Destaques do período</h2>
          <Medal size={16} className="text-gj-accent" />
        </div>

        <div className="flex flex-col gap-2">
          {highlights.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-gj-md bg-gj-surface-elevated px-3 py-3"
            >
              <div>
                <h3 className="text-sm font-normal text-white leading-[1.43]">{item.name}</h3>
                <p className="text-[10px] text-gj-text-secondary leading-[1.5]">{item.range}</p>
              </div>
              <span className="text-sm font-semibold text-gj-success leading-[1.43]">
                {item.progress}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
