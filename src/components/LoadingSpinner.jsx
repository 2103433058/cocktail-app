export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-5xl animate-bounce">🍹</div>
      <p className="font-script text-vintage-gold text-xl mt-4 animate-pulse">
        摇晃中...
      </p>
    </div>
  )
}
