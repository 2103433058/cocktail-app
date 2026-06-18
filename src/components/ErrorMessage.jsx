export default function ErrorMessage({ message = '出了点问题', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🫗</div>
      <p className="font-heading text-vintage-gold text-xl mb-2">摇酒壶空了</p>
      <p className="font-body text-vintage-gold/70 text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-accent text-sm">
          再试一次
        </button>
      )}
    </div>
  )
}
