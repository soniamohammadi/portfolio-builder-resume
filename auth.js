// auth.js
// نگهداری کاربران به صورت شیء در localStorage: key = "users" => { username1: { password, name }, ... }
// نشست فعلی: key = "loggedUser" => username

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '{}');
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setLoggedUser(username) {
  localStorage.setItem('loggedUser', username);
}

function getLoggedUser() {
  return localStorage.getItem('loggedUser');
}

function logout() {
  localStorage.removeItem('loggedUser');
}

// Signup handling (signup.html)
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const signupError = document.getElementById('signupError');
    const signupSuccess = document.getElementById('signupSuccess');

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      signupError.textContent = '';
      signupSuccess.textContent = '';

      const username = document.getElementById('signupUsername').value.trim();
      const password = document.getElementById('signupPassword').value;
      const name = document.getElementById('signupName').value.trim();

      if (!username || !password) {
        signupError.textContent = 'نام کاربری و رمز عبور الزامی است.';
        return;
      }
      if (username.includes(' ')) {
        signupError.textContent = 'نام کاربری نباید فاصله داشته باشد.';
        return;
      }
      if (password.length < 4) {
        signupError.textContent = 'رمز باید حداقل ۴ کاراکتر باشد.';
        return;
      }

      const users = getUsers();
      if (users[username]) {
        signupError.textContent = 'این نام کاربری قبلاً ثبت شده است.';
        return;
      }

      users[username] = { password, name: name || '' };
      saveUsers(users);
      signupSuccess.textContent = 'ثبت‌نام موفق. اکنون میتوانید وارد شوید.';
      // بعد از ثبت‌نام می‌توانیم کاربر را به صفحه ورود هدایت کنیم (اختیاری)
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);
    });
  }

  // Login handling (login.html)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginError = document.getElementById('loginError');
    const toSignup = document.getElementById('toSignup');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginError.textContent = '';

      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!username || !password) {
        loginError.textContent = 'لطفاً هر دو فیلد را پر کنید.';
        return;
      }
      const users = getUsers();
      const user = users[username];
      if (!user || user.password !== password) {
        loginError.textContent = 'نام کاربری یا رمز عبور اشتباه است.';
        return;
      }

      setLoggedUser(username);
      // به صفحه ادیتور برو
      window.location.href = 'editor.html';
    });

    if (toSignup) {
      toSignup.addEventListener('click', () => {
        window.location.href = 'signup.html';
      });
    }
  }

  // Logout button behavior (if any page has #logoutBtn)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.href = 'login.html';
    });
  }
});


// بررسی وضعیت ورود در صفحه اصلی (اختیاری ولی مفید)
const currentUser = getLoggedUser();
const nav = document.querySelector('nav');

if (nav && currentUser) {
  // اگر کاربر وارد شده باشد، دکمه‌های ورود و ثبت‌نام را پنهان کنیم
  const loginLink = nav.querySelector('a[href="login.html"]');
  const signupLink = nav.querySelector('a[href="signup.html"]');
  
  if (loginLink) loginLink.style.display = 'none';
  if (signupLink) signupLink.style.display = 'none';

  // و یک پیام خوش‌آمد اضافه کنیم (اختیاری)
  const welcome = document.createElement('span');
  welcome.textContent = `👋 خوش آمدی، ${currentUser}`;
  nav.appendChild(welcome);
}
