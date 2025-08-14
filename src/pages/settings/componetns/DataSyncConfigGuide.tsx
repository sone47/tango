export default function DataSyncConfigGuide() {
  return (
    <div className="prose prose-sm max-w-none space-y-4 text-foreground">
      <div className="space-y-3">
        <h3 className="text-base font-semibold">什么是数据同步配对功能？</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          数据同步配对功能允许您在两台设备之间直接传输单词包数据，无需通过云端服务器。这就像两台设备通过"隐形线缆"直接连接一样安全便捷。
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">为什么需要配置服务器？</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          虽然数据是设备间直接传输的，但两台设备需要先"找到"对方才能建立连接。这就像两个人要通话，需要先知道对方的电话号码一样。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ICE/TURN
          服务器就是帮助设备找到彼此的"电话簿"。当您的设备处于不同网络环境（如家庭WiFi、公司网络、手机热点）时，这些服务器能确保配对成功。
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">如何配置服务器？</h3>
        <div className="space-y-2">
          <p className="text-sm font-medium">方案一：使用免费公共服务器（推荐新手）</p>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-xs text-muted-foreground">
            <p>stun:stun.l.google.com:19302</p>
            <p>用户名和密码留空即可</p>
          </div>

          <p className="text-sm font-medium mt-4">方案二：使用付费TURN服务器（网络复杂时推荐）</p>
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              如果免费服务器无法正常配对，建议使用专业的TURN服务提供商：
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Twilio（每月免费额度）</li>
              <li>xirsys.com（有免费试用）</li>
              <li>metered.ca（价格亲民）</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              这些服务商会提供完整的服务器地址、用户名和密码。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">配置示例</h3>
        <div className="bg-muted/50 p-3 rounded-lg space-y-3">
          <div>
            <p className="text-xs font-medium mb-1">免费STUN服务器配置：</p>
            <div className="text-xs space-y-1">
              <div>
                服务器地址：
                <code>stun:stun.l.google.com:19302</code>
              </div>
              <div>
                用户名：<span className="text-muted-foreground">（留空）</span>
              </div>
              <div>
                密码：<span className="text-muted-foreground">（留空）</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-1">TURN服务器配置示例：</p>
            <div className="text-xs space-y-1">
              <div>
                服务器地址：
                <code>turn:your-server.com:3478</code>
              </div>
              <div>
                用户名：<code>your-username</code>
              </div>
              <div>
                密码：<code>your-password</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">常见问题</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium">Q: 配对失败怎么办？</p>
            <p className="text-muted-foreground text-xs">
              A:
              首先确认两台设备都连接到网络，然后尝试添加更多服务器地址，或使用付费TURN服务器。如果配对始终失败，可以使用文件导入/导出功能
            </p>
          </div>
          <div>
            <p className="font-medium">Q: 数据传输安全吗？</p>
            <p className="text-muted-foreground text-xs">
              A: 非常安全！数据直接在设备间传输，不经过任何第三方服务器，且全程加密。
            </p>
          </div>
          <div>
            <p className="font-medium">Q: 可以同时配置多个服务器吗？</p>
            <p className="text-muted-foreground text-xs">
              A: 可以！配置多个服务器能提高连接成功率，系统会自动选择最佳的服务器。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
