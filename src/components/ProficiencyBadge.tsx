interface ProficiencyBadgeProps {
  proficiency: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ProficiencyBadge = ({ proficiency, size = 'md', className = '' }: ProficiencyBadgeProps) => {
  const getColorClasses = (proficiency: number) => {
    if (proficiency >= 80) {
      return 'bg-green-100 text-green-800'
    } else if (proficiency >= 60) {
      return 'bg-yellow-100 text-yellow-800'
    } else {
      return 'bg-red-100 text-red-800'
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs'
      case 'lg':
        return 'px-3 py-1.5 text-sm'
      default:
        return 'px-2 py-1 text-xs'
    }
  }

  return (
    <div
      className={`
        ${getColorClasses(proficiency)}
        ${getSizeClasses(size)}
        rounded-full font-medium
        ${className}
      `}
    >
      {proficiency}%
    </div>
  )
}

export default ProficiencyBadge
