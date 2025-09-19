document.addEventListener("DOMContentLoaded", () => {
  // ====================== LNB ======================
  const menu = document.querySelector(".smenu");
  if (menu) {
    const allCloseBtn = menu.querySelector(".smenu-all-close");
    const allOpenBtn = menu.querySelector(".smenu-all-open");
    const depth2Items = menu.querySelectorAll(".depth2.has-child");

    const slideDown = (el) => {
      if (el.sliding) return;
      el.sliding = true;
      el.style.display = "block";
      const height = el.scrollHeight + "px";
      el.style.height = "0";
      requestAnimationFrame(() => {
        el.style.transition = "height 0.3s ease";
        el.style.height = height;
      });
      const onEnd = () => {
        el.style.height = "auto";
        el.style.transition = "";
        el.sliding = false;
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    };

    const slideUp = (el) => {
      if (el.sliding) return;
      el.sliding = true;
      el.style.height = el.scrollHeight + "px";
      requestAnimationFrame(() => {
        el.style.transition = "height 0.3s ease";
        el.style.height = "0";
      });
      const onEnd = () => {
        el.style.display = "none";
        el.style.transition = "";
        el.sliding = false;
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    };

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

    const foldBtn = document.querySelector(".btn-smenu-fold");
    const tooltipText = foldBtn?.querySelector(".tooltip-text");
    foldBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      menu.classList.toggle("folded");
      foldBtn.classList.toggle("off");
      if (tooltipText) {
        tooltipText.textContent = menu.classList.contains("folded")
          ? "펼치기"
          : "접기";
      }
    });
  }

  // ====================== 작은 팝업 ======================
  const popButtons = document.querySelectorAll(".btn-pop-small-open");
  const popLayers = document.querySelectorAll(".pop-small");

  const openPopup = (pop) => {
    pop.style.display = "block";
    requestAnimationFrame(() => {
      pop.style.opacity = "1";
      pop.style.transform = "translateY(0)";
      pop.classList.add("active");
    });
  };

  const closePopup = (pop) => {
    pop.style.opacity = "0";
    pop.style.transform = "translateY(-10px)";
    pop.classList.remove("active");
    const handler = () => {
      pop.style.display = "none";
      pop.removeEventListener("transitionend", handler);
    };
    pop.addEventListener("transitionend", handler);
  };

  popButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = document.querySelector(btn.dataset.target);
      if (!target) return;
      target.style.display === "block" ? closePopup(target) : openPopup(target);
    });
  });

  popLayers.forEach((pop) => {
    const closeBtn = pop.querySelector(".pop-close");
    closeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePopup(pop);
    });
  });

  document.addEventListener("click", (e) => {
    popLayers.forEach((pop) => {
      if (
        !pop.contains(e.target) &&
        ![...popButtons].some((btn) => btn.contains(e.target))
      ) {
        if (pop.style.display === "block") closePopup(pop);
      }
    });
  });

  // ====================== 레이어 팝업 (딤 + 최대화) ======================
  const dim = document.querySelector(".dimmed");
  const layerPops = document.querySelectorAll(".pop-wrap");
  if (dim && layerPops.length) {
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
          if (tooltipText)
            tooltipText.textContent = isMaximized ? "이전 크기로" : "최대화";
        });
        maxBtn.dataset.listenerAdded = "true";
      }
    };

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

    dim.addEventListener("click", () => {
      layerPops.forEach((pop) => {
        if (pop.classList.contains("active")) closeLayerPopup(pop);
      });
    });
  }

  // ====================== 상단 탭 ======================
  document.querySelectorAll(".top-tab").forEach((topTab) => {
    const tabCon = topTab.querySelector(".top-tab__con");
    const btnWrap = topTab.querySelector(".top-tab__btn");
    const btnPrev = topTab.querySelector(".btn-prev");
    const btnNext = topTab.querySelector(".btn-next");
    if (!tabCon || !btnWrap) return;

    const checkOverflow = () => {
      const isOverflow = tabCon.scrollWidth > tabCon.clientWidth;
      btnWrap.classList.toggle("active", isOverflow);
      btnPrev.style.opacity = tabCon.scrollLeft > 0 ? "1" : "0.3";
      btnPrev.style.pointerEvents = tabCon.scrollLeft > 0 ? "auto" : "none";
      const maxScroll = tabCon.scrollWidth - tabCon.clientWidth;
      btnNext.style.opacity = tabCon.scrollLeft < maxScroll ? "1" : "0.3";
      btnNext.style.pointerEvents =
        tabCon.scrollLeft < maxScroll ? "auto" : "none";
    };

    btnPrev?.addEventListener("click", () => {
      const tabWidth = tabCon.querySelector("li")?.offsetWidth || 100;
      tabCon.scrollLeft -= tabWidth;
      setTimeout(checkOverflow, 100);
    });
    btnNext?.addEventListener("click", () => {
      const tabWidth = tabCon.querySelector("li")?.offsetWidth || 100;
      tabCon.scrollLeft += tabWidth;
      setTimeout(checkOverflow, 100);
    });

    tabCon.querySelectorAll("li").forEach((tabItem) => {
      const menu = tabItem.querySelector(".top-tab__menu");
      tabItem.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (!menu) return;
        document
          .querySelectorAll(".top-tab__menu")
          .forEach((m) => (m.style.display = "none"));
        if (menu.parentElement !== topTab) topTab.appendChild(menu);
        const liRect = tabItem.getBoundingClientRect();
        const tabRect = topTab.getBoundingClientRect();
        menu.style.display = "block";
        menu.style.position = "absolute";
        menu.style.left = liRect.left - tabRect.left + 30 + "px";
        menu.style.top = liRect.bottom - tabRect.top - 5 + "px";
        menu.style.zIndex = 9999;
      });
    });

    document.addEventListener("click", (e) => {
      document.querySelectorAll(".top-tab__menu").forEach((menu) => {
        const link = menu.parentElement.querySelector("a");
        if (!menu.contains(e.target) && !link?.contains(e.target))
          menu.style.display = "none";
      });
    });

    window.addEventListener("resize", checkOverflow);
    checkOverflow();
  });

  // ====================== 팝업-알림탭 ======================
  const tabs = document.querySelectorAll(".pop-tab a");
  const noticeBoxes = document.querySelectorAll(".notice-box");

  if (tabs.length && noticeBoxes.length) {
    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("on"));
        tab.classList.add("on");

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
          if (targetBox) targetBox.style.display = "block";
        }
      });
    });

    document.querySelectorAll(".list-wrap__con tbody td").forEach((td) => {
      td.addEventListener("click", function () {
        document
          .querySelectorAll(".list-wrap__con tbody tr")
          .forEach((tr) => tr.classList.remove("selected"));
        this.parentElement.classList.add("selected");
      });
    });
  }

  // ====================== 이름 검색 ======================
  const autoInput = document.getElementById("auto-input");
  const nameSearchBtn = document.querySelector(".hr-situation__search");
  if (autoInput && nameSearchBtn) {
    autoInput.readOnly = true;
    const resizeAutoInput = () => {
      const tmp = document.createElement("span");
      tmp.style.visibility = "hidden";
      tmp.style.position = "absolute";
      tmp.style.font = window.getComputedStyle(autoInput).font;
      tmp.textContent = autoInput.value || autoInput.placeholder;
      document.body.appendChild(tmp);
      autoInput.style.width = tmp.offsetWidth + 10 + "px";
      document.body.removeChild(tmp);
    };
    resizeAutoInput();
    nameSearchBtn.addEventListener("click", () => {
      autoInput.readOnly = false;
      autoInput.value = "";
      autoInput.focus();
      resizeAutoInput();
    });
    autoInput.addEventListener("input", resizeAutoInput);
  }

  // ====================== 테마 / 다크모드 ======================
  const themeItems = document.querySelectorAll(".theme-setting .theme-item");
  const applyTheme = (themeName) => {
    document.documentElement.dataset.themeColor = themeName.toLowerCase();
    localStorage.setItem("themeColor", themeName);
  };
  themeItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      themeItems.forEach((i) => i.classList.remove("on"));
      item.classList.add("on");
      const themeName = item.querySelector("p").textContent;
      applyTheme(themeName);
    });
  });
  const savedTheme = localStorage.getItem("themeColor");
  if (savedTheme) {
    applyTheme(savedTheme);
    themeItems.forEach((i) => {
      const name = i.querySelector("p").textContent;
      i.classList.toggle("on", name === savedTheme);
    });
  }

  const darkToggle = document.querySelector("#darkmode-toggle");
  const darkIcon = darkToggle?.querySelector(".ico-darkmode");
  const darkText = darkToggle?.querySelector(".tooltip-text");
  const applyDarkMode = (isDark) => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    if (darkText) darkText.textContent = isDark ? "라이트모드" : "다크모드";
    darkIcon?.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", isDark);
  };
  if (darkToggle) {
    darkToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isDark = document.documentElement.dataset.theme !== "dark";
      applyDarkMode(isDark);
    });
  }
  const savedDark = localStorage.getItem("darkMode") === "true";
  applyDarkMode(savedDark);
});

// ====================== 이전페이지로 이동 ======================
function goBack() {
  if (document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "/";
  }
}
