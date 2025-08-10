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

export class WebRTCTransferService {
  private peer: Peer | null = null
  private connection: DataConnection | null = null
  private onOfferHandler?: (offer: ConnectionOffer) => void
  private onConnectHandler?: () => void
  private onDataHandler?: (data: Uint8Array) => void
  private onCloseHandler?: () => void
  private onErrorHandler?: (err: Error) => void

  create(config: WebRTCConfig) {
    this.destroy()

    const peerId = config.peerId || this.generatePeerId()

    this.peer = new Peer(peerId, {
      config: {
        iceServers: config.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    })

    this.peer.on('open', (id) => {
      console.log('Peer ID:', id)
      if (config.initiator) {
        // 发起者：等待用户指定要连接的对方 ID
        this.onOfferHandler?.({ peerId: id })
      }
    })

    this.peer.on('connection', (conn) => {
      this.setupConnection(conn)
    })

    this.peer.on('error', (err) => {
      console.error('Peer error:', err)
      this.onErrorHandler?.(err)
    })
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn

    conn.on('open', () => {
      console.log('Connection opened')
      this.onConnectHandler?.()
    })

    conn.on('data', (data) => {
      if (data instanceof Uint8Array) {
        this.onDataHandler?.(new Uint8Array(data))
      } else if (typeof data === 'string') {
        this.onDataHandler?.(new TextEncoder().encode(data))
      }
    })

    conn.on('close', () => {
      console.log('Connection closed')
      this.onCloseHandler?.()
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      this.onErrorHandler?.(err)
    })
  }

  connectTo(remotePeerId: string) {
    if (!this.peer) throw new Error('Peer not created')

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
    if (!this.connection) throw new Error('No connection established')
    this.connection.send(data)
  }

  isConnected(): boolean {
    return !!this.connection?.open
  }

  getPeerId(): string | null {
    return this.peer?.id || null
  }

  destroy() {
    if (this.connection) {
      try {
        this.connection.close()
      } catch {
        // noop
      }
      this.connection = null
    }

    if (this.peer) {
      try {
        this.peer.destroy()
      } catch {
        // noop
      }
      this.peer = null
    }
  }

  private generatePeerId(): string {
    return `tango-${Math.random().toString(36).substr(2, 9)}`
  }
}

export const webrtcTransferService = new WebRTCTransferService()
