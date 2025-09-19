document.addEventListener("DOMContentLoaded", () => {
  // ---------------------lnb---------------------
  const menu = document.querySelector(".smenu");
  if (!menu) return;
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
  if (allCloseBtn) {
    allCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      depth2Items.forEach((item) => {
        if (!item.classList.contains("on")) return;
        item.classList.remove("on");
        const depth3 = item.nextElementSibling;
        if (depth3 && depth3.classList.contains("depth3")) slideUp(depth3);
      });
    });
  }

  // 전체 펼치기
  if (allOpenBtn) {
    allOpenBtn.addEventListener("click", (e) => {
      e.preventDefault();
      depth2Items.forEach((item) => {
        if (item.classList.contains("on")) return;
        item.classList.add("on");
        const depth3 = item.nextElementSibling;
        if (depth3 && depth3.classList.contains("depth3")) slideDown(depth3);
      });
    });
  }

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

  // 레이어 팝업 (딤 + 최대화)
  const dim = document.querySelector(".dimmed");
  const layerPops = document.querySelectorAll(".pop-wrap");
  if (!dim || layerPops.length === 0) return;

  // 팝업 열기
  const openLayerPopup = (pop) => {
    if (!pop) return;
    dim.style.display = "block";
    pop.style.display = "flex";

    requestAnimationFrame(() => {
      dim.classList.add("active");
      pop.classList.add("active");
    });

    const closeBtns = pop.querySelectorAll(".btn-pop-close");
    closeBtns.forEach((btn) => {
      if (!btn.dataset.listenerAdded) {
        btn.addEventListener("click", () => closeLayerPopup(pop));
        btn.dataset.listenerAdded = "true";
      }
    });

    const maxBtn = pop.querySelector(".pop-maximize");
    if (maxBtn && !maxBtn.dataset.listenerAdded) {
      maxBtn.addEventListener("click", () => {
        const isMaximized = pop.classList.toggle("maximized");
        const tooltipText = maxBtn.querySelector(".tooltip-text");
        if (tooltipText) {
          tooltipText.textContent = isMaximized ? "이전 크기로" : "최대화";
        }
      });
      maxBtn.dataset.listenerAdded = "true";
    }
  };

  // 팝업 닫기
  const closeLayerPopup = (pop) => {
    if (!pop) return;
    dim.classList.remove("active");
    pop.classList.remove("active");

    const handler = () => {
      dim.style.display = "none";
      pop.style.display = "none";
      dim.removeEventListener("transitionend", handler);
    };
    dim.addEventListener("transitionend", handler);
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-pop-open");
    if (!btn) return;
    e.preventDefault();

    const target = document.querySelector(btn.dataset.target);
    if (!target) return;

    openLayerPopup(target);
  });

  // 딤 클릭 시 활성 팝업 닫기
  dim.addEventListener("click", () => {
    layerPops.forEach((pop) => {
      if (pop.classList.contains("active")) {
        closeLayerPopup(pop);
      }
    });
  });

  //---------------------상단탭---------------------
  document.querySelectorAll(".top-tab").forEach((topTab) => {
    const tabCon = topTab.querySelector(".top-tab__con");
    const btnWrap = topTab.querySelector(".top-tab__btn");
    const btnPrev = topTab.querySelector(".btn-prev");
    const btnNext = topTab.querySelector(".btn-next");

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

    tabCon.querySelectorAll("li").forEach((tabItem) => {
      const menu = tabItem.querySelector(".top-tab__menu");

      tabItem.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (!menu) return;

        document.querySelectorAll(".top-tab__menu").forEach((m) => {
          m.style.display = "none";
        });

        if (menu.parentElement !== topTab) {
          topTab.appendChild(menu);
        }

        const liRect = tabItem.getBoundingClientRect();
        const tabRect = topTab.getBoundingClientRect();

        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = liRect.left - tabRect.left + 30 + "px";
        menu.style.top = liRect.bottom - tabRect.top - 5 + "px";
        menu.style.zIndex = 9999;
      });
    });

    // 메뉴 외부 클릭 시 메뉴 닫기
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".top-tab__menu").forEach((menu) => {
        if (
          !menu.contains(e.target) &&
          !menu.parentElement.querySelector("a").contains(e.target)
        ) {
          menu.style.display = "none";
        }
      });
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
        noticeBoxes.forEach((box) => {
          box.style.display = "block";
          box.classList.add("notice-all");
        });
      } else {
        const targetBox = noticeBoxes[idx - 1];
        if (targetBox) {
          targetBox.style.display = "block";
        }
      }
    });

    // ---------------------- list table tr mouseover event --------------------- //
    document.querySelectorAll(".list-wrap__con tbody td").forEach((td) => {
      td.addEventListener("click", function () {
        document
          .querySelectorAll(".list-wrap__con tbody tr")
          .forEach((tr) => tr.classList.remove("selected"));

        this.parentElement.classList.add("selected");
      });
    });
  });

  // ----------------------[인사기본]이름검색---------------------
  const autoInput = document.getElementById("auto-input");
  const nameSearchBtn = document.querySelector(".hr-situation__search");

  if (autoInput && nameSearchBtn) {
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
  }

  // ---------------------- 테마설정/다크모드 --------------------- //
  const themeItems = document.querySelectorAll(".theme-setting .theme-item");

  function applyTheme(themeName) {
    document.documentElement.dataset.themeColor = themeName.toLowerCase(); // 색상 테마
    localStorage.setItem("themeColor", themeName);
  }

  // 컬러 버튼 클릭
  themeItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      themeItems.forEach((i) => i.classList.remove("on"));
      item.classList.add("on");

      const themeName = item.querySelector("p").textContent;
      applyTheme(themeName);
    });
  });

  // 새로고침 시 저장된 테마 복원
  const savedTheme = localStorage.getItem("themeColor");
  if (savedTheme) {
    applyTheme(savedTheme);
    themeItems.forEach((i) => {
      const name = i.querySelector("p").textContent;
      i.classList.toggle("on", name === savedTheme);
    });
  }

  // 다크모드 적용
  const darkToggle = document.querySelector("#darkmode-toggle");
  const darkIcon = darkToggle.querySelector(".ico-darkmode");
  const darkText = darkToggle.querySelector(".tooltip-text");

  function applyDarkMode(isDark) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light"; // 모드
    darkText.textContent = isDark ? "라이트모드" : "다크모드";
    darkIcon.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark);
  }

  // 다크모드 토글
  darkToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isDark = document.documentElement.dataset.theme !== "dark";
    applyDarkMode(isDark);
  });

  // 새로고침 시 상태 유지
  const savedDark = localStorage.getItem("darkMode") === "true";
  applyDarkMode(savedDark);
});
