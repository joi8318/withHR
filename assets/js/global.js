document.addEventListener("DOMContentLoaded", () => {
  // ---------------------lnb---------------------
  const menu = document.querySelector(".smenu");
  const allCloseBtn = menu.querySelector(".smenu-all-close");
  const allOpenBtn = menu.querySelector(".smenu-all-open");
  const depth2Items = menu.querySelectorAll(".depth2.has-child");

  function slideDown(element) {
    if (element.sliding) return;
    element.sliding = true;

    element.style.display = "block";
    const height = element.scrollHeight + "px";
    element.style.height = "0";

    requestAnimationFrame(() => {
      element.style.transition = "height 0.3s ease";
      element.style.height = height;
    });

    const onEnd = () => {
      element.style.height = "auto";
      element.style.transition = "";
      element.sliding = false;
      element.removeEventListener("transitionend", onEnd);
    };
    element.addEventListener("transitionend", onEnd);
  }

  function slideUp(element) {
    if (element.sliding) return;
    element.sliding = true;

    element.style.height = element.scrollHeight + "px";

    requestAnimationFrame(() => {
      element.style.transition = "height 0.3s ease";
      element.style.height = "0";
    });

    const onEnd = () => {
      element.style.display = "none";
      element.style.transition = "";
      element.sliding = false;
      element.removeEventListener("transitionend", onEnd);
    };
    element.addEventListener("transitionend", onEnd);
  }

  // 전체 접기
  allCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    depth2Items.forEach((item) => {
      if (!item.classList.contains("on")) return;
      item.classList.remove("on");
      const depth3 = item.nextElementSibling;
      if (depth3 && depth3.classList.contains("depth3")) slideUp(depth3);
    });
  });

  // 전체 펼치기
  allOpenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    depth2Items.forEach((item) => {
      if (item.classList.contains("on")) return;
      item.classList.add("on");
      const depth3 = item.nextElementSibling;
      if (depth3 && depth3.classList.contains("depth3")) slideDown(depth3);
    });
  });

  depth2Items.forEach((item) => {
    const depth3 = item.nextElementSibling;
    if (depth3 && depth3.classList.contains("depth3")) {
      depth3.style.display = "none";
      depth3.style.height = "0";
      depth3.style.overflow = "hidden";
    }

    item.addEventListener("click", (e) => {
      e.preventDefault();
      const depth3 = item.nextElementSibling;
      if (item.classList.contains("on")) {
        item.classList.remove("on");
        slideUp(depth3);
      } else {
        item.classList.add("on");
        slideDown(depth3);
      }
    });
  });

  //---------------------lnb 접고 펼치기---------------------
  const smenu = document.querySelector(".smenu");
  const foldBtn = document.querySelector(".btn-smenu-fold");
  const tooltipText = foldBtn.querySelector(".tooltip-text");

  foldBtn.addEventListener("click", function (e) {
    e.preventDefault();

    smenu.classList.toggle("folded");
    foldBtn.classList.toggle("off");

    // 접힘 여부 확인 후 텍스트 변경
    if (smenu.classList.contains("folded")) {
      tooltipText.textContent = "펼치기";
    } else {
      tooltipText.textContent = "접기";
    }
  });

  //---------------------레이어 팝업---------------------
  const popButtons = document.querySelectorAll(".btn-pop-small-open"); // 작은 팝업 버튼
  const popLayers = document.querySelectorAll(".pop-small");

  popButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const target = document.querySelector(btn.dataset.target);
      if (!target) return;

      if (target.style.display === "block") {
        closePopup(target);
      } else {
        openPopup(target);
      }
    });
  });

  popLayers.forEach((pop) => {
    const closeBtn = pop.querySelector(".pop-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closePopup(pop);
      });
    }
  });

  function openPopup(pop) {
    pop.style.display = "block";
    requestAnimationFrame(() => {
      pop.style.opacity = "1";
      pop.style.transform = "translateY(0)";
      pop.classList.add("active");
    });
  }

  function closePopup(pop) {
    pop.style.opacity = "0";
    pop.style.transform = "translateY(-10px)";
    pop.classList.remove("active");
    pop.addEventListener("transitionend", function handler() {
      pop.style.display = "none";
      pop.removeEventListener("transitionend", handler);
    });
  }

  // 바깥 클릭 시 작은 팝업 닫기
  document.addEventListener("click", function (e) {
    popLayers.forEach((pop) => {
      if (
        !pop.contains(e.target) &&
        ![...popButtons].some((btn) => btn.contains(e.target))
      ) {
        if (pop.style.display === "block") {
          closePopup(pop);
        }
      }
    });
  });

  // ========================
  // 레이어 팝업 (딤 + 최대화 지원)
  // ========================
  const dim = document.querySelector(".dimmed");
  const layerButtons = document.querySelectorAll(".btn-pop-open");
  const layerPops = document.querySelectorAll(".pop-wrap");

  layerButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(btn.dataset.target);
      if (!target) return;

      openLayerPopup(target);
    });
  });

  function openLayerPopup(pop) {
    dim.style.display = "block";
    pop.style.display = "flex";

    requestAnimationFrame(() => {
      dim.classList.add("active");
      pop.classList.add("active");
    });

    const closeBtns = pop.querySelectorAll(".btn-pop-close");
    const maxBtn = pop.querySelector(".pop-maximize");

    closeBtns.forEach((btn) => {
      btn.onclick = () => closeLayerPopup(pop);
    });
    if (maxBtn) {
      maxBtn.onclick = () => pop.classList.toggle("maximized");
    }
  }

  function closeLayerPopup(pop) {
    dim.classList.remove("active");
    pop.classList.remove("active");

    dim.addEventListener("transitionend", function handler() {
      dim.style.display = "none";
      pop.style.display = "none";
      dim.removeEventListener("transitionend", handler);
    });
  }

  // 딤 클릭 시 팝업 닫기
  if (dim) {
    dim.addEventListener("click", () => {
      layerPops.forEach((pop) => {
        if (pop.classList.contains("active")) {
          closeLayerPopup(pop);
        }
      });
    });
  }

  //---------------------상단탭---------------------
  document.querySelectorAll(".top-tab").forEach((topTab) => {
    const tabCon = topTab.querySelector(".top-tab__con");
    const btnWrap = topTab.querySelector(".top-tab__btn");
    const btnPrev = topTab.querySelector(".btn-prev");
    const btnNext = topTab.querySelector(".btn-next");

    // 스크롤 상태 확인
    function checkOverflow() {
      const isOverflow = tabCon.scrollWidth > tabCon.clientWidth;
      btnWrap.classList.toggle("active", isOverflow);

      btnPrev.style.opacity = tabCon.scrollLeft > 0 ? "1" : "0.3";
      btnPrev.style.pointerEvents = tabCon.scrollLeft > 0 ? "auto" : "none";

      const maxScroll = tabCon.scrollWidth - tabCon.clientWidth;
      btnNext.style.opacity = tabCon.scrollLeft < maxScroll ? "1" : "0.3";
      btnNext.style.pointerEvents =
        tabCon.scrollLeft < maxScroll ? "auto" : "none";
    }

    // prev/next 클릭
    btnPrev.addEventListener("click", () => {
      const tabWidth = tabCon.querySelector("li")?.offsetWidth || 100;
      tabCon.scrollLeft -= tabWidth;
      setTimeout(checkOverflow, 100);
    });

    btnNext.addEventListener("click", () => {
      const tabWidth = tabCon.querySelector("li")?.offsetWidth || 100;
      tabCon.scrollLeft += tabWidth;
      setTimeout(checkOverflow, 100);
    });

    window.addEventListener("resize", checkOverflow);
    checkOverflow();
  });

  // ----------------------팝업-알림탭---------------------
  const tabs = document.querySelectorAll(".pop-tab a");
  const noticeBoxes = document.querySelectorAll(".notice-box");

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      // 탭 active 처리
      tabs.forEach((t) => t.classList.remove("on"));
      tab.classList.add("on");

      // 초기화
      noticeBoxes.forEach((box) => {
        box.style.display = "none";
        box.classList.remove("notice-all");
      });

      if (idx === 0) {
        // 전체 탭 → 전부 보이기 + notice-all 클래스 추가
        noticeBoxes.forEach((box) => {
          box.style.display = "block";
          box.classList.add("notice-all");
        });
      } else {
        // 해당 순번만 보이기 (idx-1 = noticeBox 순번)
        const targetBox = noticeBoxes[idx - 1];
        if (targetBox) {
          targetBox.style.display = "block";
        }
      }
    });
  });

  // ----------------------[인사기본]이름검색---------------------
  const autoInput = document.getElementById("auto-input");
  const nameSearchBtn = document.querySelector(".hr-situation__search");

  autoInput.readOnly = true;

  function resizeAutoInput() {
    const tmp = document.createElement("span");
    tmp.style.visibility = "hidden";
    tmp.style.position = "absolute";
    tmp.style.font = window.getComputedStyle(autoInput).font;
    tmp.textContent = autoInput.value || autoInput.placeholder;
    document.body.appendChild(tmp);
    autoInput.style.width = tmp.offsetWidth + 10 + "px";
    document.body.removeChild(tmp);
  }

  resizeAutoInput();

  nameSearchBtn.addEventListener("click", () => {
    autoInput.readOnly = false;
    autoInput.value = "";
    autoInput.focus();
    resizeAutoInput();
  });
  autoInput.addEventListener("input", resizeAutoInput);

  // ---------------------- 테마설정/다크모드 ---------------------

  // --- 테마 관리 ---
  const themeItems = document.querySelectorAll(".theme-setting li");

  // JS에서 테마별 색상 정의
  const themes = {
    BLUE: { primary: "#1277e7", secondary: "#23385e", red: "#E64F56" },
    GREEN: { primary: "#44C378", secondary: "#EAF5E9", red: "#E64F56" },
    RED: { primary: "#E64F56", secondary: "#F5E9E9", red: "#E64F56" },
    BLACK: { primary: "#AAA", secondary: "#EEE", red: "#E64F56" },
  };

  function applyTheme(themeName) {
    const selectedTheme = themes[themeName];
    if (!selectedTheme) return;

    document.documentElement.style.setProperty(
      "--primary-color",
      selectedTheme.primary
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      selectedTheme.secondary
    );
    document.documentElement.style.setProperty(
      "--red-color",
      selectedTheme.red
    );

    localStorage.setItem("theme", themeName);
  }

  themeItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      themeItems.forEach((i) => i.classList.remove("on"));
      item.classList.add("on");

      const themeName = item.querySelector("p").textContent.toUpperCase();
      applyTheme(themeName);
    });
  });

  // 새로고침 시 저장된 테마 적용
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
    themeItems.forEach((i) => {
      const name = i.querySelector("p").textContent.toUpperCase();
      i.classList.toggle("on", name === savedTheme);
    });
  }

  // --- 다크모드 토글 ---
  const darkToggle = document.querySelector("#darkmode-toggle");
  const darkIcon = darkToggle.querySelector(".ico-darkmode");
  const darkText = darkToggle.querySelector(".tooltip-text");

  function applyDarkMode(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    darkText.textContent = isDark ? "라이트모드" : "다크모드";
    darkIcon.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark);
  }

  darkToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.documentElement.dataset.theme !== "dark";
    applyDarkMode(isDark);
  });

  // 새로고침 시 다크모드 상태 유지
  const savedDark = localStorage.getItem("darkMode") === "true";
  applyDarkMode(savedDark);
});
