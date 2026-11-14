    (function () {
      'use strict';

      var $ = function (id) { return document.getElementById(id); };

      /* ====== عناصر الواجهة العامة ====== */
      var menuBtn = $('menuBtn');
      var closeSidebarBtn = $('closeSidebarBtn');
      var sidebar = $('sidebar');
      var overlay = $('overlay');
      var themeBtn = $('themeBtn');
      var settingsBtn = $('settingsBtn');
      var settingsModal = $('settingsModal');
      var closeModalBtn = $('closeModalBtn');
      var toast = $('toast');
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      var toastTimer = null;
      var BASE_TITLE = document.title;

      /* ====== عناصر الإعدادات ====== */
      var keyBadge = $('keyBadge');
      var keyBadgeText = $('keyBadgeText');
      var keyForm = $('keyForm');
      var apiKeyInput = $('apiKeyInput');
      var toggleKeyBtn = $('toggleKeyBtn');
      var toggleKeyIcon = $('toggleKeyIcon');
      var keyStatus = $('keyStatus');
      var deleteKeyBtn = $('deleteKeyBtn');
      var groqApiKeyInput = $('groqApiKeyInput');
      var toggleGroqKeyBtn = $('toggleGroqKeyBtn');
      var toggleGroqKeyIcon = $('toggleGroqKeyIcon');
      var groqKeyStatus = $('groqKeyStatus');
      var deleteGroqKeyBtn = $('deleteGroqKeyBtn');

      /* ====== عناصر الاستقبال ====== */
      var homeView = $('homeView');
      var styleSelect = $('styleSelect');
      var recordBtn = $('recordBtn');
      var recordIcon = $('recordIcon');
      var pulseRing = $('pulseRing');
      var timerEl = $('timer');
      var recordStatus = $('recordStatus');
      var recordResult = $('recordResult');
      var audioPreview = $('audioPreview');
      var summarizeRecordBtn = $('summarizeRecordBtn');
      var discardRecordBtn = $('discardRecordBtn');
      var dropZone = $('dropZone');
      var fileInput = $('fileInput');
      var fileInfoWrap = $('fileInfoWrap');
      var fileNameEl = $('fileName');
      var fileSizeEl = $('fileSize');
      var removeFileBtn = $('removeFileBtn');
      var summarizeFileBtn = $('summarizeFileBtn');

      /* ====== عناصر التحميل ====== */
      var loadingScreen = $('loadingScreen');
      var loadingBusy = $('loadingBusy');
      var loadingError = $('loadingError');
      var loadingText = $('loadingText');
      var loadingElapsed = $('loadingElapsed');
      var errorText = $('errorText');
      var errorDetail = $('errorDetail');
      var retryBtn = $('retryBtn');
      var cancelLoadingBtn = $('cancelLoadingBtn');
      var segs = Array.prototype.slice.call(document.querySelectorAll('[data-seg]'));

      /* ====== عناصر مساحة العمل والسجل ====== */
      var workspaceView = $('workspaceView');
      var backBtn = $('backBtn');
      var titleInput = $('titleInput');
      var summaryDate = $('summaryDate');
      var copyBtn = $('copyBtn');
      var exportMdBtn = $('exportMdBtn');
      var exportPdfBtn = $('exportPdfBtn');
      var tabBtns = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
      var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
      var panelSummary = $('panel-summary');
      var panelTranscript = $('panel-transcript');
      var tasksList = $('tasksList');
      var taskCounter = $('taskCounter');
      var taskForm = $('taskForm');
      var taskInput = $('taskInput');
      var historyList = $('historyList');
      var historySearch = $('historySearch');
      var printArea = $('printArea');

      /* ====== عناصر الشات ====== */
      var chatMessages = $('chatMessages');
      var chatForm = $('chatForm');
      var chatInput = $('chatInput');
      var chatSendBtn = $('chatSendBtn');
      var chatClearBtn = $('chatClearBtn');
      var chatBackBtn = $('chatBackBtn');
      var chatMicBtn = $('chatMicBtn');
      var panelChat = $('panel-chat');

      /* ====== عناصر مسبك الأفكار ====== */
      var forgeModal = $('forgeModal');
      var forgeCloseBtn = $('forgeCloseBtn');
      var forgeResult = $('forgeResult');
      var forgeStatus = $('forgeStatus');
      var forgeOutput = $('forgeOutput');
      var forgeActions = $('forgeActions');
      var forgeCount = $('forgeCount');
      var forgeRetryBtn = $('forgeRetryBtn');
      var forgeCopyBtn = $('forgeCopyBtn');
      var forgePickBtns = Array.prototype.slice.call(document.querySelectorAll('[data-platform]'));

      /* ====== أدوات صغيرة ====== */
      function showEl(node, display) { node.classList.remove('hidden'); node.classList.add(display); }
      function hideEl(node, display) { node.classList.add('hidden'); node.classList.remove(display); }

      /* ====== التنبيه (Toast) ====== */
      function showToast(message, duration) {
        toast.textContent = message; // textContent: آمن من XSS
        // داخل الشات (شاشة كاملة) نرفع التنبيه فوق شريط الإدخال
        toast.style.bottom = (panelChat && !panelChat.classList.contains('hidden')) ? '6.5rem' : '';
        toast.classList.remove('opacity-0', 'translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-4');
        }, duration || 3500);
      }

      /* ====== القائمة الجانبية ====== */
      function isSidebarOpen() { return !sidebar.classList.contains('translate-x-full'); }

      function openSidebar() {
        sidebar.classList.remove('translate-x-full', 'invisible');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overflow-hidden');
        closeSidebarBtn.focus();
      }

      function closeSidebar() {
        sidebar.classList.add('translate-x-full', 'invisible');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
        menuBtn.focus();
      }

      /* ====== نافذة الإعدادات ====== */
      function isModalOpen() { return !settingsModal.classList.contains('hidden'); }

      function openModal() {
        updateKeyUI();
        groqApiKeyInput.value = ''; // الحقل يبدأ فارغاً دائماً (المفتاح لا يُعرض أبداً)
        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        closeModalBtn.focus();
      }

      function closeModal() {
        settingsModal.classList.add('hidden');
        settingsModal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        apiKeyInput.value = '';
        groqApiKeyInput.value = '';
        setKeyVisible(false);
        setGroqVisible(false);
        settingsBtn.focus();
      }

      /* ====== الوضع الليلي / النهاري ====== */
      function syncThemeColor() {
        var isDark = document.documentElement.classList.contains('dark');
        if (themeMeta) themeMeta.setAttribute('content', isDark ? '#0B0B10' : '#DC2626');
      }

      function toggleTheme() {
        var isDark = document.documentElement.classList.toggle('dark');
        try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
        syncThemeColor();
        showToast(isDark ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري');
      }

      /* ====== مفتاح Gemini ====== */
      var KEY_STORAGE = 'gemini_api_key';
      // يقبل: AIzaSy... (30 حرفاً فأكثر) و AQ.... (25 حرفاً فأكثر)
      var KEY_PATTERN = /^(AIzaSy[A-Za-z0-9_\-]{24,}|AQ\.[A-Za-z0-9_\-.]{22,})$/;
      var GROQ_KEY_STORAGE = 'groq_api_key';
      var GROQ_PATTERN = /^gsk_[A-Za-z0-9_\-]{20,}$/;
      var BADGE_OK = ['bg-green-100', 'text-green-700', 'dark:bg-green-900/40', 'dark:text-green-400'];
      var BADGE_BAD = ['bg-red-100', 'text-red-700', 'dark:bg-red-900/40', 'dark:text-red-400'];

      // المفاتيح تُحفظ مرمَّزة بـ Base64 (بادئة b64:) ولا تُخزَّن نصاً صريحاً. هذا ترميز لإخفائها عن النظرة العابرة وليس تشفيراً قوياً
      var SECRET_PREFIX = 'b64:';

      function encodeSecret(value) {
        try { return SECRET_PREFIX + btoa(unescape(encodeURIComponent(value))); } catch (e) { return value; }
      }

      function decodeSecret(stored) {
        if (!stored) return '';
        if (stored.indexOf(SECRET_PREFIX) !== 0) return stored; // مفتاح قديم محفوظ نصاً: يُرحَّل عند القراءة
        try { return decodeURIComponent(escape(atob(stored.slice(SECRET_PREFIX.length)))); } catch (e) { return ''; }
      }

      function readSecret(storageKey) {
        try {
          var raw = localStorage.getItem(storageKey) || '';
          if (raw && raw.indexOf(SECRET_PREFIX) !== 0) {
            // ترحيل تلقائي: أعد حفظ المفتاح القديم مرمَّزاً
            try { localStorage.setItem(storageKey, encodeSecret(raw)); } catch (e2) {}
          }
          return decodeSecret(raw);
        } catch (e) { return ''; }
      }

      function writeSecret(storageKey, value) {
        localStorage.setItem(storageKey, encodeSecret(value));
      }

      function getKey() { return readSecret(KEY_STORAGE); }

      function getGroqKey() { return readSecret(GROQ_KEY_STORAGE); }

      function updateKeyUI() {
        var key = getKey();
        var has = key.length > 0 || getGroqKey().length > 0; // أي مفتاح يكفي لاعتبار التطبيق متصلاً

        BADGE_OK.forEach(function (c) { keyBadge.classList.toggle(c, has); });
        BADGE_BAD.forEach(function (c) { keyBadge.classList.toggle(c, !has); });
        keyBadgeText.textContent = has ? 'متصل' : 'يرجى إدخال المفتاح';

        keyStatus.textContent = key.length > 0
          ? 'يوجد مفتاح محفوظ (ينتهي بـ ' + key.slice(-4) + '). أدخل مفتاحاً جديداً لاستبداله.'
          : 'لا يوجد مفتاح محفوظ حالياً.';
        deleteKeyBtn.classList.toggle('hidden', key.length === 0);

        var gq = getGroqKey();
        groqKeyStatus.textContent = gq
          ? 'يوجد مفتاح Groq محفوظ (ينتهي بـ ' + gq.slice(-4) + '). أدخل مفتاحاً جديداً لاستبداله.'
          : 'لا يوجد مفتاح Groq محفوظ حالياً.';
        deleteGroqKeyBtn.classList.toggle('hidden', gq.length === 0);
      }

      function setKeyVisible(visible) {
        apiKeyInput.type = visible ? 'text' : 'password';
        toggleKeyIcon.classList.toggle('fa-eye', !visible);
        toggleKeyIcon.classList.toggle('fa-eye-slash', visible);
        toggleKeyBtn.setAttribute('aria-label', visible ? 'إخفاء المفتاح' : 'إظهار المفتاح');
      }

      function setGroqVisible(visible) {
        groqApiKeyInput.type = visible ? 'text' : 'password';
        toggleGroqKeyIcon.classList.toggle('fa-eye', !visible);
        toggleGroqKeyIcon.classList.toggle('fa-eye-slash', visible);
        toggleGroqKeyBtn.setAttribute('aria-label', visible ? 'إخفاء المفتاح' : 'إظهار المفتاح');
      }

      toggleKeyBtn.addEventListener('click', function () {
        setKeyVisible(apiKeyInput.type === 'password');
      });

      toggleGroqKeyBtn.addEventListener('click', function () {
        setGroqVisible(groqApiKeyInput.type === 'password');
      });

      keyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var gemini = apiKeyInput.value.trim();
        var groq = groqApiKeyInput.value.trim();

        if (!gemini && !groq) { showToast('أدخل مفتاحاً واحداً على الأقل (Gemini أو Groq)'); return; }
        if (gemini && !KEY_PATTERN.test(gemini)) { showToast('صيغة مفتاح Gemini غير صحيحة، تأكد من نسخه كاملاً'); return; }
        if (groq && !GROQ_PATTERN.test(groq)) { showToast('صيغة مفتاح Groq غير صحيحة، يجب أن يبدأ بـ gsk_'); return; }

        try {
          if (gemini) writeSecret(KEY_STORAGE, gemini);
          if (groq) writeSecret(GROQ_KEY_STORAGE, groq);
        } catch (err) {
          showToast('تعذّر حفظ المفتاح (التخزين المحلي معطّل في المتصفح)');
          return;
        }
        updateKeyUI();
        closeModal(); // يمسح حقلي المفتاحين فوراً بعد الحفظ
        showToast('تم حفظ المفتاح بنجاح');
      });

      deleteGroqKeyBtn.addEventListener('click', function () {
        try { localStorage.removeItem(GROQ_KEY_STORAGE); } catch (e) {}
        groqApiKeyInput.value = '';
        updateKeyUI();
        showToast('تم حذف مفتاح Groq');
      });

      deleteKeyBtn.addEventListener('click', function () {
        try { localStorage.removeItem(KEY_STORAGE); } catch (e) {}
        apiKeyInput.value = '';
        updateKeyUI();
        showToast('تم حذف المفتاح');
      });

      keyBadge.addEventListener('click', openModal);

      /* ====== نمط التلخيص ====== */
      var STYLE_HINTS = {
        detailed: 'نمط التلخيص المطلوب: مفصّل ومناسب للطلبة؛ اشرح الأفكار بوضوح ووسّع النقاط الرئيسية.',
        meeting: 'نمط التلخيص المطلوب: مختصر ومناسب للاجتماعات؛ ركّز على القرارات والمهام.',
        bullets: 'نمط التلخيص المطلوب: نقاط سريعة؛ اجعل كل نقطة جملة قصيرة ومباشرة.',
        caesar_eye: 'نمط التلخيص المطلوب: «عين القيصر». ركّز على أمرين فقط: (1) التناقضات: أقوال أو أرقام أو مواقف تعارض بعضها داخل الحديث نفسه. (2) الوعود غير الموثقة: التزامات أو وعود أو اتفاقات شفهية قيلت دون موعد محدد أو مسؤول واضح أو توثيق. ابدأ كل نقطة رئيسية بعبارة «تناقض:» أو «وعد غير موثق:» واذكر صاحب القول إن عُرف. ضع كل وعد غير موثق أيضاً في action_items مع المسؤول والموعد إن وُجدا، وإلا فاكتب «غير محدد». استند إلى ما قيل فعلاً فقط ولا تخترع تناقضات أو وعوداً؛ وإن لم تجد أياً منها فاذكر ذلك صراحة في الخلاصة التنفيذية.'
      };

      (function restoreStyle() {
        try {
          var saved = localStorage.getItem('summaryStyle');
          if (!saved) return;
          for (var i = 0; i < styleSelect.options.length; i++) {
            if (styleSelect.options[i].value === saved) { styleSelect.selectedIndex = i; break; }
          }
        } catch (e) {}
      })();

      styleSelect.addEventListener('change', function () {
        try { localStorage.setItem('summaryStyle', styleSelect.value); } catch (e) {}
      });

      /* ====== التسجيل المباشر (MediaRecorder) ====== */
      var stream = null;
      var recorder = null;
      var chunks = [];
      var recordedBlob = null;
      var recordedSeconds = 0;
      var audioUrl = null;
      var isStarting = false;
      var isRecording = false;
      var timerInterval = null;
      var startTime = 0;

      function pad(n) { return n < 10 ? '0' + n : String(n); }

      function formatTime(totalSeconds) {
        return pad(Math.floor(totalSeconds / 60)) + ':' + pad(totalSeconds % 60);
      }

      var MAX_RECORD_SECONDS = 10 * 60; // الحد الأقصى للتسجيل: 10 دقائق
      var MAX_RECORD_TEXT = 'وصلت للحد الأقصى (10 دقائق). يمكنك تلخيص هذا الجزء، ثم تسجيل الجزء التالي.';
      var autoStopped = false;

      function updateTimer() {
        var secs = Math.floor((Date.now() - startTime) / 1000);
        if (secs > MAX_RECORD_SECONDS) secs = MAX_RECORD_SECONDS;
        timerEl.textContent = formatTime(secs);
        if (isRecording && secs >= MAX_RECORD_SECONDS) {
          // وصل العداد إلى 10:00: إيقاف تلقائي مع رسالة
          autoStopped = true;
          showToast(MAX_RECORD_TEXT, 9000);
          stopRecording();
        }
      }

      function startTimer() {
        startTime = Date.now();
        timerEl.textContent = '00:00';
        timerEl.classList.remove('hidden', 'text-slate-500', 'dark:text-slate-300');
        timerEl.classList.add('text-red-500');
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 250);
      }

      function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        updateTimer();
        timerEl.classList.remove('text-red-500');
        timerEl.classList.add('text-slate-500', 'dark:text-slate-300');
      }

      function setRecordingUI(active) {
        isRecording = active;
        if (active) {
          recordBtn.classList.remove('bg-caesar', 'glow-caesar');
          recordBtn.classList.add('rec-live');
          recordIcon.classList.remove('fa-microphone');
          recordIcon.classList.add('fa-stop');
          pulseRing.classList.remove('hidden');
          recordBtn.setAttribute('aria-label', 'إيقاف التسجيل');
          recordStatus.textContent = 'جارٍ التسجيل... اضغط للإيقاف';
        } else {
          recordBtn.classList.add('bg-caesar', 'glow-caesar');
          recordBtn.classList.remove('rec-live');
          recordIcon.classList.add('fa-microphone');
          recordIcon.classList.remove('fa-stop');
          pulseRing.classList.add('hidden');
          recordBtn.setAttribute('aria-label', 'بدء التسجيل');
        }
      }

      function releaseStream() {
        if (stream) {
          stream.getTracks().forEach(function (t) { t.stop(); });
          stream = null;
        }
      }

      function clearRecording() {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrl = null;
        }
        recordedBlob = null;
        recordedSeconds = 0;
        audioPreview.removeAttribute('src');
        audioPreview.load();
        recordResult.classList.add('hidden');
      }

      function pickMimeType() {
        var candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
        for (var i = 0; i < candidates.length; i++) {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
        }
        return '';
      }

      function micErrorMessage(err) {
        var name = err && err.name;
        if (name === 'NotAllowedError' || name === 'SecurityError') return 'تم رفض إذن الميكروفون. فعّله من إعدادات المتصفح.';
        if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'لم يتم العثور على ميكروفون في جهازك.';
        if (name === 'NotReadableError') return 'الميكروفون مستخدم من تطبيق آخر.';
        return 'تعذّر بدء التسجيل.';
      }

      function resetRecordUI() {
        setRecordingUI(false);
        recordStatus.textContent = 'اضغط على الميكروفون لبدء التسجيل';
      }

      function onRecorderStop() {
        var type = (recorder && recorder.mimeType) || 'audio/webm';
        releaseStream();

        if (!chunks.length) {
          autoStopped = false;
          recordStatus.textContent = 'اضغط على الميكروفون لبدء التسجيل';
          showToast('التسجيل فارغ، حاول مرة أخرى');
          return;
        }

        recordedBlob = new Blob(chunks, { type: type });
        chunks = [];
        audioUrl = URL.createObjectURL(recordedBlob);
        audioPreview.src = audioUrl;
        recordResult.classList.remove('hidden');
        recordStatus.textContent = autoStopped ? MAX_RECORD_TEXT : 'تم إيقاف التسجيل. يمكنك المعاينة أو التلخيص';
        autoStopped = false;
      }

      async function startRecording() {
        if (isStarting || isRecording) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
          showToast('المتصفح لا يدعم التسجيل (يلزم فتح التطبيق عبر HTTPS)');
          return;
        }

        isStarting = true;
        recordBtn.disabled = true;

        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          showToast(micErrorMessage(err));
          isStarting = false;
          recordBtn.disabled = false;
          return;
        }

        try {
          var mime = pickMimeType();
          // 64 كيلوبت/ث تكفي للكلام، وتضمن أن 10 دقائق تبقى أقل بكثير من 10 ميجابايت
          var recOpts = { audioBitsPerSecond: 64000 };
          if (mime) recOpts.mimeType = mime;
          recorder = new MediaRecorder(stream, recOpts);
        } catch (err) {
          releaseStream();
          showToast('تعذّر تهيئة المسجّل الصوتي');
          isStarting = false;
          recordBtn.disabled = false;
          return;
        }

        chunks = [];
        autoStopped = false;
        clearRecording();

        recorder.addEventListener('dataavailable', function (e) {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        });
        recorder.addEventListener('stop', onRecorderStop);
        recorder.addEventListener('error', function () {
          stopTimer();
          resetRecordUI();
          releaseStream();
          showToast('حدث خطأ أثناء التسجيل');
        });

        recorder.start();
        setRecordingUI(true);
        startTimer();

        isStarting = false;
        recordBtn.disabled = false;
      }

      function stopRecording() {
        if (!recorder || recorder.state === 'inactive') return;
        recordedSeconds = Math.min((Date.now() - startTime) / 1000, MAX_RECORD_SECONDS);
        setRecordingUI(false);
        stopTimer();
        recorder.stop();
      }

      recordBtn.addEventListener('click', function () {
        if (isRecording) stopRecording();
        else startRecording();
      });

      discardRecordBtn.addEventListener('click', function () {
        clearRecording();
        timerEl.classList.add('hidden');
        timerEl.textContent = '00:00';
        resetRecordUI();
        showToast('تم حذف التسجيل');
      });

      window.addEventListener('pagehide', function () {
        if (recorder && recorder.state !== 'inactive') recorder.stop();
        releaseStream();
      });

      /* ====== رفع ملف صوتي ====== */
      var MAX_SIZE = 10 * 1024 * 1024; // 10 ميجابايت
      var FILE_TOO_BIG_TEXT = 'الملف كبير جداً (يتجاوز 10 ميجابايت). يرجى تقطيعه إلى أجزاء أصغر.';
      var ALLOWED_EXT = ['mp3', 'wav', 'm4a', 'ogg', 'webm'];
      var EXT_MIME = {
        mp3: 'audio/mp3',
        wav: 'audio/wav',
        m4a: 'audio/mp4',
        ogg: 'audio/ogg',
        webm: 'audio/webm'
      };
      var selectedFile = null;

      function getExt(name) {
        var i = name.lastIndexOf('.');
        return i === -1 ? '' : name.slice(i + 1).toLowerCase();
      }

      function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      }

      function clearFile() {
        selectedFile = null;
        fileInput.value = '';
        fileNameEl.textContent = '';
        fileSizeEl.textContent = '';
        fileInfoWrap.classList.add('hidden');
      }

      function handleFile(file) {
        if (!file) return;

        if (ALLOWED_EXT.indexOf(getExt(file.name)) === -1) {
          showToast('صيغة غير مدعومة. الصيغ المقبولة: mp3, wav, m4a, ogg, webm');
          fileInput.value = '';
          return;
        }
        if (file.size > MAX_SIZE) {
          showToast(FILE_TOO_BIG_TEXT, 8000);
          fileInput.value = '';
          return;
        }
        if (file.size === 0) {
          showToast('الملف فارغ');
          fileInput.value = '';
          return;
        }

        selectedFile = file;
        fileNameEl.textContent = file.name; // textContent: آمن من XSS
        fileSizeEl.textContent = formatSize(file.size);
        fileInfoWrap.classList.remove('hidden');
      }

      fileInput.addEventListener('change', function () {
        handleFile(fileInput.files && fileInput.files[0]);
      });

      removeFileBtn.addEventListener('click', clearFile);

      var DRAG_CLASSES = ['border-brand', 'bg-brand-50/60', 'dark:bg-slate-700/50'];

      function setDragState(on) {
        DRAG_CLASSES.forEach(function (c) { dropZone.classList[on ? 'add' : 'remove'](c); });
      }

      ['dragenter', 'dragover'].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) {
          e.preventDefault();
          setDragState(true);
        });
      });

      dropZone.addEventListener('dragleave', function (e) {
        if (!dropZone.contains(e.relatedTarget)) setDragState(false);
      });

      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        setDragState(false);
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files || !files.length) return;
        if (files.length > 1) showToast('سيتم استخدام الملف الأول فقط');
        handleFile(files[0]);
      });

      window.addEventListener('dragover', function (e) { e.preventDefault(); });
      window.addEventListener('drop', function (e) { e.preventDefault(); });

      /* ====== شاشة التحميل: الخطوات والعدّاد ====== */
      var STAGES = [
        'سيزار يفك شيفرة حديثك...',
        'سيزار يلتقط نبض أفكارك...',
        'سيزار يستدعي أرشيفه المعرفي...',
        'سيزار يستخرج الجوهر...'
      ];
      var STEP_SWITCH_MS = 4000;

      var loadingMode = 'busy'; // 'busy' | 'error'
      var currentStage = 0;
      var stageTimer = null;
      var elapsedInterval = null;
      var elapsedStart = 0;
      var wakeLock = null;

      function setStage(index) {
        currentStage = index;
        loadingText.textContent = STAGES[index];
        segs.forEach(function (seg, i) {
          seg.classList.toggle('bg-white', i <= index);
          seg.classList.toggle('bg-white/25', i > index);
        });
      }

      function clearStageTimer() {
        clearTimeout(stageTimer);
        stageTimer = null;
      }

      function startElapsed() {
        stopElapsed();
        elapsedStart = Date.now();
        loadingElapsed.textContent = '00:00';
        elapsedInterval = setInterval(function () {
          loadingElapsed.textContent = formatTime(Math.floor((Date.now() - elapsedStart) / 1000));
        }, 1000);
      }

      function stopElapsed() {
        clearInterval(elapsedInterval);
        elapsedInterval = null;
      }

      // منع انطفاء الشاشة أثناء المعالجة (Screen Wake Lock)
      async function acquireWakeLock() {
        try {
          if ('wakeLock' in navigator && !wakeLock) {
            var lock = await navigator.wakeLock.request('screen');
            wakeLock = lock;
            lock.addEventListener('release', function () {
              if (wakeLock === lock) wakeLock = null;
            });
          }
        } catch (e) { /* غير مدعوم أو مرفوض: نتجاهله */ }
      }

      function releaseWakeLock() {
        try { if (wakeLock) wakeLock.release(); } catch (e) {}
        wakeLock = null;
      }

      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && isProcessing && loadingMode === 'busy') {
          acquireWakeLock();
        }
      });

      function showBusyView() {
        loadingMode = 'busy';
        showEl(loadingBusy, 'flex');
        hideEl(loadingError, 'flex');
        hideEl(retryBtn, 'inline-flex');
        cancelLoadingBtn.textContent = 'إلغاء';
      }

      function showErrorView(message, detail) {
        loadingMode = 'error';
        clearStageTimer();
        stopElapsed();
        releaseWakeLock();
        errorText.textContent = message;
        errorDetail.textContent = detail || '';
        hideEl(loadingBusy, 'flex');
        showEl(loadingError, 'flex');
        showEl(retryBtn, 'inline-flex');
        cancelLoadingBtn.textContent = 'إغلاق';
        retryBtn.focus();
      }

      function openLoading() {
        showBusyView();
        setStage(0);
        showEl(loadingScreen, 'flex');
        document.body.classList.add('overflow-hidden');
        startElapsed();
        acquireWakeLock();
        cancelLoadingBtn.focus();
      }

      function closeLoading() {
        clearStageTimer();
        stopElapsed();
        releaseWakeLock();
        hideEl(loadingScreen, 'flex');
        document.body.classList.remove('overflow-hidden');
      }

      function isLoading() { return !loadingScreen.classList.contains('hidden'); }

      /* ====== تحويل الصوت إلى WAV (16000 هرتز، Mono) ====== */
      var WAV_RATE = 16000;
      var MAX_WAV_BYTES = 14 * 1024 * 1024; // سقف حجم WAV المرسل إلى Gemini (حد الطلب 20MB بعد base64)
      var MIN_WAV_RATE = 8000;              // أدنى معدل عينات عند الحاجة لتقليص التسجيلات الطويلة

      // true = تحويل كل الملفات إلى WAV، false = تحويل webm و m4a والتسجيلات فقط
      var ALWAYS_CONVERT_TO_WAV = false;
      var CONVERT_MIMES = ['audio/webm', 'video/webm', 'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'video/mp4'];

      function needsConversion(mime) {
        return ALWAYS_CONVERT_TO_WAV || CONVERT_MIMES.indexOf(mime) !== -1;
      }

      function decodeAudio(ctx, arrayBuffer) {
        return new Promise(function (resolve, reject) {
          ctx.decodeAudioData(arrayBuffer, resolve, reject);
        });
      }

      function closeAudioCtx(ctx) {
        try { if (ctx && ctx.close) ctx.close().catch(function () {}); } catch (e) {}
      }

      async function resampleToMono(decoded, rate) {
        var OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!OfflineCtx) throw fail('المتصفح لا يدعم تحويل الصوت إلى WAV.');
        var frames = Math.ceil(decoded.duration * rate);
        var offline = new OfflineCtx(1, frames, rate);
        var source = offline.createBufferSource();
        source.buffer = decoded;
        source.connect(offline.destination);
        source.start(0);
        try {
          return await offline.startRendering();
        } catch (e) {
          throw fail('تعذّر تحويل الصوت إلى WAV.', (e && e.message) || 'startRendering failed');
        }
      }

      function audioBufferToWav(ab) {
        var frames = ab.length;
        var nCh = ab.numberOfChannels;
        var channels = [];
        for (var c = 0; c < nCh; c++) channels.push(ab.getChannelData(c));

        var buffer = new ArrayBuffer(44 + frames * 2);
        var view = new DataView(buffer);

        function writeStr(offset, s) {
          for (var k = 0; k < s.length; k++) view.setUint8(offset + k, s.charCodeAt(k));
        }

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + frames * 2, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, ab.sampleRate, true);
        view.setUint32(28, ab.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data');
        view.setUint32(40, frames * 2, true);

        var pcm = new Int16Array(buffer, 44, frames);
        for (var i = 0; i < frames; i++) {
          var sum = 0;
          for (var j = 0; j < nCh; j++) sum += channels[j][i];
          var s = sum / nCh;
          if (s > 1) s = 1; else if (s < -1) s = -1;
          pcm[i] = s < 0 ? s * 32768 : s * 32767;
        }
        return new Blob([buffer], { type: 'audio/wav' });
      }

      async function convertToWav(blob) {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) throw fail('المتصفح لا يدعم تحويل الصوت إلى WAV.');

        var arrayBuffer;
        try {
          arrayBuffer = await blob.arrayBuffer();
        } catch (e) {
          throw fail('تعذّر قراءة الملف الصوتي');
        }

        var ctx;
        try { ctx = new AudioCtx({ sampleRate: WAV_RATE }); } catch (e) { ctx = new AudioCtx(); }

        var decoded;
        try {
          decoded = await decodeAudio(ctx, arrayBuffer);
        } catch (e) {
          throw fail('تعذّر فك ترميز الصوت. قد تكون الصيغة غير مدعومة في متصفحك أو الملف تالف.',
            (e && e.message) || 'decodeAudioData failed');
        } finally {
          arrayBuffer = null;
          closeAudioCtx(ctx);
        }

        if (!decoded.length) throw fail('الصوت فارغ');

        // 16 كيلوهرتز عادةً. للتسجيلات الطويلة (حتى 10 دقائق) يُخفَّض المعدل ليبقى الحجم ضمن حد Gemini
        var rate = WAV_RATE;
        if (44 + Math.ceil(decoded.duration * rate) * 2 > MAX_WAV_BYTES) {
          rate = Math.floor((MAX_WAV_BYTES - 44) / (decoded.duration * 2));
          if (rate < MIN_WAV_RATE) {
            throw fail('الصوت طويل جداً للتحويل (الحد الأقصى نحو 15 دقيقة). جرّب مقطعاً أقصر.');
          }
        }

        var finalBuf = decoded;
        if (decoded.sampleRate !== rate) {
          finalBuf = await resampleToMono(decoded, rate);
        }
        decoded = null;

        return audioBufferToWav(finalBuf);
      }

      /* ====== محرك Gemini ====== */
      // الطبقتان 4 و 5: Gemini (يفهم الصوت مباشرة). تُجرَّب النماذج بالترتيب
      var MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
      var ATTEMPT_TIMEOUT_MS = 45000;          // مهلة كل نموذج
      var BUSY_RETRY_DELAY_MS = 2000;          // عند 503 من النموذج الأول: انتظار ثانيتين
      var BUSY_RETRY_TIMEOUT_MS = 20000;       // ثم محاولة أخيرة قصيرة مع نفس النموذج
      var FALLBACK_STATUSES = [503, 429];      // أخطاء تنقلنا للنموذج التالي بصمت
      var FALLBACK_TEXT = 'الخوادم مزدحمة، جاري استخدام النموذج الاحتياطي...';

      // الطبقات 1 إلى 3: Groq (Whisper للتفريغ ثم Llama للتلخيص حسب الطول)
      var GROQ_STT_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
      var GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
      var GROQ_STT_MODEL = 'whisper-large-v3-turbo';          // الطبقة 1: تحويل الصوت إلى نص
      var GROQ_FAST_MODEL = 'llama-3.1-8b-instant';           // التوجيه الذكي: نص قصير = سرعة قصوى
      var GROQ_QUALITY_MODEL = 'llama-3.3-70b-versatile';     // التوجيه الذكي: نص طويل = جودة أعلى
      var SHORT_AUDIO_SECONDS = 30;            // أقل من 30 ثانية صوتية = قصير
      var SHORT_TRANSCRIPT_CHARS = 450;        // بديل عند غياب المدة: نحو 30 ثانية كلاماً بالعربية
      var GROQ_STT_TIMEOUT_MS = 45000;         // مهلة Whisper
      var GROQ_SUMMARY_TIMEOUT_MS = 30000;     // مهلة Llama في التلخيص
      var AUDIO_EXT = {
        'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/wave': 'wav',
        'audio/mp3': 'mp3', 'audio/mpeg': 'mp3',
        'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/m4a': 'm4a',
        'audio/ogg': 'ogg', 'audio/webm': 'webm', 'video/webm': 'webm'
      };

      function geminiUrl(model) {
        return 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent';
      }
      var ERROR_TOAST_MS = 9000;

      var PROMPT_BASE =
        'أنت مساعد ذكي. قم بتحليل هذا الملف الصوتي (محاضرة أو اجتماع) وأعد النتيجة بصيغة JSON حصرية تحتوي على المفاتيح التالية: ' +
        'title (عنوان ذكي)، executive_summary (ملخص في 3 أسطر)، key_points (مصفوفة من النقاط)، ' +
        'action_items (مصفوفة من المهام كل مهمة تحتوي على task و assignee و deadline)، full_transcript (النص الكامل).';

      var PROMPT_EXTRA =
        'اكتب كل المحتوى بالعربية الفصحى المبسطة. إذا لم تُذكر مهام فأعد action_items كمصفوفة فارغة، ' +
        'وإذا لم يُذكر المسؤول أو الموعد لمهمة ما فاكتب "غير محدد".';

      var RESPONSE_SCHEMA = {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          executive_summary: { type: 'STRING' },
          key_points: { type: 'ARRAY', items: { type: 'STRING' } },
          action_items: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                task: { type: 'STRING' },
                assignee: { type: 'STRING' },
                deadline: { type: 'STRING' }
              },
              required: ['task', 'assignee', 'deadline']
            }
          },
          full_transcript: { type: 'STRING' }
        },
        required: ['title', 'executive_summary', 'key_points', 'action_items', 'full_transcript']
      };

      var isProcessing = false;
      var runAbort = null;
      var payload = null;

      function fail(message, detail, retryable) {
        var err = new Error(message);
        err.userFacing = true;
        if (detail) err.detail = String(detail).slice(0, 400);
        if (retryable) err.retryable = true;
        return err;
      }

      function abortError() {
        var e = new Error('Aborted');
        e.name = 'AbortError';
        return e;
      }

      function guard(ctrl) {
        if (ctrl.signal.aborted) throw abortError();
      }

      function delay(ms, ctrl) {
        return new Promise(function (resolve, reject) {
          var t = setTimeout(function () {
            ctrl.signal.removeEventListener('abort', onAbort);
            resolve();
          }, ms);
          function onAbort() { clearTimeout(t); reject(abortError()); }
          ctrl.signal.addEventListener('abort', onAbort, { once: true });
        });
      }

      function waitForOnline(ctrl, maxMs) {
        if (navigator.onLine !== false) return Promise.resolve();
        return new Promise(function (resolve, reject) {
          var t = setTimeout(finish, maxMs);
          function cleanup() {
            clearTimeout(t);
            window.removeEventListener('online', finish);
            ctrl.signal.removeEventListener('abort', onAbort);
          }
          function finish() { cleanup(); resolve(); }
          function onAbort() { cleanup(); reject(abortError()); }
          window.addEventListener('online', finish);
          ctrl.signal.addEventListener('abort', onAbort, { once: true });
        });
      }

      function blobToBase64(blob) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () {
            var s = String(reader.result);
            var i = s.indexOf(',');
            resolve(i === -1 ? '' : s.slice(i + 1));
          };
          reader.onerror = function () { reject(fail('تعذّر قراءة الملف الصوتي')); };
          reader.readAsDataURL(blob);
        });
      }

      function baseMime(type) {
        var t = String(type || '').split(';')[0].trim().toLowerCase();
        return t || 'audio/webm';
      }

      function httpErrorMessage(status, apiMsg) {
        var msg = String(apiMsg || '');
        if (/API key|API_KEY/i.test(msg) && status !== 429) return 'المفتاح غير صالح. تحقق منه في الإعدادات.';
        if (/location is not supported/i.test(msg)) return 'خدمة Gemini غير متاحة في منطقتك حالياً.';
        if (status === 400) {
          if (/audio|mime|format|unsupported|invalid.*(data|argument)/i.test(msg)) return 'صيغة الصوت غير مدعومة أو الملف تالف.';
          return 'تعذّر معالجة الطلب.';
        }
        if (status === 401 || status === 403) return 'المفتاح غير صالح أو لا يملك صلاحية استخدام هذه الخدمة.';
        if (status === 404) return 'نموذج الذكاء الاصطناعي غير متاح حالياً.';
        if (status === 413) return 'حجم الملف كبير جداً على الخدمة.';
        if (status === 429) return 'تجاوزت حد الاستخدام المجاني. حاول بعد قليل.';
        if (status >= 500) return 'خوادم Google مشغولة حالياً.';
        return 'حدث خطأ في الاتصال بالخدمة.';
      }

      function parseModelJson(text) {
        var clean = text.trim();
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        return JSON.parse(clean);
      }

      function str(v) {
        if (typeof v === 'string') return v.trim();
        return v === null || v === undefined ? '' : String(v);
      }

      function normalizeResult(raw) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
          throw fail('رد الذكاء الاصطناعي غير مفهوم. حاول مرة أخرى.');
        }
        var points = Array.isArray(raw.key_points) ? raw.key_points.map(str).filter(Boolean) : [];
        var items = (Array.isArray(raw.action_items) ? raw.action_items : []).map(function (it) {
          if (it && typeof it === 'object') {
            return {
              task: str(it.task),
              assignee: str(it.assignee) || 'غير محدد',
              deadline: str(it.deadline) || 'غير محدد'
            };
          }
          return { task: str(it), assignee: 'غير محدد', deadline: 'غير محدد' };
        }).filter(function (it) { return it.task; });

        return {
          title: str(raw.title) || 'خلاصة بدون عنوان',
          executive_summary: str(raw.executive_summary),
          key_points: points,
          action_items: items,
          full_transcript: str(raw.full_transcript)
        };
      }

      // إرسال طلب إلى Gemini وإرجاع JSON الرد (مشترك بين التلخيص والشات)
      async function postGemini(apiKey, body, signal, model) {
        var res;
        try {
          // المفتاح يُرسل في الترويسة x-goog-api-key (وليس في الرابط)
          res = await fetch(geminiUrl(model || MODELS[0]), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify(body),
            signal: signal
          });
        } catch (e) {
          if (e && e.name === 'AbortError') throw e;
          throw fail('تعذّر الاتصال بخوادم Google. تحقق من اتصالك بالإنترنت.', e && e.message, true);
        }

        if (!res.ok) {
          var errData = null;
          try { errData = await res.json(); } catch (e) {}
          var apiMsg = errData && errData.error && errData.error.message;
          console.error('Gemini HTTP error (' + (model || MODELS[0]) + '):', res.status, apiMsg || '(بلا رسالة)');
          var httpErr = fail(
            httpErrorMessage(res.status, apiMsg),
            'HTTP ' + res.status + (apiMsg ? ': ' + apiMsg : ''),
            res.status >= 500 || res.status === 408
          );
          httpErr.status = res.status;
          // 503 أو 429: يُنتقل للنموذج الاحتياطي بصمت
          if (FALLBACK_STATUSES.indexOf(res.status) !== -1) httpErr.fallback = true;
          throw httpErr;
        }

        try {
          return await res.json();
        } catch (e) {
          if (e && e.name === 'AbortError') throw e;
          throw fail('انقطع الاتصال أثناء استلام الرد.', e && e.message, true);
        }
      }

      // استخراج نص أول مرشّح من رد Gemini
      function readCandidate(data) {
        if (data.promptFeedback && data.promptFeedback.blockReason) {
          throw fail('تم حجب الرد من قبل الخدمة.', 'blockReason: ' + data.promptFeedback.blockReason);
        }

        var candidate = data.candidates && data.candidates[0];
        if (!candidate) throw fail('لم يُرجع الذكاء الاصطناعي أي نتيجة. حاول مرة أخرى.');

        var parts = (candidate.content && candidate.content.parts) || [];
        var text = parts
          .filter(function (p) { return typeof p.text === 'string' && !p.thought; })
          .map(function (p) { return p.text; })
          .join('');

        if (!text) {
          throw fail('لم يُرجع الذكاء الاصطناعي أي نص. حاول مرة أخرى.',
            candidate.finishReason ? 'finishReason: ' + candidate.finishReason : '');
        }
        return { text: text, finishReason: candidate.finishReason };
      }

      async function callGemini(apiKey, base64, mime, signal, model) {
        var styleHint = STYLE_HINTS[styleSelect.value] || '';
        var body = {
          contents: [{
            parts: [
              { text: PROMPT_BASE + '\n' + styleHint + '\n' + PROMPT_EXTRA },
              { inline_data: { mime_type: mime, data: base64 } }
            ]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.2
          }
        };

        var data = await postGemini(apiKey, body, signal, model);
        var out = readCandidate(data);

        var parsed;
        try {
          parsed = parseModelJson(out.text);
        } catch (e) {
          if (out.finishReason === 'MAX_TOKENS') {
            throw fail('الرد طويل جداً ولم يكتمل. جرّب تسجيلاً أقصر.', 'finishReason: MAX_TOKENS');
          }
          throw fail('تعذّر قراءة رد الذكاء الاصطناعي. حاول مرة أخرى.', e && e.message);
        }

        return normalizeResult(parsed);
      }

      // محاولة واحدة مع نموذج محدد، بمهلة 45 ثانية
      async function attemptGemini(apiKey, data, runCtrl, model, isFallback, timeoutMs) {
        var limit = timeoutMs || ATTEMPT_TIMEOUT_MS;
        var ctrl = new AbortController();
        var timedOut = false;
        function onRunAbort() { ctrl.abort(); }
        runCtrl.signal.addEventListener('abort', onRunAbort);
        var timeoutId = setTimeout(function () { timedOut = true; ctrl.abort(); }, limit);

        if (!isFallback) {
          setStage(1);
          clearStageTimer();
          stageTimer = setTimeout(function () {
            if (loadingMode === 'busy' && currentStage === 1) setStage(2);
          }, STEP_SWITCH_MS);
        }
        // في النموذج الاحتياطي يبقى نص "الخوادم مزدحمة..." ظاهراً

        try {
          return await callGemini(apiKey, data.base64, data.gmime, ctrl.signal, model);
        } catch (e) {
          if (e && e.name === 'AbortError' && timedOut && !runCtrl.signal.aborted) {
            var te = fail('انتهت مهلة الطلب. الخوادم بطيئة أو الملف طويل.',
              'timeout بعد ' + (limit / 1000) + ' ثانية (' + model + ')', true);
            te.fallback = true; // انتهاء المهلة = انتقال صامت للنموذج التالي
            throw te;
          }
          throw e;
        } finally {
          clearTimeout(timeoutId);
          clearStageTimer();
          runCtrl.signal.removeEventListener('abort', onRunAbort);
        }
      }

      function describeError(err) {
        console.error('Summarize error:', err);
        if (err && err.userFacing) return err.message + (err.detail ? '\n' + err.detail : '');
        return 'حدث خطأ غير متوقع:\n' + ((err && err.name) || 'Error') + ': ' + ((err && err.message) || '');
      }

      function finishProcessing() {
        closeLoading();
        isProcessing = false;
        payload = null;
        runAbort = null;
      }

      /* ====== الطبقة الثالثة: Groq ====== */
      function groqErrorMessage(status, apiMsg) {
        var msg = String(apiMsg || '');
        if (status === 401) return 'مفتاح Groq غير صالح. تحقق منه في الإعدادات.';
        if (status === 403) return 'مفتاح Groq لا يملك صلاحية استخدام هذه الخدمة.';
        if (status === 429) return 'تجاوزت حد الاستخدام المجاني في Groq. حاول بعد قليل.';
        if (status === 413) return 'حجم الملف أو النص كبير جداً على Groq.';
        if (status === 400) {
          if (/audio|file|format|media|transcri/i.test(msg)) return 'صيغة الصوت غير مدعومة لدى Groq أو الملف تالف.';
          return 'تعذّر معالجة الطلب لدى Groq.';
        }
        if (status === 404) return 'نموذج Groq غير متاح حالياً.';
        if (status >= 500) return 'خوادم Groq مشغولة حالياً.';
        return 'حدث خطأ في الاتصال بخدمة Groq.';
      }

      // طلب إلى Groq بمهلة، مع ربطه بزر الإلغاء. يُرجع JSON الرد
      async function groqFetch(url, options, runCtrl, timeoutMs) {
        var ctrl = new AbortController();
        var timedOut = false;
        function onRunAbort() { ctrl.abort(); }
        runCtrl.signal.addEventListener('abort', onRunAbort);
        var timeoutId = setTimeout(function () { timedOut = true; ctrl.abort(); }, timeoutMs);
        options.signal = ctrl.signal;

        function timeoutError() {
          return fail('انتهت مهلة الاتصال بـ Groq.', 'timeout بعد ' + (timeoutMs / 1000) + ' ثانية', true);
        }

        try {
          var res;
          try {
            res = await fetch(url, options);
          } catch (e) {
            if (e && e.name === 'AbortError') {
              if (timedOut && !runCtrl.signal.aborted) throw timeoutError();
              throw e;
            }
            throw fail('تعذّر الاتصال بخوادم Groq. تحقق من اتصالك بالإنترنت.', e && e.message, true);
          }

          if (!res.ok) {
            var errData = null;
            try { errData = await res.json(); } catch (e) {}
            var apiMsg = errData && errData.error && errData.error.message;
            console.error('Groq HTTP error:', res.status, apiMsg || '(بلا رسالة)');
            var groqErr = fail(
              groqErrorMessage(res.status, apiMsg),
              'Groq HTTP ' + res.status + (apiMsg ? ': ' + apiMsg : ''),
              res.status >= 500 || res.status === 429 || res.status === 408
            );
            groqErr.status = res.status;
            throw groqErr;
          }

          try {
            return await res.json();
          } catch (e) {
            if (e && e.name === 'AbortError') {
              if (timedOut && !runCtrl.signal.aborted) throw timeoutError();
              throw e;
            }
            throw fail('انقطع الاتصال أثناء استلام رد Groq.', e && e.message, true);
          }
        } finally {
          clearTimeout(timeoutId);
          runCtrl.signal.removeEventListener('abort', onRunAbort);
        }
      }

      var GROQ_SYSTEM_PROMPT =
        'أنت مساعد ذكي. ستستلم النص المفرَّغ لمحاضرة أو اجتماع. أعد النتيجة بصيغة JSON حصرية تحتوي على المفاتيح التالية فقط: ' +
        'title (عنوان ذكي)، executive_summary (ملخص في 3 أسطر)، key_points (مصفوفة من النقاط)، ' +
        'action_items (مصفوفة من المهام كل مهمة تحتوي على task و assignee و deadline). ' +
        'اكتب كل المحتوى بالعربية الفصحى المبسطة. إذا لم تُذكر مهام فأعد action_items كمصفوفة فارغة، ' +
        'وإذا لم يُذكر المسؤول أو الموعد لمهمة ما فاكتب "غير محدد".';

      // اختيار نموذج التلخيص: أقل من 30 ثانية صوتية = 8b السريع، غير ذلك = 70b الأقوى
      function pickSummaryModel(seconds, transcript) {
        var short = seconds > 0 ? seconds < SHORT_AUDIO_SECONDS : transcript.length < SHORT_TRANSCRIPT_CHARS;
        return short ? GROQ_FAST_MODEL : GROQ_QUALITY_MODEL;
      }

      // الطبقات 1 إلى 3: Whisper للتفريغ، ثم Llama (يُختار حسب الطول) للتلخيص. full_transcript يأتي من Whisper مباشرة
      async function summarizeWithGroq(data, apiKey, runCtrl) {
        var blob = data.blob;

        // الخطوة أ: تحويل الصوت إلى نص (verbose_json ليعيد مدة الصوت الحقيقية)
        var ext = AUDIO_EXT[baseMime(data.mime || blob.type)] || 'webm';
        var fd = new FormData();
        fd.append('file', blob, 'audio.' + ext);
        fd.append('model', GROQ_STT_MODEL);
        fd.append('language', 'ar');
        fd.append('response_format', 'verbose_json');
        fd.append('temperature', '0');

        var stt = await groqFetch(GROQ_STT_URL, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + apiKey }, // بدون Content-Type: المتصفح يضبطه مع FormData
          body: fd
        }, runCtrl, GROQ_STT_TIMEOUT_MS);

        var transcript = str(stt && stt.text);
        if (!transcript) throw fail('لم يتمكن Groq من استخراج نص من الصوت (قد يكون صامتاً).');
        guard(runCtrl);

        // التوجيه الذكي: المدة من Whisper، ثم مدة التسجيل، ثم طول النص كبديل أخير
        var seconds = Number(stt && stt.duration);
        if (!(seconds > 0)) seconds = Number(data.seconds);
        var model = pickSummaryModel(seconds > 0 ? seconds : 0, transcript);

        clearStageTimer();
        setStage(2);

        // الخطوة ب: تلخيص النص إلى JSON
        var styleHint = STYLE_HINTS[styleSelect.value] || '';
        var chat = await groqFetch(GROQ_CHAT_URL, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: GROQ_SYSTEM_PROMPT + '\n' + styleHint },
              { role: 'user', content: 'النص المفرَّغ:\n' + transcript }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        }, runCtrl, GROQ_SUMMARY_TIMEOUT_MS);

        var content = chat && chat.choices && chat.choices[0] && chat.choices[0].message && chat.choices[0].message.content;
        if (!content) throw fail('لم يُرجع Groq أي نتيجة. حاول مرة أخرى.');

        var parsed;
        try {
          parsed = parseModelJson(String(content));
        } catch (e) {
          throw fail('تعذّر قراءة رد Groq. حاول مرة أخرى.', e && e.message);
        }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw fail('رد Groq غير مفهوم. حاول مرة أخرى.');
        }
        parsed.full_transcript = transcript;
        return normalizeResult(parsed);
      }

      // نجاح أي طبقة: حفظ النتيجة في السجل وعرضها
      async function completeSuccess(result, myAbort) {
        setStage(3);
        await delay(500, myAbort);

        finishProcessing();

        var item = addToHistory(result);
        openItem(item.id);
        showToast('تم التلخيص بنجاح');
      }

      // تجهيز الصوت لـ Gemini (تحويل WAV عند الحاجة ثم base64). يتم مرة واحدة فقط ويُحفظ للمحاولات التالية
      async function prepareGeminiPayload(data, ctrl) {
        if (data.base64) return;
        var sendBlob = data.blob;
        var sendMime = data.mime;
        if (needsConversion(data.mime)) {
          sendBlob = await convertToWav(data.blob);
          sendMime = 'audio/wav';
          guard(ctrl);
        }
        var b64 = await blobToBase64(sendBlob);
        guard(ctrl);
        data.gmime = sendMime;
        data.base64 = b64;
      }

      // الدرع الخماسي. شاشة التحميل تبقى مفتوحة بين الطبقات، والخطأ النهائي لا يظهر إلا بعد فشلها كلها:
      //   1) Groq Whisper (تفريغ)   2) Llama 3.1 8b للنص القصير  3) Llama 3.3 70b للنص الطويل
      //   4) Gemini 3.8 Flash        5) Gemini 3.5 Flash-Lite
      async function runRequest(myAbort) {
        var geminiKey = getKey();
        var groqKey = getGroqKey();
        var data = payload;
        var lastErr = null;
        var layersTried = 0;
        var groqTried = false;

        // الطبقات 1 إلى 3: Groq (Whisper ثم Llama حسب الطول)
        if (groqKey) {
          layersTried++;
          groqTried = true;
          setStage(1);
          clearStageTimer();
          stageTimer = setTimeout(function () {
            if (loadingMode === 'busy' && currentStage === 1) setStage(2);
          }, STEP_SWITCH_MS);
          try {
            var groqResult = await summarizeWithGroq(data, groqKey, myAbort);
            if (myAbort.signal.aborted) return;
            await completeSuccess(groqResult, myAbort);
            return;
          } catch (err) {
            if (myAbort.signal.aborted) return;
            console.error('Groq layer failed:', err);
            lastErr = err; // أي فشل (429 أو 503 أو مهلة أو غيرها): انتقال صامت إلى Gemini
          }
          clearStageTimer();
          if (geminiKey) loadingText.textContent = FALLBACK_TEXT;
        }

        // الطبقتان 4 و 5: Gemini 3.8 ثم 3.5 Flash-Lite
        if (geminiKey) {
          var prepared = true;
          if (!data.base64) {
            if (!groqTried) setStage(0); // أول رسالة: «سيزار يفك شيفرة حديثك...»
            try {
              await prepareGeminiPayload(data, myAbort);
            } catch (err) {
              if (myAbort.signal.aborted) return;
              console.error('Audio preparation failed:', err);
              layersTried++;
              if (!groqTried) lastErr = err; // مع وجود Groq نُبقي خطأه لأنه الأكثر فائدة
              prepared = false;
            }
          }

          for (var m = 0; prepared && m < MODELS.length; m++) {
            var isFallback = groqTried || m > 0;
            var netRetried = false;
            var busyRetried = false;
            var attemptTimeout = ATTEMPT_TIMEOUT_MS;
            var moveOn = false;
            layersTried++;

            while (!moveOn) {
              try {
                var result = await attemptGemini(geminiKey, data, myAbort, MODELS[m], isFallback, attemptTimeout);
                if (myAbort.signal.aborted) return;
                await completeSuccess(result, myAbort);
                return;
              } catch (err) {
                if (myAbort.signal.aborted) return;
                console.error('Model ' + MODELS[m] + ' failed:', err);
                lastErr = err;

                if (m === 0 && err && err.status === 503 && !busyRetried) {
                  // 503 (مزدحم) من Gemini 3.8: ثانيتان ثم محاولة أخيرة قصيرة
                  busyRetried = true;
                  attemptTimeout = BUSY_RETRY_TIMEOUT_MS;
                  try {
                    await delay(BUSY_RETRY_DELAY_MS, myAbort);
                  } catch (e2) {
                    return;
                  }
                } else if (err && err.retryable && !err.fallback && !netRetried) {
                  // انقطاع شبكة: إعادة محاولة واحدة لنفس النموذج
                  netRetried = true;
                  loadingText.textContent = 'حدث خطأ في الاتصال، جاري إعادة المحاولة...';
                  try {
                    await waitForOnline(myAbort, 15000);
                    await delay(2000, myAbort);
                  } catch (e2) {
                    return;
                  }
                } else {
                  moveOn = true; // أي فشل آخر: ننتقل للطبقة التالية بصمت
                }
              }
            }

            if (m < MODELS.length - 1) loadingText.textContent = FALLBACK_TEXT;
          }
        }

        if (!lastErr) {
          finishProcessing();
          showToast('يرجى إدخال مفتاح Groq أو Gemini أولاً: افتح الإعدادات (زر الترس)');
          return;
        }

        // فشلت كل الطبقات: خطأ نهائي واحد فقط يُعرض (مع زر إعادة المحاولة)
        if (layersTried === 1 && !lastErr.retryable && !lastErr.fallback) {
          finishProcessing(); // خطأ حاسم من طبقة وحيدة (مفتاح خاطئ، صوت تالف...): رسالة عابرة كما سبق
          showToast(describeError(lastErr), ERROR_TOAST_MS);
          return;
        }
        showErrorView(lastErr.message || 'حدث خطأ غير متوقع.', lastErr.detail);
      }

      async function summarize(blob, mime, seconds) {
        if (isProcessing) return;

        if (!getKey() && !getGroqKey()) {
          showToast('يرجى إدخال مفتاح Groq أو Gemini أولاً: افتح الإعدادات (زر الترس)');
          return;
        }
        if (!blob || !blob.size) { showToast('لا يوجد صوت لتلخيصه'); return; }
        if (blob.size > MAX_SIZE) { showToast(FILE_TOO_BIG_TEXT, 8000); return; }
        if (navigator.onLine === false) { showToast('لا يوجد اتصال بالإنترنت. تحقق من اتصالك ثم حاول مجدداً.'); return; }

        isProcessing = true;
        var myAbort = new AbortController();
        runAbort = myAbort;
        openLoading();

        // الصوت الأصلي يذهب مباشرة إلى Groq. التحويل إلى WAV يتم لاحقاً وفقط إن احتجنا Gemini
        payload = { blob: blob, mime: mime, seconds: seconds || 0, base64: null, gmime: null };

        try {
          await runRequest(myAbort);
        } catch (err) {
          if (myAbort.signal.aborted) return;
          console.error('runRequest crashed:', err);
          showErrorView('حدث خطأ غير متوقع.', (err && err.message) || '');
        }
      }

      cancelLoadingBtn.addEventListener('click', function () {
        if (loadingMode === 'busy') {
          if (runAbort) runAbort.abort();
          finishProcessing();
          showToast('تم إلغاء العملية');
        } else {
          finishProcessing();
        }
      });

      retryBtn.addEventListener('click', function () {
        if (!isProcessing || !payload) return;
        var myAbort = new AbortController();
        runAbort = myAbort;
        showBusyView();
        setStage(1);
        startElapsed();
        acquireWakeLock();
        cancelLoadingBtn.focus();
        runRequest(myAbort);
      });

      summarizeRecordBtn.addEventListener('click', function () {
        if (!recordedBlob) { showToast('لا يوجد تسجيل لتلخيصه'); return; }
        summarize(recordedBlob, baseMime(recordedBlob.type), recordedSeconds);
      });

      summarizeFileBtn.addEventListener('click', function () {
        if (!selectedFile) { showToast('اختر ملفاً أولاً'); return; }
        summarize(selectedFile, EXT_MIME[getExt(selectedFile.name)] || baseMime(selectedFile.type), 0);
      });

      /* ====== أدوات بناء العناصر (textContent فقط) ====== */
      function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
      }

      var CARD = 'rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-5';
      var CARD_TITLE = 'flex items-center gap-2 font-bold text-lg mb-3';
      var ICON_CLASS = 'text-brand dark:text-brand-400';

      function cardTitle(iconClass, text) {
        var h = el('h3', CARD_TITLE);
        h.appendChild(el('i', 'fa-solid ' + iconClass + ' ' + ICON_CLASS));
        h.appendChild(el('span', '', text));
        return h;
      }

      function emptyNote(text) {
        return el('p', 'text-sm text-slate-400 dark:text-slate-500', text);
      }

      /* ====== السجل المحلي (History) ====== */
      var HISTORY_KEY = 'summaries_history';
      var MAX_HISTORY = 100;
      var MAX_CHAT_MESSAGES = 100;
      var DEFAULT_TITLE = 'خلاصة بدون عنوان';

      var historyItems = [];
      var currentId = null;
      var saveTimer = null;
      var lastSaveFailed = false;

      function genId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      }

      function sanitizeTask(t) {
        if (!t || typeof t !== 'object') return null;
        var text = str(t.task);
        if (!text) return null;
        return {
          id: str(t.id) || genId(),
          task: text,
          assignee: str(t.assignee),
          deadline: str(t.deadline),
          done: t.done === true
        };
      }

      function sanitizeChat(arr) {
        if (!Array.isArray(arr)) return [];
        return arr.map(function (m) {
          if (!m || typeof m !== 'object') return null;
          var role = m.role === 'user' ? 'user' : (m.role === 'ai' ? 'ai' : null);
          var text = str(m.text);
          if (!role || !text) return null;
          return { role: role, text: text, ts: Number(m.ts) || 0 };
        }).filter(Boolean).slice(-MAX_CHAT_MESSAGES);
      }

      function sanitizeItem(raw) {
        if (!raw || typeof raw !== 'object') return null;
        if (raw.id === undefined || raw.id === null) return null;
        return {
          id: raw.id,
          date: typeof raw.date === 'string' && raw.date ? raw.date : new Date(Number(raw.id) || Date.now()).toISOString(),
          title: str(raw.title) || DEFAULT_TITLE,
          executive_summary: str(raw.executive_summary),
          key_points: Array.isArray(raw.key_points) ? raw.key_points.map(str).filter(Boolean) : [],
          action_items: (Array.isArray(raw.action_items) ? raw.action_items : []).map(sanitizeTask).filter(Boolean),
          full_transcript: str(raw.full_transcript),
          chat: sanitizeChat(raw.chat)
        };
      }

      function loadHistory() {
        try {
          var raw = localStorage.getItem(HISTORY_KEY);
          if (!raw) return [];
          var arr = JSON.parse(raw);
          if (!Array.isArray(arr)) return [];
          return arr.map(sanitizeItem).filter(Boolean);
        } catch (e) {
          console.warn('تعذّر قراءة السجل:', e);
          return [];
        }
      }

      function saveHistory() {
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(historyItems));
          lastSaveFailed = false;
          return true;
        } catch (e) {
          console.warn('تعذّر حفظ السجل:', e);
          if (!lastSaveFailed) {
            showToast('تعذّر حفظ السجل (مساحة التخزين ممتلئة أو معطّلة). احذف بعض الخلاصات القديمة.', ERROR_TOAST_MS);
          }
          lastSaveFailed = true;
          return false;
        }
      }

      // حفظ مؤجّل قصير (للعنوان أثناء الكتابة)
      function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          saveTimer = null;
          saveHistory();
          renderHistory();
        }, 300);
      }

      function flushSave() {
        if (saveTimer) {
          clearTimeout(saveTimer);
          saveTimer = null;
          saveHistory();
          renderHistory();
        }
      }

      function findIndex(id) {
        for (var i = 0; i < historyItems.length; i++) {
          if (String(historyItems[i].id) === String(id)) return i;
        }
        return -1;
      }

      function findItem(id) {
        var i = findIndex(id);
        return i === -1 ? null : historyItems[i];
      }

      function getCurrent() {
        return currentId === null ? null : findItem(currentId);
      }

      function addToHistory(result) {
        var id = Date.now();
        while (findIndex(id) !== -1) id++;

        var item = {
          id: id,
          date: new Date().toISOString(),
          title: result.title,
          executive_summary: result.executive_summary,
          key_points: result.key_points.slice(),
          action_items: result.action_items.map(function (t) {
            return { id: genId(), task: t.task, assignee: t.assignee, deadline: t.deadline, done: false };
          }),
          full_transcript: result.full_transcript,
          chat: []
        };

        historyItems.unshift(item);
        if (historyItems.length > MAX_HISTORY) historyItems.length = MAX_HISTORY;
        saveHistory();
        renderHistory();
        return item;
      }

      function formatDate(iso) {
        try {
          var d = new Date(iso);
          if (isNaN(d.getTime())) return '';
          return d.toLocaleString('ar-DZ', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
        } catch (e) {
          return '';
        }
      }

      // تطبيع بسيط للبحث بالعربية (إزالة التشكيل وتوحيد الألف والياء والتاء المربوطة)
      function normSearch(s) {
        return String(s).toLowerCase()
          .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
          .replace(/[أإآ]/g, 'ا')
          .replace(/ى/g, 'ي')
          .replace(/ة/g, 'ه');
      }

      function renderHistory() {
        var q = normSearch(historySearch.value.trim());
        var list = historyItems.filter(function (h) {
          return !q || normSearch(h.title).indexOf(q) !== -1;
        });

        historyList.replaceChildren();

        if (!historyItems.length || !list.length) {
          var empty = el('div', 'h-full min-h-[10rem] flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 gap-3');
          empty.appendChild(el('i', (historyItems.length ? 'fa-solid fa-magnifying-glass' : 'fa-regular fa-folder-open') + ' text-4xl'));
          empty.appendChild(el('p', 'text-sm', historyItems.length ? 'لا توجد نتائج مطابقة' : 'لا توجد خلاصات بعد'));
          historyList.appendChild(empty);
          return;
        }

        var ul = el('ul', 'space-y-1');
        list.forEach(function (h) {
          var active = currentId !== null && String(currentId) === String(h.id);
          var li = el('li', 'flex items-stretch gap-1 rounded-xl border transition-colors ' +
            (active
              ? 'bg-brand-50 border-brand/40 dark:bg-slate-700 dark:border-brand-400/40'
              : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/60'));

          var openBtn = el('button', 'flex-1 min-w-0 text-right px-3 py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand');
          openBtn.type = 'button';
          openBtn.setAttribute('data-action', 'open');
          openBtn.setAttribute('data-id', String(h.id));

          var title = el('span', 'block font-semibold text-sm truncate', h.title);
          title.setAttribute('dir', 'auto');
          openBtn.appendChild(title);
          openBtn.appendChild(el('span', 'block text-xs text-slate-400 dark:text-slate-500 mt-0.5', formatDate(h.date)));

          var delBtn = el('button', 'w-9 shrink-0 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400');
          delBtn.type = 'button';
          delBtn.setAttribute('data-action', 'delete');
          delBtn.setAttribute('data-id', String(h.id));
          delBtn.setAttribute('aria-label', 'حذف الخلاصة');
          delBtn.appendChild(el('i', 'fa-regular fa-trash-can text-sm'));

          li.appendChild(openBtn);
          li.appendChild(delBtn);
          ul.appendChild(li);
        });
        historyList.appendChild(ul);
      }

      function deleteHistoryItem(id) {
        var idx = findIndex(id);
        if (idx === -1) return;
        if (!window.confirm('هل تريد حذف هذه الخلاصة نهائياً من السجل؟')) return;

        flushSave();
        historyItems.splice(idx, 1);
        saveHistory();

        if (currentId !== null && String(currentId) === String(id)) {
          cancelChat();
          currentId = null;
          selectTab('summary');
          workspaceView.classList.add('hidden');
          homeView.classList.remove('hidden');
          navReconcile();
        }
        renderHistory();
        showToast('تم حذف الخلاصة');
      }

      historyList.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var id = btn.getAttribute('data-id');
        if (btn.getAttribute('data-action') === 'open') {
          openItem(id);
          closeSidebar();
        } else if (btn.getAttribute('data-action') === 'delete') {
          deleteHistoryItem(id);
        }
      });

      historySearch.addEventListener('input', renderHistory);

      /* ====== مساحة العمل (Workspace) ====== */
      var TAB_ACTIVE = ['bg-caesar', 'text-white', 'shadow'];
      var TAB_IDLE = ['text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-700'];

      function selectTab(name) {
        tabBtns.forEach(function (btn) {
          var active = btn.getAttribute('data-tab') === name;
          TAB_ACTIVE.forEach(function (c) { btn.classList.toggle(c, active); });
          TAB_IDLE.forEach(function (c) { btn.classList.toggle(c, !active); });
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          p.classList.toggle('hidden', p.getAttribute('data-panel') !== name);
        });
        if (name === 'chat') {
          // الشات يأخذ الشاشة كاملة (التبويبات العلوية تختفي خلفه)
          document.body.classList.add('overflow-hidden');
          syncChatViewport();
          autoResizeChatInput();
          scrollChatToBottom();
        } else {
          resetChatViewport();
          if (!isSidebarOpen() && !isModalOpen() && !isForgeOpen()) document.body.classList.remove('overflow-hidden');
        }
      }

      // مع لوحة المفاتيح على الهاتف: الشات يتبع ارتفاع الشاشة المرئي كي يبقى شريط الإدخال ظاهراً
      function syncChatViewport() {
        var vv = window.visualViewport;
        if (!vv || panelChat.classList.contains('hidden')) return;
        panelChat.style.top = vv.offsetTop + 'px';
        panelChat.style.bottom = 'auto';
        panelChat.style.height = vv.height + 'px';
      }

      function resetChatViewport() {
        panelChat.style.top = '';
        panelChat.style.bottom = '';
        panelChat.style.height = '';
      }

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', function () {
          if (panelChat.classList.contains('hidden')) return;
          syncChatViewport();
          scrollChatToBottom();
        });
        window.visualViewport.addEventListener('scroll', syncChatViewport);
      }

      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectTab(btn.getAttribute('data-tab'));
          navReconcile();
        });
      });

      function renderSummary(item) {
        panelSummary.replaceChildren();

        var c1 = el('div', CARD);
        c1.appendChild(cardTitle('fa-bolt', 'الخلاصة التنفيذية'));
        if (item.executive_summary) {
          var p = el('p', 'leading-loose whitespace-pre-line', item.executive_summary);
          p.setAttribute('dir', 'auto');
          c1.appendChild(p);
        } else {
          c1.appendChild(emptyNote('لا توجد خلاصة'));
        }
        panelSummary.appendChild(c1);

        var c2 = el('div', CARD);
        c2.appendChild(cardTitle('fa-list-ul', 'النقاط الرئيسية'));
        if (item.key_points.length) {
          var ul = el('ul', 'list-disc ps-5 space-y-2 leading-relaxed marker:text-brand');
          item.key_points.forEach(function (pt) {
            var li = el('li', '', pt);
            li.setAttribute('dir', 'auto');
            ul.appendChild(li);
          });
          c2.appendChild(ul);
        } else {
          c2.appendChild(emptyNote('لا توجد نقاط رئيسية'));
        }
        panelSummary.appendChild(c2);

        // مسبك الأفكار: تحويل الخلاصة إلى منشور لمنصة اجتماعية
        var forgeBtn = el('button', 'forge-card w-full flex items-center gap-3 text-start rounded-3xl p-4 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400');
        forgeBtn.type = 'button';
        forgeBtn.id = 'forgeOpenBtn';
        var ficon = el('span', 'w-12 h-12 shrink-0 rounded-2xl bg-caesar glow-caesar text-white flex items-center justify-center');
        ficon.appendChild(el('i', 'fa-solid fa-fire-flame-curved text-xl'));
        var ftext = el('span', 'flex-1 min-w-0 leading-snug');
        ftext.appendChild(el('span', 'block font-extrabold text-lg', 'مسبك الأفكار'));
        ftext.appendChild(el('span', 'block text-sm text-slate-500 dark:text-slate-400', 'حوّلها إلى منشور جاهز لمنصتك المفضلة: LinkedIn أو X أو Instagram'));
        forgeBtn.appendChild(ficon);
        forgeBtn.appendChild(ftext);
        forgeBtn.appendChild(el('i', 'fa-solid fa-chevron-left text-slate-400'));
        forgeBtn.addEventListener('click', openForge);
        panelSummary.appendChild(forgeBtn);
      }

      function renderTranscript(item) {
        panelTranscript.replaceChildren();

        var card = el('div', CARD);
        card.appendChild(cardTitle('fa-file-lines', 'التفريغ الصوتي'));
        if (item.full_transcript) {
          var p = el('p', 'leading-loose whitespace-pre-wrap text-slate-700 dark:text-slate-200', item.full_transcript);
          p.setAttribute('dir', 'auto');
          card.appendChild(p);
        } else {
          card.appendChild(emptyNote('لا يوجد نص مُفرَّغ'));
        }
        panelTranscript.appendChild(card);
      }

      /* ====== المهام التفاعلية ====== */
      function knownValue(v) {
        var s = str(v);
        return (s && s !== 'غير محدد') ? s : '';
      }

      function updateTaskCounter() {
        var item = getCurrent();
        var total = item ? item.action_items.length : 0;
        if (!total) {
          taskCounter.classList.add('hidden');
          return;
        }
        var done = item.action_items.filter(function (t) { return t.done; }).length;
        taskCounter.textContent = done + ' من ' + total + ' مهام مكتملة';
        taskCounter.classList.remove('hidden');
      }

      function buildTaskRow(t) {
        var card = el('div', 'flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-4 transition-opacity');

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'task-' + t.id;
        cb.checked = !!t.done;
        cb.className = 'mt-1 w-5 h-5 shrink-0 accent-brand cursor-pointer';
        cb.setAttribute('aria-label', 'تحديد المهمة كمكتملة');

        var body = el('label', 'flex-1 min-w-0 cursor-pointer space-y-1.5');
        body.setAttribute('for', cb.id);

        var text = el('p', 'font-bold leading-relaxed break-words', t.task);
        text.setAttribute('dir', 'auto');
        body.appendChild(text);

        var who = knownValue(t.assignee);
        var when = knownValue(t.deadline);
        if (who || when) {
          var meta = el('div', 'flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400');
          if (who) {
            var w = el('span', 'flex items-center gap-1.5');
            w.appendChild(el('i', 'fa-regular fa-user text-xs'));
            w.appendChild(el('span', '', who));
            meta.appendChild(w);
          }
          if (when) {
            var d = el('span', 'flex items-center gap-1.5');
            d.appendChild(el('i', 'fa-regular fa-calendar text-xs'));
            d.appendChild(el('span', '', when));
            meta.appendChild(d);
          }
          body.appendChild(meta);
        }

        var del = el('button', 'w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400');
        del.type = 'button';
        del.setAttribute('aria-label', 'حذف المهمة');
        del.appendChild(el('i', 'fa-regular fa-trash-can text-sm'));

        function applyDone() {
          card.classList.toggle('opacity-60', cb.checked);
          text.classList.toggle('line-through', cb.checked);
        }
        applyDone();

        cb.addEventListener('change', function () {
          t.done = cb.checked;
          applyDone();
          saveHistory();
          updateTaskCounter();
        });

        del.addEventListener('click', function () { deleteTask(t.id); });

        card.appendChild(cb);
        card.appendChild(body);
        card.appendChild(del);
        return card;
      }

      function renderTasks(item) {
        tasksList.replaceChildren();

        if (!item.action_items.length) {
          var empty = el('div', CARD + ' text-center');
          empty.appendChild(emptyNote('لا توجد مهام. أضف مهمة جديدة من الحقل أدناه.'));
          tasksList.appendChild(empty);
        } else {
          item.action_items.forEach(function (t) { tasksList.appendChild(buildTaskRow(t)); });
        }
        updateTaskCounter();
      }

      function deleteTask(id) {
        var item = getCurrent();
        if (!item) return;
        item.action_items = item.action_items.filter(function (t) { return t.id !== id; });
        saveHistory();
        renderTasks(item);
      }

      taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var item = getCurrent();
        if (!item) return;

        var value = taskInput.value.trim();
        if (!value) { showToast('اكتب نص المهمة أولاً'); return; }

        item.action_items.push({ id: genId(), task: value, assignee: '', deadline: '', done: false });
        saveHistory();
        taskInput.value = '';
        renderTasks(item);
        taskInput.focus();
      });

      /* ====== الشات مع سيزار ====== */
      var WELCOME_MESSAGE = 'أهلاً، أنا سيزار. اسألني أي شيء عن هذا التسجيل وسأجيبك فوراً.';
      var CHAT_GEMINI_TIMEOUT_MS = 20000;       // مهلة كل نموذج Gemini في الشات
      var CHAT_BUSY_RETRY_TIMEOUT_MS = 12000;   // المحاولة القصيرة بعد 503
      var CHAT_GROQ_TIMEOUT_MS = 20000;         // مهلة كل نموذج Groq في الشات
      var CHAT_SEARCH_TEXT = 'جاري البحث في النص...';
      // السؤال الأول فقط: يُرسل التفريغ (أول 4000 حرف كحد أقصى) ليفهم سيزار المحاضرة
      // أسئلة المتابعة: لا يُرسل التفريغ أبداً، فقط آخر 4 رسائل من المحادثة السابقة
      var CHAT_FIRST_TRANSCRIPT_CHARS = 4000;
      var CHAT_CONTEXT_MESSAGES = 4;
      // true: تُرفق في المتابعة خلاصة قصيرة (الخلاصة والنقاط والمهام فقط، بلا تفريغ) لتثبيت المرجع.
      // false: المتابعة تعتمد على آخر 4 رسائل فقط.
      var CHAT_FOLLOWUP_GROUNDING = true;
      // الشات يستخدم نفس التوجيه الذكي: Groq أولاً (8b للتسجيل القصير، 70b للطويل) ثم Gemini 3.8 ثم 3.5 Lite
      function pickChatModel(item) {
        var t = (item && item.full_transcript) || '';
        return t.length < SHORT_TRANSCRIPT_CHARS ? GROQ_FAST_MODEL : GROQ_QUALITY_MODEL;
      }
      var CHAT_SUGGESTIONS = ['ما أهم فكرة في التسجيل؟', 'ما القرارات المتفق عليها؟', 'لخّص التسجيل في جملتين'];

      var chatBusy = false;
      var chatAbort = null;

      var BUBBLE_BASE = 'min-w-0 px-3.5 pt-2 pb-1.5 text-[15px] leading-relaxed break-words';
      var BUBBLE_USER = 'max-w-[85%] md:max-w-[34rem] bubble-user rounded-2xl rounded-br-md';
      var BUBBLE_AI = 'max-w-[85%] md:max-w-[36rem] bubble-ai rounded-2xl rounded-bl-md';

      function scrollChatToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      // وقت الرسالة (مثل 14:05) بالأرقام اللاتينية
      function formatClock(ts) {
        try {
          var d = new Date(ts || Date.now());
          if (isNaN(d.getTime())) return '';
          return pad(d.getHours()) + ':' + pad(d.getMinutes());
        } catch (e) {
          return '';
        }
      }

      // رسالة المستخدم على اليمين بتدرج برتقالي، ورد سيزار على اليسار برمادي داكن، والوقت أسفل كل فقاعة
      function buildBubble(role, text, ts) {
        var isUser = role === 'user';
        var row = el('div', 'flex ' + (isUser ? 'justify-start' : 'justify-end'));
        var bubble = el('div', BUBBLE_BASE + ' ' + (isUser ? BUBBLE_USER : BUBBLE_AI));

        var body = el('div', 'whitespace-pre-wrap break-words', text); // textContent: آمن
        body.setAttribute('dir', 'auto');
        bubble.appendChild(body);

        var time = el('div', 'mt-1 text-[11px] leading-none tabular-nums text-end ' + (isUser ? 'text-white/75' : 'text-slate-400'), formatClock(ts));
        time.setAttribute('data-time', '');
        bubble.appendChild(time);

        row.appendChild(bubble);
        return row;
      }

      // مؤشر الكتابة: فقاعة رمادية فيها ثلاث نقاط تنبض مع رسالة صغيرة
      function buildTyping() {
        var row = el('div', 'flex justify-end');
        var bubble = el('div', 'bubble-ai rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-3');
        bubble.setAttribute('role', 'status');
        bubble.setAttribute('aria-label', 'جاري البحث في النص');

        var dots = el('span', 'flex items-center gap-1.5');
        [0, 160, 320].forEach(function (ms) {
          var dot = el('span', 'typing-dot');
          dot.style.animationDelay = ms + 'ms';
          dots.appendChild(dot);
        });
        bubble.appendChild(dots);

        var label = el('span', 'text-xs text-slate-300', CHAT_SEARCH_TEXT);
        label.setAttribute('data-typing-label', '');
        bubble.appendChild(label);

        row.appendChild(bubble);
        return row;
      }

      // فقاعة خطأ داخل الشات مع زر إعادة المحاولة
      function buildErrorBubble(err, question) {
        var row = el('div', 'flex justify-end');
        var box = el('div', 'max-w-[85%] min-w-0 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm border bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800/60 space-y-1.5');

        var head = el('p', 'font-semibold flex items-start gap-2 leading-relaxed');
        head.appendChild(el('i', 'fa-solid fa-circle-exclamation mt-1 shrink-0'));
        var msg = (err && err.userFacing) ? err.message : 'حدث خطأ غير متوقع.';
        head.appendChild(el('span', 'break-words', msg));
        box.appendChild(head);

        var detail = (err && err.detail) ? err.detail : (!(err && err.userFacing) && err && err.message ? err.message : '');
        if (detail) {
          var d = el('p', 'text-xs opacity-80 break-words', detail);
          d.setAttribute('dir', 'auto');
          box.appendChild(d);
        }

        var retry = el('button', 'inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400');
        retry.type = 'button';
        retry.appendChild(el('i', 'fa-solid fa-rotate-right'));
        retry.appendChild(el('span', '', 'إعادة المحاولة'));
        retry.addEventListener('click', function () {
          if (chatBusy) return;
          row.remove();
          sendChat(question, true);
        });
        box.appendChild(retry);

        row.appendChild(box);
        return row;
      }

      // اقتراحات أسئلة جاهزة (تظهر فقط قبل أول رسالة)
      function buildChips() {
        var wrap = el('div', 'flex flex-wrap justify-end gap-2');
        wrap.setAttribute('data-chips', '');
        CHAT_SUGGESTIONS.forEach(function (s) {
          var b = el('button', 'chip', s);
          b.type = 'button';
          b.addEventListener('click', function () {
            if (chatBusy) return;
            chatInput.value = s;
            handleChatSubmit();
          });
          wrap.appendChild(b);
        });
        return wrap;
      }

      function renderChat(item) {
        chatMessages.replaceChildren();
        chatMessages.appendChild(buildBubble('ai', WELCOME_MESSAGE, Date.now())); // الترحيب لا يُخزَّن
        item.chat.forEach(function (m) { chatMessages.appendChild(buildBubble(m.role, m.text, m.ts)); });
        if (!item.chat.length) chatMessages.appendChild(buildChips());
        scrollChatToBottom();
      }

      function updateChatUI() {
        chatSendBtn.disabled = chatBusy;
      }

      function autoResizeChatInput() {
        chatInput.style.height = 'auto';
        var h = chatInput.scrollHeight; // 0 إذا كان التبويب مخفياً: نترك الارتفاع الطبيعي
        chatInput.style.height = h > 0 ? Math.min(h, 128) + 'px' : '';
      }

      // إلغاء أي طلب شات معلّق (عند التنقل بين الخلاصات)
      function cancelChat() {
        if (chatAbort) {
          chatAbort.abort();
          chatAbort = null;
        }
        chatBusy = false;
        updateChatUI();
      }

      // الخلاصة والنقاط والمهام (قصيرة)، ومعها التفريغ عند الطلب (أول 4000 حرف كحد أقصى)
      function buildChatContext(item, withTranscript) {
        var parts = [];
        if (item.executive_summary) parts.push('الخلاصة: ' + item.executive_summary);
        if (item.key_points.length) parts.push('النقاط الرئيسية:\n- ' + item.key_points.join('\n- '));
        if (item.action_items.length) {
          parts.push('المهام: ' + item.action_items.slice(0, 15).map(function (t) { return t.task; }).join('، '));
        }
        if (withTranscript && item.full_transcript) {
          var t = item.full_transcript;
          if (t.length > CHAT_FIRST_TRANSCRIPT_CHARS) {
            parts.push('التفريغ الصوتي (الجزء الأول):\n' + t.slice(0, CHAT_FIRST_TRANSCRIPT_CHARS) + '…');
          } else {
            parts.push('التفريغ الصوتي الكامل:\n' + t);
          }
        }
        return parts.join('\n\n');
      }

      // طلب Gemini واحد للشات بمهلة خاصة بهذه الطبقة
      async function chatGeminiLayer(apiKey, body, model, chatCtrl, timeoutMs) {
        var ctrl = new AbortController();
        var timedOut = false;
        function onAbort() { ctrl.abort(); }
        chatCtrl.signal.addEventListener('abort', onAbort);
        var timeoutId = setTimeout(function () { timedOut = true; ctrl.abort(); }, timeoutMs);

        try {
          var data = await postGemini(apiKey, body, ctrl.signal, model);
          return readCandidate(data).text.trim();
        } catch (e) {
          if (e && e.name === 'AbortError' && timedOut && !chatCtrl.signal.aborted) {
            throw fail('انتهت مهلة الرد. الخوادم بطيئة.', 'timeout بعد ' + (timeoutMs / 1000) + ' ثانية (' + model + ')', true);
          }
          throw e;
        } finally {
          clearTimeout(timeoutId);
          chatCtrl.signal.removeEventListener('abort', onAbort);
        }
      }

      // طبقة Groq للشات (نص فقط، بدون وضع JSON)
      var CHAT_SYSTEM = 'أنت سيزار، مساعد ذكي يجيب عن أسئلة حول محاضرة أو اجتماع. أجب بالعربية بدقة واختصار وبنص عادي دون رموز Markdown.';

      async function chatWithGroq(apiKey, contents, chatCtrl, model, system, temperature) {
        var messages = [{
          role: 'system',
          content: system || CHAT_SYSTEM
        }];
        contents.forEach(function (c) {
          messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: c.parts[0].text });
        });

        var res = await groqFetch(GROQ_CHAT_URL, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model: model, messages: messages, temperature: temperature === undefined ? 0.3 : temperature })
        }, chatCtrl, CHAT_GROQ_TIMEOUT_MS);

        var text = res && res.choices && res.choices[0] && res.choices[0].message && res.choices[0].message.content;
        text = str(text);
        if (!text) throw fail('لم يُرجع Groq أي نص. حاول مرة أخرى.');
        return text;
      }

      // شلال النص (الشات ومسبك الأفكار): Groq أولاً ← Gemini 3.8 ← Gemini 3.5 Lite. أي فشل ينتقل للتالي بصمت
      async function textWaterfall(contents, ctrl, onStatus, groqModel, system, temperature) {
        var geminiKey = getKey();
        var groqKey = getGroqKey();
        if (!geminiKey && !groqKey) throw fail('يرجى إدخال مفتاح Groq أو Gemini أولاً: افتح الإعدادات (زر الترس).');
        if (navigator.onLine === false) {
          throw fail('لا يوجد اتصال بالإنترنت. تحقق من اتصالك ثم أعد المحاولة.', '', true);
        }

        var lastErr = null;

        // الطبقة الأولى: Groq
        if (groqKey) {
          try {
            return await chatWithGroq(groqKey, contents, ctrl, groqModel, system, temperature);
          } catch (err) {
            if (ctrl.signal.aborted || (err && err.name === 'AbortError')) throw err;
            console.error('Text Groq model ' + groqModel + ' failed:', err);
            lastErr = err; // أي فشل: انتقال صامت إلى Gemini
          }
        }

        // الطبقة الثانية: Gemini
        if (geminiKey) {
          if (groqKey && onStatus) onStatus(FALLBACK_TEXT);
          var body = { contents: contents, generationConfig: { temperature: temperature === undefined ? 0.3 : temperature } };

          for (var m = 0; m < MODELS.length; m++) {
            var busyRetried = false;
            var timeoutMs = CHAT_GEMINI_TIMEOUT_MS;
            var moveOn = false;

            while (!moveOn) {
              try {
                return await chatGeminiLayer(geminiKey, body, MODELS[m], ctrl, timeoutMs);
              } catch (err) {
                if (ctrl.signal.aborted || (err && err.name === 'AbortError')) throw err;
                console.error('Text model ' + MODELS[m] + ' failed:', err);
                lastErr = err;

                if (m === 0 && err && err.status === 503 && !busyRetried) {
                  // مزدحم: ننتظر ثانيتين ثم محاولة أخيرة قصيرة مع نفس النموذج
                  busyRetried = true;
                  timeoutMs = CHAT_BUSY_RETRY_TIMEOUT_MS;
                  await delay(BUSY_RETRY_DELAY_MS, ctrl);
                } else {
                  moveOn = true;
                }
              }
            }
          }
        }

        throw lastErr || fail('تعذّر الحصول على رد. حاول مرة أخرى.');
      }

      async function askAssistant(item, question, chatCtrl, onStatus) {
        var geminiKey = getKey();
        var groqKey = getGroqKey();
        if (!geminiKey && !groqKey) throw fail('يرجى إدخال مفتاح Groq أو Gemini أولاً: افتح الإعدادات (زر الترس).');

        // السؤال الأول (لا رسائل محفوظة): التفريغ كاملاً. المتابعة: آخر 4 رسائل فقط
        var isFirst = item.chat.length === 0;
        var context = isFirst
          ? buildChatContext(item, true)
          : (CHAT_FOLLOWUP_GROUNDING ? buildChatContext(item, false) : '');
        if (isFirst && !context) throw fail('لا يوجد نص لهذا التسجيل للإجابة عن أسئلتك.');

        if (navigator.onLine === false) {
          throw fail('لا يوجد اتصال بالإنترنت. تحقق من اتصالك ثم أعد المحاولة.', '', true);
        }

        var prompt;
        if (isFirst) {
          prompt =
            'بناءً على هذه المعلومات عن المحاضرة/الاجتماع (الخلاصة والنقاط الرئيسية والمهام والتفريغ الصوتي):\n' +
            context + '\n\n' +
            'أجب عن سؤال المستخدم التالي بدقة واختصار باللغة العربية: ' + question + '\n' +
            'إذا لم تتوفر الإجابة في المعلومات أعلاه فاذكر ذلك بوضوح. اكتب الإجابة بنص عادي دون رموز Markdown.';
        } else {
          prompt =
            (context ? 'تذكير بخلاصة المحاضرة/الاجتماع:\n' + context + '\n\n' : '') +
            'اعتمد أيضاً على سياق المحادثة السابقة. أجب عن سؤال المستخدم التالي بدقة واختصار باللغة العربية: ' + question + '\n' +
            'إذا لم تتوفر الإجابة فاذكر ذلك بوضوح. اكتب الإجابة بنص عادي دون رموز Markdown.';
        }

        // آخر التبادلات السابقة كسياق (بتناوب صحيح: مستخدم ثم نموذج)
        var contents = [];
        var lastRole = null;
        item.chat.slice(-CHAT_CONTEXT_MESSAGES).forEach(function (m) {
          var role = m.role === 'user' ? 'user' : 'model';
          if (contents.length === 0 && role !== 'user') return;
          if (role === lastRole) return;
          contents.push({ role: role, parts: [{ text: m.text }] });
          lastRole = role;
        });
        if (lastRole === 'user') contents.pop();

        contents.push({ role: 'user', parts: [{ text: prompt }] });

        return textWaterfall(contents, chatCtrl, onStatus, pickChatModel(item), null, 0.3);
      }

      async function sendChat(question, isRetry) {
        var item = getCurrent();
        if (!item || chatBusy) return;

        var itemId = item.id;
        chatBusy = true;
        updateChatUI();

        var chips = chatMessages.querySelector('[data-chips]');
        if (chips) chips.remove();

        var askedAt = Date.now();
        if (!isRetry) chatMessages.appendChild(buildBubble('user', question, askedAt));
        var typingRow = buildTyping();
        chatMessages.appendChild(typingRow);
        scrollChatToBottom();

        var typingLabel = typingRow.querySelector('[data-typing-label]');
        function onStatus(text) { if (typingLabel) typingLabel.textContent = text; }

        var ctrl = new AbortController();
        chatAbort = ctrl;

        try {
          var answer = await askAssistant(item, question, ctrl, onStatus);
          if (ctrl.signal.aborted) return; // أُلغي بسبب التنقل

          typingRow.remove();

          var live = findItem(itemId);
          if (!live) return;

          var answeredAt = Date.now();
          live.chat.push(
            { role: 'user', text: question, ts: askedAt },
            { role: 'ai', text: answer, ts: answeredAt }
          );
          if (live.chat.length > MAX_CHAT_MESSAGES) live.chat = live.chat.slice(-MAX_CHAT_MESSAGES);
          saveHistory();

          if (currentId !== null && String(currentId) === String(itemId)) {
            chatMessages.appendChild(buildBubble('ai', answer, answeredAt));
            scrollChatToBottom();
          }
        } catch (err) {
          typingRow.remove();

          if (err && err.name === 'AbortError') return; // إلغاء بسبب التنقل: بلا رسالة

          console.error('Chat error:', err);
          chatMessages.appendChild(buildErrorBubble(err, question));
          scrollChatToBottom();
        } finally {
          if (chatAbort === ctrl) {
            chatAbort = null;
            chatBusy = false;
            updateChatUI();
          }
        }
      }

      function handleChatSubmit() {
        var question = chatInput.value.trim();
        if (!question) return;
        if (!getCurrent()) return;
        if (chatBusy) { showToast('انتظر اكتمال الرد الحالي'); return; }

        chatInput.value = '';
        autoResizeChatInput();
        sendChat(question, false);
      }

      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleChatSubmit();
      });

      chatInput.addEventListener('keydown', function (e) {
        // Enter يرسل، و Shift+Enter يضيف سطراً جديداً
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.preventDefault();
          handleChatSubmit();
        }
      });

      chatInput.addEventListener('input', autoResizeChatInput);

      chatBackBtn.addEventListener('click', function () {
        selectTab('summary');
        navReconcile();
      });

      // أيقونة الميكروفون: للتصميم فقط حالياً
      chatMicBtn.addEventListener('click', function () {
        showToast('الإدخال الصوتي في الشات قريباً');
      });

      chatClearBtn.addEventListener('click', function () {
        var item = getCurrent();
        if (!item) return;
        if (!item.chat.length) { showToast('لا توجد محادثة لمسحها'); return; }
        if (!window.confirm('هل تريد مسح هذه المحادثة نهائياً؟')) return;

        cancelChat();
        item.chat = [];
        saveHistory();
        renderChat(item);
        showToast('تم مسح المحادثة');
      });

      /* ====== فتح عنصر من السجل / العنوان القابل للتعديل ====== */
      function openItem(id) {
        flushSave();
        var item = findItem(id);
        if (!item) return;

        cancelChat();

        currentId = item.id;
        titleInput.value = item.title; // value وليس innerHTML
        summaryDate.textContent = item.date ? 'تاريخ الإنشاء: ' + formatDate(item.date) : '';
        renderSummary(item);
        renderTasks(item);
        renderTranscript(item);
        chatInput.value = '';
        autoResizeChatInput();
        renderChat(item);
        selectTab('summary');

        homeView.classList.add('hidden');
        workspaceView.classList.remove('hidden');
        renderHistory();
        window.scrollTo(0, 0);
        navReconcile();
      }

      titleInput.addEventListener('input', function () {
        var item = getCurrent();
        if (!item) return;
        item.title = titleInput.value; // يُحدَّث في الذاكرة فوراً ويُكتب في localStorage بعد 300 مللي ثانية
        scheduleSave();
      });

      titleInput.addEventListener('blur', function () {
        var item = getCurrent();
        if (!item) return;
        var v = titleInput.value.trim() || DEFAULT_TITLE;
        titleInput.value = v;
        item.title = v;
        clearTimeout(saveTimer);
        saveTimer = null;
        saveHistory();
        renderHistory();
      });

      // العودة من مساحة العمل إلى الرئيسية (تُستخدم من الزر ومن زر الرجوع في الهاتف)
      function showHome() {
        flushSave();
        cancelChat();
        currentId = null;
        workspaceView.classList.add('hidden');
        homeView.classList.remove('hidden');
        renderHistory();
        window.scrollTo(0, 0);
      }

      backBtn.addEventListener('click', function () {
        showHome();
        navReconcile();
      });

      window.addEventListener('pagehide', flushSave);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') flushSave();
      });

      /* ====== التصدير: نسخ / Markdown / PDF ====== */
      function metaLine(t) {
        var parts = [];
        var who = knownValue(t.assignee);
        var when = knownValue(t.deadline);
        if (who) parts.push('المسؤول: ' + who);
        if (when) parts.push('الموعد: ' + when);
        return parts.join('، ');
      }

      // نص منسّق للواتساب (العناوين بين نجمتين = عريض)
      function buildShareText(item) {
        var L = [];
        L.push('*' + item.title + '*');

        if (item.executive_summary) {
          L.push('', '📝 *الخلاصة*', item.executive_summary);
        }
        if (item.key_points.length) {
          L.push('', '📌 *النقاط الرئيسية*');
          item.key_points.forEach(function (p) { L.push('• ' + p); });
        }
        if (item.action_items.length) {
          L.push('', '✅ *المهام*');
          item.action_items.forEach(function (t) {
            var m = metaLine(t);
            L.push((t.done ? '☑️ ' : '⬜ ') + t.task + (m ? ' (' + m + ')' : ''));
          });
        }
        L.push('', '✨ سيزار — خلاصة ذكية لصوتك');
        return L.join('\n');
      }

      function buildMarkdown(item) {
        var L = [];
        L.push('# ' + item.title, '');
        var date = formatDate(item.date);
        if (date) L.push('> تاريخ الإنشاء: ' + date, '');

        L.push('## الخلاصة التنفيذية', '', item.executive_summary || '_لا توجد خلاصة_', '');

        L.push('## النقاط الرئيسية', '');
        if (item.key_points.length) {
          item.key_points.forEach(function (p) { L.push('- ' + p); });
        } else {
          L.push('_لا توجد نقاط_');
        }
        L.push('');

        L.push('## المهام والقرارات', '');
        if (item.action_items.length) {
          item.action_items.forEach(function (t) {
            var m = metaLine(t);
            L.push('- [' + (t.done ? 'x' : ' ') + '] ' + t.task + (m ? ' — ' + m : ''));
          });
        } else {
          L.push('_لا توجد مهام_');
        }
        L.push('');

        L.push('## التفريغ الصوتي', '', item.full_transcript || '_لا يوجد نص_', '');
        L.push('---', '_أُعدّت هذه الخلاصة بواسطة سيزار (Caesar)_', '');
        return L.join('\n');
      }

      async function copyToClipboard(text) {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
          }
        } catch (e) { /* ننتقل للطريقة الاحتياطية */ }

        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          return ok;
        } catch (e) {
          return false;
        }
      }

      function safeFileName(title) {
        var name = String(title || '').replace(/[\\\/:*?"<>|\r\n\t]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 60);
        return name || 'خلاصة سيزار';
      }

      function downloadTextFile(filename, text, mime) {
        var blob = new Blob([text], { type: mime });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }

      function requireCurrent() {
        flushSave();
        var item = getCurrent();
        if (!item) showToast('لا توجد خلاصة مفتوحة');
        return item;
      }

      copyBtn.addEventListener('click', async function () {
        var item = requireCurrent();
        if (!item) return;
        var ok = await copyToClipboard(buildShareText(item));
        showToast(ok ? 'تم النسخ' : 'تعذّر النسخ. جرّب مرة أخرى.');
      });

      exportMdBtn.addEventListener('click', function () {
        var item = requireCurrent();
        if (!item) return;
        downloadTextFile(safeFileName(item.title) + '.md', buildMarkdown(item), 'text/markdown;charset=utf-8');
        showToast('تم تجهيز ملف Markdown');
      });

      // بناء منطقة الطباعة (العنوان، الملخص، النقاط، المهام، النص الكامل)
      function buildPrintArea(item) {
        printArea.replaceChildren();

        printArea.appendChild(el('h1', '', item.title));
        var date = formatDate(item.date);
        if (date) printArea.appendChild(el('p', 'print-date', 'تاريخ الإنشاء: ' + date));

        printArea.appendChild(el('h2', '', 'الخلاصة التنفيذية'));
        printArea.appendChild(el('p', '', item.executive_summary || 'لا توجد خلاصة'));

        printArea.appendChild(el('h2', '', 'النقاط الرئيسية'));
        if (item.key_points.length) {
          var ul = el('ul');
          item.key_points.forEach(function (pt) { ul.appendChild(el('li', '', pt)); });
          printArea.appendChild(ul);
        } else {
          printArea.appendChild(el('p', '', 'لا توجد نقاط'));
        }

        printArea.appendChild(el('h2', '', 'المهام والقرارات'));
        if (item.action_items.length) {
          item.action_items.forEach(function (t) {
            var row = el('div', 'print-task');
            row.appendChild(el('span', '', (t.done ? '☑ ' : '☐ ') + t.task));
            var m = metaLine(t);
            if (m) row.appendChild(el('div', 'print-meta', m));
            printArea.appendChild(row);
          });
        } else {
          printArea.appendChild(el('p', '', 'لا توجد مهام'));
        }

        printArea.appendChild(el('h2', '', 'التفريغ الصوتي'));
        printArea.appendChild(el('p', 'print-transcript', item.full_transcript || 'لا يوجد نص'));
        printArea.appendChild(el('p', 'print-date', 'أُعدّت بواسطة سيزار (Caesar)'));
      }

      exportPdfBtn.addEventListener('click', function () {
        var item = requireCurrent();
        if (!item) return;
        buildPrintArea(item);
        document.title = safeFileName(item.title); // اسم ملف PDF الافتراضي
        window.print();
      });

      window.addEventListener('afterprint', function () {
        document.title = BASE_TITLE;
        printArea.replaceChildren();
      });

      /* ====== أحداث الواجهة العامة ====== */
      menuBtn.addEventListener('click', openSidebar);
      closeSidebarBtn.addEventListener('click', closeSidebar);
      overlay.addEventListener('click', closeSidebar);

      themeBtn.addEventListener('click', toggleTheme);

      settingsBtn.addEventListener('click', openModal);
      closeModalBtn.addEventListener('click', closeModal);
      settingsModal.addEventListener('click', function (e) {
        if (e.target === settingsModal) closeModal();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || isLoading()) return;
        if (isForgeOpen()) closeForge();
        else if (isModalOpen()) closeModal();
        else if (isSidebarOpen()) closeSidebar();
        else if (uiDepth() === 2) { selectTab('summary'); navReconcile(); }
      });

      /* ====== مسبك الأفكار ====== */
      var FORGE_GUIDES = {
        linkedin: {
          label: 'LinkedIn',
          guide: 'منشور LinkedIn احترافي: سطر افتتاحي قوي يجذب الانتباه، ثم فقرات قصيرة (سطر أو سطران لكل فقرة) تعرض الفكرة والدروس أو الخطوات العملية، وينتهي بسؤال يفتح النقاش، ثم 3 إلى 5 وسوم مناسبة. لا يتجاوز 1300 حرف.',
          limit: 1300
        },
        x: {
          label: 'X',
          guide: 'تغريدة واحدة على منصة X لا تتجاوز 260 حرفاً (بما فيها الوسوم)، قوية ومباشرة وتحمل فكرة واحدة لافتة، مع وسم أو وسمين على الأكثر.',
          limit: 280
        },
        instagram: {
          label: 'Instagram',
          guide: 'تعليق (Caption) لإنستغرام: افتتاحية جذابة في السطر الأول، نبرة قريبة ودافئة، أسطر قصيرة، رموز تعبيرية مناسبة بشكل معتدل، دعوة للتفاعل في النهاية، ثم 8 إلى 12 وسماً. لا يتجاوز 2200 حرف.',
          limit: 2200
        }
      };
      var FORGE_SYSTEM = 'أنت كاتب محتوى محترف يصوغ منشورات لوسائل التواصل بدقة، ولا تخترع معلومات غير واردة في المادة المعطاة.';
      var forgeAbort = null;
      var forgePlatform = null;

      function isForgeOpen() { return !forgeModal.classList.contains('hidden'); }

      function resetForgeView() {
        forgePlatform = null;
        forgePickBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        hideEl(forgeResult, 'block');
        forgeOutput.classList.add('hidden');
        forgeOutput.textContent = '';
        hideEl(forgeActions, 'flex');
        forgeStatus.textContent = '';
      }

      function openForge() {
        if (!getCurrent()) return;
        resetForgeView();
        showEl(forgeModal, 'flex');
        document.body.classList.add('overflow-hidden');
        forgePickBtns[0].focus();
      }

      function closeForge() {
        if (forgeAbort) { forgeAbort.abort(); forgeAbort = null; }
        hideEl(forgeModal, 'flex');
        if (!isSidebarOpen() && !isModalOpen()) document.body.classList.remove('overflow-hidden');
      }

      function buildForgePrompt(item, platform) {
        var cfg = FORGE_GUIDES[platform];
        return 'مهمتك صياغة منشور جاهز للنشر اعتماداً على المعلومات التالية فقط، دون اختلاق أرقام أو أقوال أو وقائع غير واردة فيها.\n\n' +
          'العنوان: ' + item.title + '\n' + buildChatContext(item, false) + '\n\n' +
          'المطلوب: ' + cfg.guide + '\n' +
          'اكتب بنفس لغة الخلاصة. أعد نص المنشور فقط جاهزاً للنسخ، دون مقدمة أو شرح أو علامات Markdown أو علامات اقتباس.';
      }

      function updateForgeCount() {
        var cfg = FORGE_GUIDES[forgePlatform];
        var n = forgeOutput.textContent.length;
        forgeCount.textContent = n + ' / ' + cfg.limit + ' حرف';
        forgeCount.classList.toggle('text-red-500', n > cfg.limit);
        forgeCount.classList.toggle('text-slate-400', n <= cfg.limit);
      }

      async function runForge(platform) {
        var item = getCurrent();
        if (!item || !FORGE_GUIDES[platform]) return;
        if (!getKey() && !getGroqKey()) {
          showToast('يرجى إدخال مفتاح Groq أو Gemini أولاً: افتح الإعدادات (زر الترس)');
          return;
        }

        if (forgeAbort) forgeAbort.abort();
        var ctrl = new AbortController();
        forgeAbort = ctrl;
        forgePlatform = platform;

        forgePickBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-platform') === platform ? 'true' : 'false'); });
        showEl(forgeResult, 'block');
        forgeOutput.classList.add('hidden');
        hideEl(forgeActions, 'flex');
        forgeStatus.textContent = 'سيزار يصوغ منشورك...';

        try {
          // الكتابة تحتاج جودة: نموذج Groq الأقوى أولاً ثم Gemini
          var contents = [{ role: 'user', parts: [{ text: buildForgePrompt(item, platform) }] }];
          var text = await textWaterfall(contents, ctrl, function (t) { forgeStatus.textContent = t; }, GROQ_QUALITY_MODEL, FORGE_SYSTEM, 0.7);
          if (ctrl.signal.aborted) return;

          forgeOutput.textContent = text; // textContent: آمن
          forgeOutput.classList.remove('hidden');
          showEl(forgeActions, 'flex');
          forgeStatus.textContent = 'منشور ' + FORGE_GUIDES[platform].label + ' جاهز:';
          updateForgeCount();
        } catch (err) {
          if (ctrl.signal.aborted || (err && err.name === 'AbortError')) return;
          console.error('Forge error:', err);
          forgeStatus.textContent = (err && err.userFacing) ? err.message : 'حدث خطأ غير متوقع. حاول مرة أخرى.';
          forgeOutput.classList.add('hidden');
          showEl(forgeActions, 'flex');
          forgeCount.textContent = '';
        } finally {
          if (forgeAbort === ctrl) forgeAbort = null;
        }
      }

      forgePickBtns.forEach(function (b) {
        b.addEventListener('click', function () { runForge(b.getAttribute('data-platform')); });
      });
      forgeRetryBtn.addEventListener('click', function () { if (forgePlatform) runForge(forgePlatform); });
      forgeCopyBtn.addEventListener('click', async function () {
        var text = forgeOutput.textContent;
        if (!text) { showToast('لا يوجد نص لنسخه'); return; }
        var ok = await copyToClipboard(text);
        showToast(ok ? 'تم نسخ المنشور' : 'تعذّر النسخ. جرّب مرة أخرى.');
      });
      forgeCloseBtn.addEventListener('click', closeForge);
      forgeModal.addEventListener('click', function (e) { if (e.target === forgeModal) closeForge(); });

      /* ====== زر الرجوع في الهاتف (Hardware Back) ======
         الشات ← الخلاصة ← الرئيسية ← الخروج. كل مستوى أعمق يضيف مدخلاً في سجل المتصفح (History API) */
      var navDepth = 0;          // عمق المدخلات التي أضفناها: 0 الرئيسية، 1 الخلاصة، 2 الشات
      var navPending = false;    // history.go() قيد التنفيذ
      var navPendingTimer = null;

      function uiDepth() {
        if (workspaceView.classList.contains('hidden')) return 0;
        return panelChat.classList.contains('hidden') ? 1 : 2;
      }

      // يُزامن سجل المتصفح مع ما تعرضه الشاشة فعلاً
      function navReconcile() {
        if (navPending) return;
        var target = uiDepth();
        if (navDepth < target) {
          while (navDepth < target) {
            navDepth++;
            try { history.pushState({ caesar: 1, d: navDepth }, ''); } catch (e) {}
          }
        } else if (navDepth > target) {
          navPending = true;
          clearTimeout(navPendingTimer);
          navPendingTimer = setTimeout(function () { navPending = false; navDepth = uiDepth(); }, 800);
          try {
            history.go(target - navDepth);
          } catch (e) {
            navPending = false;
            navDepth = target;
          }
        }
      }

      // أي نافذة مفتوحة تُغلق أولاً قبل التنقل
      function closeTopOverlay() {
        if (isLoading()) { showToast('اضغط «إلغاء» لإيقاف المعالجة'); return true; }
        if (isForgeOpen()) { closeForge(); return true; }
        if (isModalOpen()) { closeModal(); return true; }
        if (isSidebarOpen()) { closeSidebar(); return true; }
        return false;
      }

      window.addEventListener('popstate', function (e) {
        var st = e.state;
        if (!st || !st.caesar) return;
        navPending = false;
        clearTimeout(navPendingTimer);
        navDepth = st.d;

        if (closeTopOverlay()) { navReconcile(); return; }

        if (st.d < 0 && uiDepth() === 0) {
          // الرئيسية: الضغطة التالية تخرج من التطبيق
          try { history.back(); } catch (err) {}
          return;
        }

        var target = Math.max(st.d, 0);
        if (uiDepth() === 2 && target < 2) selectTab('summary');
        if (uiDepth() === 1 && target < 1) showHome();
        navReconcile();
      });

      try {
        // مدخل أساسي (-1) ثم مدخل الرئيسية (0): الرجوع من الرئيسية يعود للمدخل الأساسي فنخرج
        history.replaceState({ caesar: 1, d: -1 }, '');
        history.pushState({ caesar: 1, d: 0 }, '');
      } catch (e) {}

      /* ====== التهيئة ====== */
      getKey(); getGroqKey(); // ترحيل أي مفتاح قديم محفوظ نصاً إلى الصيغة المرمَّزة
      syncThemeColor();
      updateKeyUI();
      updateChatUI();
      historyItems = loadHistory();
      renderHistory();

      /* ====== تسجيل Service Worker ====== */
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('./sw.js').catch(function (err) {
            console.warn('تعذّر تسجيل Service Worker:', err);
          });
        });
      }
    })();
window.__appBooted = true;
