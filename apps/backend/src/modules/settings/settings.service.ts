import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import * as crypto from 'crypto';

@Injectable()
export class SettingsService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: Buffer;

  constructor(private prisma: PrismaService) {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!';
    this.secretKey = crypto.scryptSync(key, 'salt', 32);
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decrypt(encryptedText: string): string {
    try {
      const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return '';
    }
  }

  private maskApiKey(key: string | null): string | null {
    if (!key) return null;
    const decrypted = this.decrypt(key);
    if (!decrypted) return null;
    if (decrypted.length <= 8) return '****';
    return `${decrypted.slice(0, 4)}...${decrypted.slice(-4)}`;
  }

  async getSettings(userId: string) {
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return {
        openaiApiKey: null,
        anthropicApiKey: null,
        preferredModel: 'gpt-4-turbo-preview',
        hasOpenaiKey: false,
        hasAnthropicKey: false,
      };
    }

    return {
      openaiApiKey: this.maskApiKey(settings.openaiApiKey),
      anthropicApiKey: this.maskApiKey(settings.anthropicApiKey),
      preferredModel: settings.preferredModel,
      hasOpenaiKey: !!settings.openaiApiKey,
      hasAnthropicKey: !!settings.anthropicApiKey,
    };
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    const data: any = {};

    if (dto.openaiApiKey !== undefined) {
      data.openaiApiKey = dto.openaiApiKey ? this.encrypt(dto.openaiApiKey) : null;
    }

    if (dto.anthropicApiKey !== undefined) {
      data.anthropicApiKey = dto.anthropicApiKey ? this.encrypt(dto.anthropicApiKey) : null;
    }

    if (dto.preferredModel !== undefined) {
      data.preferredModel = dto.preferredModel;
    }

    const settings = await this.prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    return {
      openaiApiKey: this.maskApiKey(settings.openaiApiKey),
      anthropicApiKey: this.maskApiKey(settings.anthropicApiKey),
      preferredModel: settings.preferredModel,
      hasOpenaiKey: !!settings.openaiApiKey,
      hasAnthropicKey: !!settings.anthropicApiKey,
    };
  }

  async getDecryptedApiKey(userId: string, provider: 'openai' | 'anthropic'): Promise<string | null> {
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) return null;

    const encryptedKey = provider === 'openai' ? settings.openaiApiKey : settings.anthropicApiKey;
    if (!encryptedKey) return null;

    return this.decrypt(encryptedKey);
  }
}
