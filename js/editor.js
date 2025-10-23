// -----------------------
// المان‌های فرم
// -----------------------
const usernameInput = document.getElementById('usernameInput');
const fullNameInput = document.getElementById('fullNameInput');
const titleInput = document.getElementById('titleInput');
const bioInput = document.getElementById('bioInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const websiteInput = document.getElementById('websiteInput');

const skillsContainer = document.getElementById('skillsContainer');
const addSkillBtn = document.getElementById('addSkillBtn');

const projectsContainer = document.getElementById('projectsContainer');
const addProjectBtn = document.getElementById('addProjectBtn');

const generateLinkBtn = document.getElementById('generateLinkBtn');
const linkContainer = document.getElementById('linkContainer');

const portfolioForm = document.getElementById('portfolioForm');
const pfName = document.getElementById('pfName');
const pfBio = document.getElementById('pfBio');
const pfContacts = document.getElementById('pfContacts');
const saveStatus = document.getElementById('saveStatus');

// -----------------------
// اضافه کردن مهارت دینامیک
// -----------------------
addSkillBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'مهارت جدید';
    input.classList.add('skillInput');
    skillsContainer.appendChild(input);
});

// -----------------------
// اضافه کردن پروژه دینامیک
// -----------------------
addProjectBtn.addEventListener('click', () => {
    const div = document.createElement('div');
    div.classList.add('projectInput');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'نام پروژه';
    nameInput.classList.add('projectName');

    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.placeholder = 'توضیح پروژه';
    descInput.classList.add('projectDesc');

    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.placeholder = 'لینک پروژه';
    linkInput.classList.add('projectLink');

    div.appendChild(nameInput);
    div.appendChild(descInput);
    div.appendChild(linkInput);

    projectsContainer.appendChild(div);
});

// -----------------------
// اعتبارسنجی فرم ساده
// -----------------------
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
    if (!usernameInput.value.trim()) { alert("نام کاربری لازم است!"); return false; }
    if (!fullNameInput.value.trim()) { alert("نام کامل لازم است!"); return false; }
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) { alert("ایمیل معتبر نیست!"); return false; }
    return true;
}

// -----------------------
// ذخیره و ساخت لینک پورتفولیو
// -----------------------
generateLinkBtn.addEventListener('click', () => {
    if (!validateForm()) return;

    const username = usernameInput.value.trim();

    // جمع‌آوری اطلاعات
    const portfolioData = {
        username: username,
        fullName: fullNameInput.value,
        title: titleInput.value,
        bio: bioInput.value,
        skills: Array.from(document.querySelectorAll('.skillInput')).map(s => s.value),
        projects: Array.from(document.querySelectorAll('.projectInput')).map(p => ({
            name: p.querySelector('.projectName').value,
            description: p.querySelector('.projectDesc').value,
            link: p.querySelector('.projectLink').value
        })),
        contact: {
            email: emailInput.value,
            phone: phoneInput.value,
            website: websiteInput.value
        }
    };

    // ذخیره در localStorage
    localStorage.setItem(`portfolio_${username}`, JSON.stringify(portfolioData));

    // ساخت لینک
    linkContainer.innerHTML = "";
    const link = document.createElement('a');
    link.href = `view.html?user=${encodeURIComponent(username)}`;
    link.textContent = "مشاهده پورتفولیو من";
    link.target = "_blank";
    link.classList.add("portfolio-link");
    linkContainer.appendChild(link);

    alert("لینک ساخته شد! می‌توانید روی لینک کلیک کنید تا پورتفولیو را ببینید.");
});

// -----------------------
// اعتبارسنجی فرم قبل از submit
// -----------------------
portfolioForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    saveStatus.textContent = '';
  
    if (pfName.value.trim() === '') { valid = false; pfName.style.border = '2px solid red'; saveStatus.textContent += 'نام اجباری است.\n'; } else { pfName.style.border = ''; }
    if (pfBio.value.trim() === '') { valid = false; pfBio.style.border = '2px solid red'; saveStatus.textContent += 'درباره من اجباری است.\n'; } else { pfBio.style.border = ''; }

    const contactLines = pfContacts.value.split('\n').map(line => line.trim()).filter(line => line !== '');
    contactLines.forEach(line => {
        if (!isValidEmail(line) && !line.startsWith('https://')) {
            valid = false;
            saveStatus.textContent += `فرمت لینک یا ایمیل اشتباه: ${line}\n`;
        }
    });

    if (valid) {
        saveStatus.style.color = 'green';
        saveStatus.textContent += 'فرم معتبر است، حالا اطلاعات ذخیره می‌شوند.';
        // ذخیره اطلاعات (همان تابع generateLinkBtn یا مشابه آن)
    } else {
        saveStatus.style.color = 'red';
    }
});

// ---------- حالت شب/روز ----------
const darkModeBtn = document.createElement('button');
darkModeBtn.textContent = 'حالت شب/روز';
darkModeBtn.type = 'button';
document.body.prepend(darkModeBtn);

darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// ---------- نمایش/پنهان‌سازی پروژه‌ها ----------
const toggleProjectsBtn = document.createElement('button');
toggleProjectsBtn.textContent = 'نمایش/پنهان کردن پروژه‌ها';
toggleProjectsBtn.type = 'button';
document.body.prepend(toggleProjectsBtn);

toggleProjectsBtn.addEventListener('click', () => {
    if (projectsContainer.style.display === 'none') {
        projectsContainer.style.display = 'block';
    } else {
        projectsContainer.style.display = 'none';
    }
});

// ---------- بارگذاری داده‌ها از JSON ----------
const dataUrl = 'data/projects.json';

function loadProjects() {
    projectsContainer.innerHTML = '<p>در حال بارگذاری پروژه‌ها...</p>';

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('خطا در بارگذاری داده‌ها');
            return response.json();
        })
        .then(data => {
            projectsContainer.innerHTML = '';
            data.projects.forEach(proj => {
                const div = document.createElement('div');
                div.classList.add('project-item');
                div.innerHTML = `
                    <h4>${proj.title}</h4>
                    <p>${proj.description}</p>
                    ${proj.image ? `<img src="${proj.image}" alt="${proj.title}">` : ''}
                `;
                projectsContainer.appendChild(div);
            });
        })
        .catch(err => {
            projectsContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
        });
}

window.addEventListener('DOMContentLoaded', loadProjects);
