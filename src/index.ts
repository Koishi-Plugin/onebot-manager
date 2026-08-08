import { Context, Schema } from 'koishi'
import {} from "koishi-plugin-adapter-onebot";
import { OneBotListener } from './listener'
import { utils } from './utils'
import { registerCommands } from './command'

export const name = 'onebot-manager'
export const inject = { optional: ['database'] }

export const usage = `
<div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <h2 style="margin-top: 0; color: #4a6ee0;">📌 插件说明</h2>
  <p>📖 <strong>使用文档</strong>：请点击左上角的 <strong>插件主页</strong> 查看插件使用文档</p>
  <p>🔍 <strong>更多插件</strong>：可访问 <a href="https://github.com/YisRime" style="color:#4a6ee0;text-decoration:none;">苡淞的 GitHub</a> 查看本人的所有插件</p>
</div>
<div style="border-radius: 10px; border: 1px solid #ddd; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <h2 style="margin-top: 0; color: #e0574a;">❤️ 支持与反馈</h2>
  <p>🌟 喜欢这个插件？请在 <a href="https://github.com/YisRime" style="color:#e0574a;text-decoration:none;">GitHub</a> 上给我一个 Star！</p>
  <p>🐛 遇到问题？请通过 <strong>Issues</strong> 提交反馈，或加入 QQ 群 <a href="https://qm.qq.com/q/PdLMx9Jowq" style="color:#e0574a;text-decoration:none;"><strong>855571375</strong></a> 进行交流</p>
</div>
`

export interface Config {
  notifyTarget?: string
  enableJoin?: boolean
  joinMessage?: string
  enableLeave?: boolean
  leaveMessage?: string
  redirectMsg?: boolean
  enableAdmin?: boolean
  commandWhitelist?: string[]
  forbiddenTitles?: Record<string, string>
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    enableAdmin: Schema.boolean().description('开启管理监听').default(true),
    notifyTarget: Schema.string().description('通知目标(guild/private:number)').required(),
    enableJoin: Schema.boolean().description('开启入群监听').default(false),
    enableLeave: Schema.boolean().description('开启退群监听').default(false),
    redirectMsg: Schema.boolean().description('汇总变动通知').default(false),
    joinMessage: Schema.string().description('进群提示').default('{userName}({userId}) 加入了 {guildName}({guildId})'),
    leaveMessage: Schema.string().description('退群提示').default('{userName}({userId}) 离开了 {guildName}({guildId})'),
  }).description('监听配置'),
  Schema.object({
    commandWhitelist: Schema.array(String).description('命令使用白名单').role('table'),
    forbiddenTitles: Schema.dict(Schema.string()).role('table').description('违规头衔配置'),
  }).description('命令配置'),
])

export function apply(ctx: Context, config: Config = {}) {
  const logger = ctx.logger('onebot-manager')
  new OneBotListener(ctx, logger, config).registerEventListeners()
  const qgroup = ctx.command('qgroup', 'QQ 群管').usage('群管相关功能（需要管理权限）')
  registerCommands(qgroup, logger, utils, config.commandWhitelist || [], config.forbiddenTitles)
}
