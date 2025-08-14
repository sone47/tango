import { TransferSettings } from '@/types/settings'

export const validateServers = (servers: TransferSettings['iceServers']) => {
  for (const server of servers) {
    if (!server.urls?.length || !server.urls.some((url) => url.trim())) {
      throw new Error('请输入至少一个服务器地址')
    }

    for (const url of server.urls) {
      const trimmedUrl = url.trim()
      if (!trimmedUrl) continue

      // 检查URL格式
      if (!trimmedUrl.match(/^(stun|turn|turns):/)) {
        throw new Error(`无效的服务器地址格式: ${trimmedUrl}`)
      }
    }

    // 检查TURN服务器是否有认证信息
    const hasTurnServer = server.urls.some((url) => url.trim().startsWith('turn'))
    if (hasTurnServer && (!server.username?.trim() || !server.credential?.trim())) {
      throw new Error('TURN服务器需要提供用户名和密码')
    }
  }
}

export const testConnection = async (server: TransferSettings['iceServers'][number]) => {
  if (!server.urls?.length) {
    throw new Error('请先输入服务器地址')
  }

  // 过滤空的URL
  const validUrls = server.urls.filter((url) => url.trim())
  if (!validUrls.length) {
    throw new Error('请输入有效的服务器地址')
  }

  try {
    // 创建一个RTCPeerConnection来测试ICE服务器
    const config: RTCConfiguration = {
      iceServers: [
        {
          urls: validUrls,
          username: server.username || undefined,
          credential: server.credential || undefined,
        },
      ],
    }

    const pc = new RTCPeerConnection(config)

    // 设置超时（根据服务器类型调整超时时间）
    const isStunOnly = validUrls.every((url) => url.startsWith('stun:'))
    const timeoutDuration = isStunOnly ? 5000 : 10000

    const timeout = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`连接测试超时（${timeoutDuration / 1000}秒）`)),
        timeoutDuration
      )
    })

    // 等待ICE gathering完成
    const testPromise = new Promise<void>((resolve, reject) => {
      let hasValidCandidate = false
      let candidateCount = 0

      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          if (hasValidCandidate) {
            resolve()
          } else {
            reject(new Error(`未能获取到有效的ICE候选（共收集到${candidateCount}个候选）`))
          }
        }
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          candidateCount++
          // 检查是否有来自配置服务器的候选
          const candidate = event.candidate.candidate
          const hasServerCandidate = validUrls.some((url) => {
            const serverHost = url.split(':')[1]?.replace('//', '')
            return (
              candidate.includes(serverHost) ||
              candidate.includes('srflx') ||
              candidate.includes('relay')
            )
          })

          if (hasServerCandidate) {
            hasValidCandidate = true
          }
        }
      }

      // 创建数据通道以触发ICE gathering
      pc.createDataChannel('test')

      // 创建offer以开始ICE gathering
      pc.createOffer()
        .then((offer) => {
          return pc.setLocalDescription(offer)
        })
        .catch(reject)
    })

    await Promise.race([testPromise, timeout])

    pc.close()
  } catch {
    throw new Error('服务器无响应，请检查地址格式或尝试其他服务器')
  }
}
