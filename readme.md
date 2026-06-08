# koishi-plugin-onebot-manager

[![npm](https://img.shields.io/npm/v/koishi-plugin-onebot-manager?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-onebot-manager)

群管插件，功能梭哈，支持禁言/踢出等全部管理可用功能，还支持进退群等事件通知（申请逻辑已拆分至onebot-verifier）

## ✨ 功能亮点

- **🔔 关键事件通知**：
  - **成员变动**：可自定义成员入群和退群的提示消息。
  - **待办提醒**：待审核的请求将发送至指定联系人或群组，并可通过指令快速处理。
  - **管理变动**：当群内管理员被设置或取消时，会发送通知。
- **🛠️ 全面的群管命令**：提供从设置群名片、专属头衔到设置精华消息、禁言、踢人等一系列实用管理命令。
- **⚡️ 高效批量操作**：对于待处理的请求，管理员可以使用 `ya` 或 `na` 等指令一键同意或拒绝所有请求。

## ⚠️ 注意事项

- **本插件强依赖 OneBot v11 适配器**。使用前，请确保您的 Koishi 实例已正确安装并配置 `koishi-plugin-adapter-onebot`。
- **`notifyTarget` 是人工审核的核心**。请务必正确填写此项，否则所有需要人工审核的请求都将静默地等待超时后自动处理。
- 插件的许多管理功能需要机器人拥有**群主**或**管理员**权限才能正常工作。
- 您可以在 Koishi 的配置文件中为 `qgroup` 命令设置别名，以简化输入。

## ⚙️ 配置说明

以下是所有可用的配置项说明。

```yaml
plugins:
  onebot-manager:
    # ------------------ 监听配置 ------------------
    enableAdmin: true     # 开启群内管理员变动（设置/取消）的监听。
    notifyTarget: ''      # [必填] 审核和事件通知的目标，格式为 "guild:群号" 或 "private:QQ号"。
    enableJoin: false     # 开启新成员入群监听。
    enableLeave: false    # 开启群成员退群监听。
    redirectMsg: false    # 把成员入群和退群通知统一发送到通知目标。
    joinMessage: '{userName}({userId}) 加入了 {guildName}({guildId})' # 自定义入群欢迎语。
    leaveMessage: '{userName}({userId}) 离开了 {guildName}({guildId})' # 自定义退群提示。
    # 可用占位符: {userName}, {userId}, {guildName}, {guildId}

    # ------------------ 请求配置 ------------------
    enable: true          # 开启插件的请求处理总开关（好友、加群、邀请）。
    manualTimeout: 360    # 人工审核的超时时长（分钟），0 表示永不超时。
    manualTimeoutAction: 'accept' # 超时后的默认操作：'accept' (同意) 或 'reject' (拒绝)。

    # ------------------ 命令配置 ------------------
    commandWhitelist: []  # 命令白名单 (填写用户QQ号)，白名单用户可无视权限要求使用所有管理命令。
```

## 📖 命令用法

**权限说明**：

- **机器人权限**：执行大多数命令要求机器人自身在群内拥有**管理员**或**群主**身份。
- **用户权限**：命令执行者通常需要是群内的**管理员**或**群主**。
- **白名单**：在 `commandWhitelist` 中的用户不受用户权限的限制。
- **远程管理**：大多数命令支持 `-g <群号>` 或 `--group <群号>` 参数，允许在其他聊天窗口远程管理指定群组。

| 命令 | 描述 | 权限要求 (机器人/用户) | 示例 |
| --- | --- | --- | --- |
| `qgroup tag [头衔] [目标]` | 设置或清除群专属头衔 | **群主** / **管理员**或**群主** (为他人) | `qgroup tag 技术大佬` (为自己设置)`qgroup tag BUG制造机 @张三` (为他人)`qgroup tag "" @张三` (清除他人头衔) |
| `qgroup membercard [名片] [目标]` | 设置或清除群名片 | 管理员 / 管理员或群主 (为他人) | `qgroup membercard 摸鱼中` (为自己)`qgroup membercard 奋斗中 @李四` (为他人) |
| `qgroup groupname <群名>` | 设置当前群的名称 | 管理员 / 管理员或群主 | `qgroup groupname Koishi交流群` |
| `qgroup essence [消息ID]` | 将消息设为精华 | 管理员 / 管理员或群主 | `qgroup essence` (引用一条消息)`qgroup essence 123456` |
| `qgroup essence.del [消息ID]` | 移除精华消息 | 管理员 / 管理员或群主 | `qgroup essence.del` (引用一条精华消息) |
| `qgroup admin <目标>` | 设置某人为管理员 | **群主** / 管理员或群主 | `qgroup admin @王五` |
| `qgroup admin.del <目标>` | 取消某人的管理员 | **群主** / 管理员或群主 | `qgroup admin.del @王五` |
| `qgroup mute <目标> [时长]` | 禁言成员 (秒)，默认30分钟 | 管理员 / 管理员或群主 | `qgroup mute @赵六 60` (禁言60秒)`qgroup mute @赵六 -c` (取消禁言) |
| `qgroup mute.all [开关]` | 全体禁言 | 管理员 / 管理员或群主 | `qgroup mute.all` (开启)`qgroup mute.all false` (关闭) |
| `qgroup kick <目标>` | 踢出成员 | 管理员 / 管理员或群主 | `qgroup kick @钱七``qgroup kick @钱七 -r` (踢出并拒加) |
| `qgroup revoke` | 撤回消息 | 管理员 / 消息发送者 | (引用一条消息) `qgroup revoke` |
