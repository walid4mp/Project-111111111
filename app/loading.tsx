export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-24">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin" />
        <div>
          <p className="font-semibold text-lg">Loading WarHex</p>
          <p className="text-sm text-gray-400">Preparing the next screen…</p>
        </div>
      </div>
    </div>
  );
}
