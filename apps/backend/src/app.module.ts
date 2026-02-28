import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BriefingsModule } from './modules/briefings/briefings.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { StylesModule } from './modules/styles/styles.module';
import { LayoutsModule } from './modules/layouts/layouts.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CrewAgentsModule } from './modules/crew-agents/crew-agents.module';
import { CrewTasksModule } from './modules/crew-tasks/crew-tasks.module';
import { CrewToolsModule } from './modules/crew-tools/crew-tools.module';
import { CrewsModule } from './modules/crews/crews.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BriefingsModule,
    ProposalsModule,
    TemplatesModule,
    StylesModule,
    LayoutsModule,
    SettingsModule,
    CrewAgentsModule,
    CrewTasksModule,
    CrewToolsModule,
    CrewsModule,
  ],
})
export class AppModule {}
