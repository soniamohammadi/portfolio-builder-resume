// view.js - خواندن پارامتر user و نمایش پورتفولیو از localStorage
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('user');

  const loading = document.getElementById('loading');
  const content = document.getElementById('portfolioContent');
  const errorEl = document.getElementById('portfolioError');

  function showError(msg) {
    loading.hidden = true;
    content.hidden = true;
    errorEl.hidden = false;
    errorEl.textContent = msg;
  }

  if (!username) {
    showError('پارامتر کاربر در آدرس مشخص نشده است. لینک درست را بررسی کنید.');
    return;
  }

  // پیدا کردن پورتفولیو از localStorage
  const raw = localStorage.getItem(`portfolio_${username}`);
  if (!raw) {
    showError('پورتفولیو این کاربر یافت نشد.');
    return;
  }

  try {
    const data = JSON.parse(raw);
    loading.hidden = true;
    content.hidden = false;

    // ساختار نمایش — ساده و قابل استایل شدن بعدی
    const name = data.name || username;
    const job = data.job || '';
    const bio = data.bio || '';
    const image = data.image || '';
    const contacts = Array.isArray(data.contacts) ? data.contacts : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];

    content.innerHTML = `
      <header>
        <h2>${escapeHtml(name)}</h2>
        ${ job ? `<p><strong>${escapeHtml(job)}</strong></p>` : '' }
      </header>

      ${ image ? `<figure><img src="${escapeAttr(image)}" alt="تصویر ${escapeHtml(name)}" style="max-width:200px"></figure>` : '' }

      <section>
        <h3>درباره</h3>
        <p>${escapeHtml(bio)}</p>
      </section>

      <section>
        <h3>تماس / لینک‌ها</h3>
        <ul>
          ${ contacts.map(c => `<li><a href="${escapeAttr(c)}" target="_blank" rel="noopener">${escapeHtml(c)}</a></li>`).join('') }
        </ul>
      </section>

      <section>
        <h3>پروژه‌ها</h3>
        ${ projects.length ? projects.map(p => `
            <article>
              <h4>${escapeHtml(p.title)}</h4>
              <p>${escapeHtml(p.desc)}</p>
              ${ p.image ? `<p><a href="${escapeAttr(p.image)}" target="_blank" rel="noopener">مشاهده تصویر پروژه</a></p>` : '' }
            </article>
          `).join('') : '<p>پروژه‌ای اضافه نشده است.</p>' }
      </section>

      <section>
        <button id="copyLinkViewBtn">کپی لینک جاری</button>
      </section>
    `;

    const copyBtn = document.getElementById('copyLinkViewBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = 'کپی شد ✓';
          setTimeout(() => { copyBtn.textContent = 'کپی لینک جاری'; }, 1200);
        } catch (err) {
          alert('مرورگر اجازهٔ کپی خودکار را نمی‌دهد؛ آدرس را دستی کپی کنید:\n' + window.location.href);
        }
      });
    }
  } catch (err) {
    showError('خطا در خواندن دادهٔ پورتفولیو.');
  }

  // توابع کمکی
  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }
  function escapeAttr(s) {
    if (!s) return '';
    return String(s).replaceAll('"','&quot;');
  }
});
