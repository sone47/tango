// 颜色系统
export const colors = {
  gradients: {
    blue: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    blueHover: 'hover:from-blue-100 hover:to-indigo-100',
    blueActive: 'bg-gradient-to-r from-blue-100 to-indigo-100',
    green: 'bg-gradient-to-r from-green-50 to-emerald-50',
    greenButton: 'bg-gradient-to-r from-green-500 to-emerald-500',
    purple: 'bg-gradient-to-r from-purple-50 to-violet-50',
    orange: 'bg-gradient-to-r from-orange-50 to-amber-50',
    red: 'bg-gradient-to-r from-red-50 to-rose-50',
  },
  icon: {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  },
} as const

// 基础组件样式
export const baseStyles = {
  iconContainer: 'size-8 rounded-lg flex items-center justify-center',
  iconContainerLarge: 'size-10 rounded-xl flex items-center justify-center',
  card: 'bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg',
  button: 'rounded-xl font-medium transition-colors',
  buttonPrimary: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700',
  buttonSecondary: 'px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200',
  input:
    'px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500',
} as const

// 动画类
export const animations = {
  fadeIn: 'animate-[fadeIn_0.3s_ease-out]',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
} as const

// 间距系统
export const spacing = {
  section: 'space-y-6',
  cardContent: 'space-y-4',
  buttonGroup: 'space-x-3',
  listItems: 'space-y-3',
} as const

// 响应式断点
export const responsive = {
  mobile: 'sm:',
  tablet: 'md:',
  desktop: 'lg:',
  wide: 'xl:',
} as const

// 布局样式
export const layout = {
  container: 'max-w-sm mx-auto',
  containerMd: 'max-w-md mx-auto',
  containerLg: 'max-w-lg mx-auto',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  gridCols2: 'grid grid-cols-2 gap-4',
  gridCols3: 'grid grid-cols-3 gap-4',
} as const
