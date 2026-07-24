(() => {
  const BRIEFING_ORDINALS = ['첫번째', '두번째', '세번째', '네번째', '다섯번째', '여섯번째', '일곱번째', '여덟번째', '아홉번째', '열번째'];

  async function fetchRecentNews(keyword, count = 5) {
    const res = await fetch(window.APP_CONFIG.SUPABASE_NEWS_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.APP_CONFIG.SUPABASE_ANON_KEY}`,
        apikey: window.APP_CONFIG.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ keyword }),
    });
    const data = await res.json();
    if (Array.isArray(data.items)) {
      data.items = data.items.slice(0, count);
    }
    return data;
  }

  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '');
  }

  function buildPubDateLabel(pubDate) {
    const date = new Date(pubDate);
    if (Number.isNaN(date.getTime())) return pubDate;
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function buildNewsCard(item) {
    const card = document.createElement('article');
    card.className = 'news-card';

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = stripHtmlTags(item.title);

    const description = document.createElement('p');
    description.className = 'news-description';
    description.textContent = stripHtmlTags(item.description);

    const meta = document.createElement('div');
    meta.className = 'news-meta';

    const dateEl = document.createElement('span');
    dateEl.className = 'news-date';
    dateEl.textContent = buildPubDateLabel(item.pubDate);

    const linkEl = document.createElement('a');
    linkEl.className = 'news-link';
    linkEl.href = item.link;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.textContent = '원문보기';

    meta.appendChild(dateEl);
    meta.appendChild(linkEl);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);

    return card;
  }

  function renderNewsList(items) {
    const container = document.getElementById('newsList');
    if (!container) return;

    container.innerHTML = '';
    items.forEach((item) => {
      container.appendChild(buildNewsCard(item));
    });
  }

  function renderNewsLoading() {
    const container = document.getElementById('newsList');
    if (!container) return;

    container.innerHTML = '<p class="news-loading">불러오는 중...</p>';
  }

  function buildBriefingText(items) {
    return items
      .map((item, i) => {
        const ordinal = BRIEFING_ORDINALS[i] || `${i + 1}번째`;
        return `${ordinal} 뉴스, ${stripHtmlTags(item.title)}.`;
      })
      .join(' ');
  }

  function buildBriefingCard(item, index) {
    const card = document.createElement('article');
    card.className = 'news-card news-briefing-card';

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = `${index + 1}. ${stripHtmlTags(item.title)}`;

    card.appendChild(title);
    return card;
  }

  function renderNewsBriefing(items) {
    const container = document.getElementById('newsBriefing');
    if (!container) return;

    container.innerHTML = '';
    items.forEach((item, i) => {
      container.appendChild(buildBriefingCard(item, i));
    });
  }

  function speakBriefing(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  }

  function stopBriefing() {
    window.speechSynthesis.cancel();
  }

  window.NewsFeature = {
    fetchRecentNews,
    renderNewsList,
    renderNewsLoading,
    buildBriefingText,
    renderNewsBriefing,
    speakBriefing,
    stopBriefing,
  };
})();
