'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Step = 'input' | 'briefing' | 'draft' | 'style' | 'layout' | 'complete'

export default function NewProposalPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('input')
  const [isProcessing, setIsProcessing] = useState(false)
  const [title, setTitle] = useState('')
  const [inputText, setInputText] = useState('')
  const [briefing, setBriefing] = useState('')
  const [draft, setDraft] = useState('')
  const [styledContent, setStyledContent] = useState('')
  const [layoutContent, setLayoutContent] = useState('')

  const handleGenerateBriefing = async () => {
    if (!inputText.trim()) return
    
    setIsProcessing(true)
    try {
      // TODO: Integrar com AI Agents Service
      await new Promise(resolve => setTimeout(resolve, 2000))
      setBriefing(`# Briefing Gerado

## Resumo Executivo
${inputText.substring(0, 200)}...

## Cliente
[Nome do Cliente]

## Escopo do Trabalho
- Análise jurídica completa
- Elaboração de parecer
- Acompanhamento processual

## Objetivos
Atender às necessidades jurídicas do cliente de forma eficiente.

## Complexidade
Média

## Pontos de Atenção
- Prazos processuais
- Documentação necessária`)
      setStep('briefing')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateDraft = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setDraft(`# Proposta Comercial

## Apresentação do Escritório
MPFLaw é um escritório de advocacia de alto padrão...

## Entendimento do Caso
Com base no briefing apresentado...

## Escopo dos Serviços
1. Consultoria jurídica especializada
2. Elaboração de documentos
3. Representação em processos

## Investimento
[VALOR A DEFINIR]

## Considerações Finais
Estamos à disposição para esclarecimentos.`)
      setStep('draft')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyStyle = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStyledContent(draft.replace('MPFLaw é um escritório', 'O MPFLaw se destaca como um escritório'))
      setStep('style')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyLayout = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLayoutContent(`[H1]Proposta Comercial[/H1]

[H2]Apresentação do Escritório[/H2]
[BOLD]O MPFLaw[/BOLD] se destaca como um escritório de advocacia de alto padrão...

[PAGE_BREAK]

[H2]Escopo dos Serviços[/H2]
[LIST]
[ITEM]Consultoria jurídica especializada[/ITEM]
[ITEM]Elaboração de documentos[/ITEM]
[ITEM]Representação em processos[/ITEM]
[/LIST]`)
      setStep('layout')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('complete')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 'input':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Iniciais
              </CardTitle>
              <CardDescription>
                Digite ou cole as informações sobre o caso/cliente para gerar o briefing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Proposta</Label>
                <Input
                  id="title"
                  placeholder="Ex: Proposta de Consultoria Jurídica - Empresa ABC"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input">Descrição do Caso</Label>
                <textarea
                  id="input"
                  className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Descreva o caso, necessidades do cliente, escopo do trabalho..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload de Arquivo
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleGenerateBriefing}
                  disabled={!inputText.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Briefing
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'briefing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Briefing Gerado</CardTitle>
              <CardDescription>Revise e edite o briefing antes de prosseguir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[300px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep('input')}>
                  Voltar
                </Button>
                <Button onClick={handleGenerateDraft} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'draft':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Draft da Proposta</CardTitle>
              <CardDescription>Revise e edite o draft antes de aplicar o estilo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[300px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep('briefing')}>
                  Voltar
                </Button>
                <Button onClick={handleApplyStyle} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Aplicar Estilo
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'style':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Proposta Estilizada</CardTitle>
              <CardDescription>Revise o texto com o estilo do escritório aplicado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[300px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                value={styledContent}
                onChange={(e) => setStyledContent(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep('draft')}>
                  Voltar
                </Button>
                <Button onClick={handleApplyLayout} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Aplicar Diagramação
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'layout':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Documento Diagramado</CardTitle>
              <CardDescription>Visualize o documento final com a diagramação aplicada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full min-h-[300px] p-6 rounded-md border border-input bg-white text-sm whitespace-pre-wrap">
                {layoutContent
                  .replace(/\[H1\]/g, '<h1 class="text-2xl font-bold mb-4">')
                  .replace(/\[\/H1\]/g, '</h1>')
                  .replace(/\[H2\]/g, '<h2 class="text-xl font-semibold mt-6 mb-3">')
                  .replace(/\[\/H2\]/g, '</h2>')
                  .replace(/\[BOLD\]/g, '<strong>')
                  .replace(/\[\/BOLD\]/g, '</strong>')
                  .replace(/\[LIST\]/g, '<ul class="list-disc pl-6 my-2">')
                  .replace(/\[\/LIST\]/g, '</ul>')
                  .replace(/\[ITEM\]/g, '<li>')
                  .replace(/\[\/ITEM\]/g, '</li>')
                  .replace(/\[PAGE_BREAK\]/g, '<hr class="my-8 border-t-2">')}
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep('style')}>
                  Voltar
                </Button>
                <Button onClick={handleComplete} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Finalizar Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'complete':
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Proposta Criada com Sucesso!</h2>
              <p className="text-muted-foreground mb-6">
                Sua proposta foi gerada e está pronta para download.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline">
                  Baixar DOCX
                </Button>
                <Button variant="outline">
                  Baixar PDF
                </Button>
                <Button onClick={() => router.push('/proposals')}>
                  Ver Propostas
                </Button>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const steps = [
    { key: 'input', label: 'Input' },
    { key: 'briefing', label: 'Briefing' },
    { key: 'draft', label: 'Draft' },
    { key: 'style', label: 'Estilo' },
    { key: 'layout', label: 'Layout' },
    { key: 'complete', label: 'Concluído' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Nova Proposta</h1>
          <p className="text-muted-foreground">Crie uma proposta comercial com assistência de IA</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div className={`
              h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index <= currentStepIndex 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'}
            `}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-1 mx-2
                ${index < currentStepIndex ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  )
}
