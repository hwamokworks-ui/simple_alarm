export function speakBriefing(text: string) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "ko-KR"
  window.speechSynthesis.speak(utterance)
}

export function stopBriefing() {
  window.speechSynthesis.cancel()
}
