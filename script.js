document.addEventListener('DOMContentLoaded', () => {
  
  const container = document.querySelector('.reveal-container');
  const beforeImg = document.querySelector('.before-img');
  const slider = document.querySelector('.reveal-slider');
  const sliderBtn = document.querySelector('.slider-button');

  if (container && beforeImg && slider) {
    let isDragging = false;

    container.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    const syncImages = () => {
      const currentWidth = container.offsetWidth;
      const innerImg = beforeImg.querySelector('img');
      if (innerImg) {
        innerImg.style.width = `${currentWidth}px`;
      }
    };
    
    window.addEventListener('resize', syncImages);
    syncImages();

    const move = (clientX) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      let position = (x / rect.width) * 100;

      if (position < 0) position = 0;
      if (position > 100) position = 100;

      beforeImg.style.width = `${position}%`;
      slider.style.left = `${position}%`;
    };

    if (sliderBtn) {
      sliderBtn.addEventListener('mousedown', () => isDragging = true);
      sliderBtn.addEventListener('touchstart', () => isDragging = true, { passive: true });
    }
    
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('mousemove', (e) => { if (isDragging) move(e.clientX); });
    
    window.addEventListener('touchmove', (e) => { 
      if (isDragging && e.touches.length > 0) {
        move(e.touches[0].clientX);
      }
    }, { passive: true });
  }

  const parallaxContainer = document.querySelector('.reveal-wrapper');
  
  if (parallaxContainer) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 768) {
        parallaxContainer.style.transform = '';
        return;
      }
      
      const scrolled = window.scrollY;
      const containerOffset = parallaxContainer.offsetTop;
      const windowHeight = window.innerHeight;

      if (scrolled + windowHeight > containerOffset && scrolled < containerOffset + parallaxContainer.offsetHeight) {
        const yPos = -((scrolled + windowHeight - containerOffset) * 0.05);
        parallaxContainer.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  const servicesData = {
    cleaning: {
      title: "Детейлинг-химчистка салона",
      text: `
        <p>Полная глубокая дезинфекция и очистка внутреннего пространства автомобиля. Убираем въевшуюся грязь, застарелые пятна и неприятные запахи.</p>
        <p><b>В пакет включено:</b></p>
        <ul>
          <li>Полный демонтаж сидений для доступа к скрытым зонам</li>
          <li>Очистка торпедо, карт дверей, потолка и пола с применением гипоаллергенной химии</li>
          <li>Экстракторная чистка ковролина (вымывание грязи из глубины ворса)</li>
          <li>Деликатная очистка и консервация кожаных элементов салона крем-бальзамом</li>
        </ul>
      `
    },
    polish: {
      title: "Полировка кузова и фар",
      text: `
        <p>Вернем вашему автомобилю первозданный салонный блеск, уберем до 95% мелких царапин, затертостей от моек, а также полностью восстановим прозрачность помутневшей оптики.</p>
        <p><b>Этапы выполнения:</b></p>
        <ul>
          <li>Замер ЛКП лакокрасочного покрытия цифровым толщиномером</li>
          <li>Маскировка пластиковых и резиновых элементов кузова</li>
          <li>Многошаговая полировка кузова пастами разной зернистости</li>
          <li>Глубокая полировка фар с последующей защитой керамикой или бронепленкой</li>
        </ul>
      `
    },
    upholstery: {
      title: "Профессиональная перетяжка потолка",
      text: `
        <p>Обновите интерьер автомобиля или полностью измените его стиль. Устраняем провисания ткани, затиры, следы от сигарет и любые механические повреждения.</p>
        <p><b>Наши возможности:</b></p>
        <ul>
          <li>Перетяжка потолка и солнцезащитных козырьков в оригинальную итальянскую Алькантару или потолочную ткань</li>
          <li>Перетяжка и анатомическое восстановление стоек автомобиля</li>
          <li>Окраска оригинального салонного пластика в строгий черный цвет под тон нового потолка</li>
          <li>Широкий выбор премиальных материалов и оригинальных строчек</li>
        </ul>
      `
    },
    biled: {
      title: "Установка Bi-Led модулей",
      text: `
        <p>Качественный свет фар — это ваша безопасность на дороге. Мы профессионально модернизируем штатную оптику автомобиля, заменяя устаревший галоген, ксенон или выгоревшие линзы на сверхмощные светодиодные Bi-Led модули.</p>
        <p><b>Что входит в комплекс работ:</b></p>
        <ul>
          <li>Аккуратный демонтаж и разбор фар в специализированной печи без повреждения корпуса</li>
          <li>Глубокая очистка внутренних элементов фар и удаление старого герметика</li>
          <li>Установка и жесткая юстировка топовых Bi-Led модулей по лазерному уровню</li>
          <li>Сборка фар на новый термогерметик высокой прочности</li>
          <li>Профессиональная регулировка светового пучка на стенде по прибору (реглоскопу)</li>
        </ul>
        <p>Результат: идеальная светотеневая граница, которая не слепит встречный поток, и прирост яркости до 400%.</p>
      `
    }
  };
  const modal = document.getElementById('service-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const closeModalBtn = document.querySelector('.modal__close');
  const modalActionBtn = document.getElementById('modal-action-btn');

  document.querySelectorAll('.card[data-service]').forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const data = servicesData[serviceKey];
      
      if (data && modal && modalTitle && modalText) {
        modalTitle.innerHTML = data.title;
        modalText.innerHTML = data.text;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; 
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);

  const setupCustomSelect = (selectId, hiddenInputId) => {
    const customSelect = document.getElementById(selectId);
    if (!customSelect) return;
    
    const trigger = customSelect.querySelector('.select-trigger');
    const triggerText = trigger.querySelector('span');
    const optionsList = customSelect.querySelectorAll('.option');
    const hiddenInput = document.getElementById(hiddenInputId);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select').forEach(el => {
        if (el !== customSelect) el.classList.remove('is-open');
      });
      customSelect.classList.toggle('is-open');
    });

    optionsList.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        
        optionsList.forEach(opt => opt.classList.remove('is-selected'));
        option.classList.add('is-selected');
        
        triggerText.textContent = value;
        triggerText.style.color = '#ffffff'; 
        if (hiddenInput) hiddenInput.value = value; 
        customSelect.classList.remove('is-open');
      });
    });
  };

  setupCustomSelect('custom-service-select', 'user_service');
  setupCustomSelect('custom-time-select', 'user_time');

  window.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach(el => el.classList.remove('is-open'));
  });

  const scrollElements = document.querySelectorAll('.animate-on-scroll');

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
  };

  const displayScrollElement = (element) => { element.classList.add('active'); };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => { if (elementInView(el, 1.12)) displayScrollElement(el); });
  };

  window.addEventListener('scroll', handleScrollAnimation);
  handleScrollAnimation(); 

  const TELEGRAM_BOT_TOKEN = 'СЮДА_ВСТАВЛЯЕМ_ТОКЕН_БОТА'; 
  const TELEGRAM_CHAT_ID = 'СЮДА_ВСТАВЛЯЕМ_ID_ЧАТА_ИЛИ_ГРУППЫ'; 

  const form = document.getElementById('tg-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const serviceInput = document.getElementById('user_service');
      const timeInput = document.getElementById('user_time');

      if (!serviceInput || !serviceInput.value) {
        alert('Пожалуйста, выберите услугу!');
        const serviceSelect = document.getElementById('custom-service-select');
        if (serviceSelect) serviceSelect.classList.add('is-open');
        return;
      }
      if (!timeInput || !timeInput.value) {
        alert('Пожалуйста, выберите удобное время!');
        const timeSelect = document.getElementById('custom-time-select');
        if (timeSelect) timeSelect.classList.add('is-open');
        return;
      }

      const submitBtn = this.querySelector('.btn--primary');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'ОТПРАВИТЬ ЗАЯВКУ';

      const name = document.getElementById('user_name').value.trim();
      const phone = document.getElementById('user_phone').value.trim();
      const service = serviceInput.value;
      const time = timeInput.value;

      let message = `⚡ <b>НОВАЯ ЗАЯВКА НА ДЕТЕЙЛИНГ</b>\n\n`;
      message += `👤 <b>Клиент:</b> ${name}\n`;
      message += `📞 <b>Телефон:</b> <code>${phone}</code>\n`;
      message += `🛠️ <b>Услуга:</b> ${service}\n`;
      message += `⏱️ <b>Забронировано время:</b> ${time}\n\n`;
      message += `📅 <b>Отправлено:</b> ${new Date().toLocaleDateString('ru-RU')} | ${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;

      if (submitBtn) {
        submitBtn.textContent = 'ОТПРАВКА...';
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch(`https://telegram.org{TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
        });

        if (response.ok) {
          alert('Заявка успешно отправлена! Менеджер студии «ФЕНИКС» забронировал за вами это время.');
          this.reset();
          
          const serviceSpan = document.querySelector('#custom-service-select .select-trigger span');
          const timeSpan = document.querySelector('#custom-time-select .select-trigger span');
          
          if (serviceSpan) {
            serviceSpan.textContent = 'ВЫБЕРИТЕ УСЛУГУ';
            serviceSpan.style.color = ''; 
          }
          if (timeSpan) {
            timeSpan.textContent = 'УДОБНОЕ ВРЕМЯ ВИЗИТА';
            timeSpan.style.color = ''; 
          }
          
          serviceInput.value = '';
          timeInput.value = '';
          
          document.querySelectorAll('.custom-select .option').forEach(opt => opt.classList.remove('is-selected'));
        } else {
          throw new Error('Ошибка Telegram API');
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка при отправке. Пожалуйста, свяжитесь со студией по телефону.');
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  }
});
