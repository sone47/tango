import Peer, { type DataConnection } from 'peerjs'

export interface WebRTCConfig {
  initiator: boolean
  iceServers?: RTCIceServer[]
  peerId?: string
}

export interface TransferProgress {
  table?: string
  sentBytes?: number
  receivedBytes?: number
  totalBytes?: number
  seq?: number
  totalSeq?: number
}

export interface ConnectionOffer {
  peerId: string
  remotePeerId?: string
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: unknown
}

export class WebRTCTransferService {
  private peer: Peer | null = null
  private connection: DataConnection | null = null
  private onOfferHandler?: (offer: ConnectionOffer) => void
  private onConnectHandler?: () => void
  private onDataHandler?: (data: Uint8Array) => void
  private onCloseHandler?: () => void
  private onErrorHandler?: (err: Error) => void
  private onLogHandler?: (log: LogEntry) => void
  private logs: LogEntry[] = []
  private logIdCounter = 0

  private log(level: LogEntry['level'], message: string, data?: unknown) {
    const entry: LogEntry = {
      id: (++this.logIdCounter).toString(),
      timestamp: new Date(),
      level,
      message,
      data,
    }

    this.logs.push(entry)
    this.onLogHandler?.(entry)

    // 同时使用console输出，便于开发调试
    const prefix = `[WebRTC ${level.toUpperCase()}]`
    switch (level) {
      case 'error':
        console.error(prefix, message, data)
        break
      case 'warn':
        console.warn(prefix, message, data)
        break
      case 'debug':
        if (console.debug) {
          console.debug(prefix, message, data)
        }
        break
      default:
        console.log(prefix, message, data)
    }
  }

  async create(config: WebRTCConfig) {
    this.destroy()
    this.log('info', '开始创建WebRTC连接', {
      initiator: config.initiator,
      iceServers: config.iceServers,
      customPeerId: !!config.peerId,
    })

    const peerId = config.peerId || this.generatePeerId()

    return new Promise((resolve, reject) => {
      this.peer = new Peer(peerId, {
        config: {
          iceServers: config.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }],
        },
      })

      this.peer.on('open', (id) => {
        this.log('info', 'Peer连接已建立', { peerId: id, initiator: config.initiator })
        resolve(id)
        if (config.initiator) {
          this.log('debug', '作为发起方，生成连接邀请', { peerId: id })
          this.onOfferHandler?.({ peerId: id })
        }
      })

      this.peer.on('connection', (conn) => {
        this.log('info', '收到连接请求', { remotePeerId: conn.peer })
        this.setupConnection(conn)
      })

      this.peer.on('error', (err) => {
        this.log('error', 'Peer连接错误', { error: err.message, type: err.type })
        this.onErrorHandler?.(err)
        reject(err)
      })
    })
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn
    this.log('debug', '设置数据连接监听器', { remotePeerId: conn.peer })

    conn.on('open', () => {
      this.log('info', '数据连接已建立', { remotePeerId: conn.peer })
      this.onConnectHandler?.()
    })

    conn.on('data', (data) => {
      const dataSize =
        data instanceof Uint8Array
          ? data.length
          : typeof data === 'string'
            ? data.length
            : JSON.stringify(data).length
      this.log('debug', '收到数据', {
        remotePeerId: conn.peer,
        dataType: typeof data,
        size: dataSize,
      })

      if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
        this.onDataHandler?.(new Uint8Array(data))
      } else if (typeof data === 'string') {
        this.onDataHandler?.(new TextEncoder().encode(data))
      }
    })

    conn.on('close', () => {
      this.log('info', '数据连接已关闭', { remotePeerId: conn.peer })
      this.onCloseHandler?.()
    })

    conn.on('error', (err) => {
      this.log('error', '数据连接错误', {
        remotePeerId: conn.peer,
        error: err.message,
        type: err.type,
      })
      this.onErrorHandler?.(err)
    })
  }

  connectTo(remotePeerId: string) {
    if (!this.peer) {
      this.log('error', '尝试连接但Peer未创建')
      throw new Error('Peer not created')
    }

    this.log('info', '开始连接到远程Peer', { remotePeerId })
    const conn = this.peer.connect(remotePeerId)
    this.setupConnection(conn)
  }

  onOffer(handler: (offer: ConnectionOffer) => void) {
    this.onOfferHandler = handler
  }

  onConnect(handler: () => void) {
    this.onConnectHandler = handler
  }

  onData(handler: (data: Uint8Array) => void) {
    this.onDataHandler = handler
  }

  onClose(handler: () => void) {
    this.onCloseHandler = handler
  }

  onError(handler: (err: Error) => void) {
    this.onErrorHandler = handler
  }

  send(data: Uint8Array) {
    if (!this.connection) {
      this.log('error', '尝试发送数据但连接未建立')
      throw new Error('No connection established')
    }

    this.log('debug', '发送数据', {
      remotePeerId: this.connection.peer,
      size: data.length,
    })
    this.connection.send(data)
  }

  isConnected(): boolean {
    return !!this.connection?.open
  }

  getPeerId(): string | null {
    return this.peer?.id || null
  }

  destroy() {
    if (!this.peer && !this.connection) {
      return
    }

    this.log('info', '开始销毁WebRTC连接')

    if (this.connection) {
      const remotePeerId = this.connection.peer
      try {
        this.connection.close()
        this.log('debug', '数据连接已关闭', { remotePeerId })
      } catch (err) {
        this.log('warn', '关闭数据连接时出错', { error: err })
      }
      this.connection = null
    }

    if (this.peer) {
      const peerId = this.peer.id
      try {
        this.peer.destroy()
        this.log('debug', 'Peer连接已销毁', { peerId })
      } catch (err) {
        this.log('warn', '销毁Peer连接时出错', { error: err })
      }
      this.peer = null
    }

    this.log('info', 'WebRTC连接销毁完成')
  }

  private generatePeerId(): string {
    return `tango-${Math.random().toString(36).substr(2, 9)}`
  }

  onLog(handler?: (log: LogEntry) => void) {
    this.onLogHandler = handler
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const webrtcTransferService = new WebRTCTransferService()
