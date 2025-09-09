export default function DataSyncConfigGuide() {
  return (
    <div className="prose prose-sm text-foreground max-w-none space-y-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold">配置服务器</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          设备配对需要配置ICE/TURN服务器来建立连接。推荐以下配置方案：
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">方案一：免费服务器（推荐）</p>
          <div className="bg-muted/50 text-muted-foreground space-y-1 rounded-lg p-3 text-xs">
            <p>stun:stun.l.google.com:19302</p>
            <p>用户名和密码留空即可</p>
          </div>

          <p className="mt-4 text-sm font-medium">方案二：付费TURN服务器</p>
          <div className="bg-muted/50 space-y-2 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">
              如果免费服务器无法正常配对，推荐使用以下服务商：
            </p>
            <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-xs">
              <li>expressturn.com（每月免费额度）</li>
              <li>xirsys.com（每月免费额度）</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">配置示例</h3>
        <div className="bg-muted/50 space-y-3 rounded-lg p-3">
          <div>
            <p className="mb-1 text-xs font-medium">免费STUN服务器配置：</p>
            <div className="space-y-1 text-xs">
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
            <p className="mb-1 text-xs font-medium">TURN服务器配置示例：</p>
            <div className="space-y-1 text-xs">
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
              首先确认两台设备都连接到网络，然后尝试添加更多服务器地址，或使用付费TURN服务器。如果配对始终失败，可以使用文件导入/导出功能。
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
