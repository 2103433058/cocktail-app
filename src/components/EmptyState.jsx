export default function EmptyState({ icon = '🍸', message = '这里还没有内容' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4 opacity-60">{icon}</div>
      <p className="font-body text-vintage-gold text-base">{message}</p>
    </div>
  )
}
