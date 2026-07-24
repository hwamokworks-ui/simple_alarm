export function speakBriefing(text: string) {
  if (!("speechSynthesis" in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "ko-KR"
  window.speechSynthesis.speak(utterance)
}

export function stopBriefing() {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
}
