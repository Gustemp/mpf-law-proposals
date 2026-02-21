'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, Key, Bot, Shield } from 'lucide-react';
import settingsService, { UserSettings } from '@/services/settings.service';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [preferredModel, setPreferredModel] = useState('gpt-4-turbo-preview');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
      setPreferredModel(data.preferredModel);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOpenai = async () => {
    if (!openaiKey.trim()) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings({ openaiApiKey: openaiKey });
      setSettings(updated);
      setOpenaiKey('');
      toast({
        title: 'Sucesso',
        description: 'API Key da OpenAI salva com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a API Key',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAnthropic = async () => {
    if (!anthropicKey.trim()) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings({ anthropicApiKey: anthropicKey });
      setSettings(updated);
      setAnthropicKey('');
      toast({
        title: 'Sucesso',
        description: 'API Key da Anthropic salva com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a API Key',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveOpenai = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings({ openaiApiKey: '' });
      setSettings(updated);
      toast({
        title: 'Sucesso',
        description: 'API Key da OpenAI removida',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a API Key',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAnthropic = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings({ anthropicApiKey: '' });
      setSettings(updated);
      toast({
        title: 'Sucesso',
        description: 'API Key da Anthropic removida',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a API Key',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModel = async (model: string) => {
    setPreferredModel(model);
    try {
      const updated = await settingsService.updateSettings({ preferredModel: model });
      setSettings(updated);
      toast({
        title: 'Sucesso',
        description: 'Modelo preferido atualizado',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o modelo',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure suas chaves de API para usar os recursos de IA
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              OpenAI
            </CardTitle>
            <CardDescription>
              Configure sua API Key da OpenAI para usar modelos como GPT-4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.hasOpenaiKey ? (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">API Key configurada: {settings.openaiApiKey}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={handleRemoveOpenai} disabled={saving}>
                  Remover
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="openai-key"
                        type={showOpenaiKey ? 'text' : 'password'}
                        placeholder="sk-..."
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      >
                        {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={handleSaveOpenai} disabled={saving || !openaiKey.trim()}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                      Salvar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obtenha sua API Key em{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    platform.openai.com
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Anthropic (Claude)
            </CardTitle>
            <CardDescription>
              Configure sua API Key da Anthropic para usar modelos como Claude
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.hasAnthropicKey ? (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">API Key configurada: {settings.anthropicApiKey}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={handleRemoveAnthropic} disabled={saving}>
                  Remover
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="anthropic-key"
                        type={showAnthropicKey ? 'text' : 'password'}
                        placeholder="sk-ant-..."
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                      >
                        {showAnthropicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={handleSaveAnthropic} disabled={saving || !anthropicKey.trim()}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                      Salvar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obtenha sua API Key em{' '}
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    console.anthropic.com
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modelo Preferido</CardTitle>
            <CardDescription>
              Escolha o modelo de IA padrão para geração de propostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={preferredModel} onValueChange={handleSaveModel}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo (OpenAI)</SelectItem>
                <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                <SelectItem value="claude-3-opus-20240229">Claude 3 Opus (Anthropic)</SelectItem>
                <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet (Anthropic)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
