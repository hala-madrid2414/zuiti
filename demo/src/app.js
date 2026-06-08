(function () {
  const STORAGE_KEY = "zuiti-offline-demo-v1";
  const DEFAULT_DRAFT = {
    scene: null,
    text: "",
    style: "boundary",
    sliders: {
      politeness: 76,
      formality: 58,
      distance: 62,
    },
  };

  const SCENES = [
    { key: "student", title: "学生沟通", subtitle: "与老师同学" },
    { key: "work", title: "职场沟通", subtitle: "与同事领导" },
    { key: "social", title: "社交沟通", subtitle: "与朋友合作方" },
    { key: "formal", title: "正式事务", subtitle: "与机构/行政" },
  ];

  const STYLES = [
    { key: "delay", title: "先别急", detail: "体面延期" },
    { key: "refuse", title: "婉拒了哈", detail: "柔和拒绝" },
    { key: "boundary", title: "别甩给我", detail: "边界清晰" },
    { key: "followup", title: "该交了吧", detail: "礼貌推进" },
    { key: "decode", title: "翻译一下", detail: "转译语气" },
    { key: "sarcasm", title: "阴阳一下", detail: "微妙反差" },
  ];

  const SCENE_EXAMPLES = {
    student: "老师，这部分我还需要再确认一下，能不能晚一点交？",
    work: "这个需求不在我负责范围里，但我可以帮你对接对应同事。",
    social: "这周末我先看看安排，晚一点再和你确认。",
    formal: "您好，想跟进一下此前提交事项的当前处理进度。",
  };

  function cloneDefaultDraft() {
    return JSON.parse(JSON.stringify(DEFAULT_DRAFT));
  }

  function readDraft() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return cloneDefaultDraft();
      }

      const parsed = JSON.parse(raw);
      return {
        scene: parsed.scene || null,
        text: typeof parsed.text === "string" ? parsed.text : "",
        style: typeof parsed.style === "string" ? parsed.style : "boundary",
        sliders: {
          politeness: Number(parsed.sliders?.politeness) || DEFAULT_DRAFT.sliders.politeness,
          formality: Number(parsed.sliders?.formality) || DEFAULT_DRAFT.sliders.formality,
          distance: Number(parsed.sliders?.distance) || DEFAULT_DRAFT.sliders.distance,
        },
      };
    } catch {
      return cloneDefaultDraft();
    }
  }

  function saveDraft(draft) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }

  function patchDraft(partial) {
    const nextDraft = {
      ...readDraft(),
      ...partial,
      sliders: {
        ...readDraft().sliders,
        ...(partial.sliders || {}),
      },
    };

    saveDraft(nextDraft);
    return nextDraft;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getSceneMeta(sceneKey) {
    return SCENES.find((item) => item.key === sceneKey) || SCENES[1];
  }

  function getStyleMeta(styleKey) {
    return STYLES.find((item) => item.key === styleKey) || STYLES[2];
  }

  function isReadyForResults(draft) {
    return Boolean(draft.scene && draft.text.trim().length >= 2);
  }

  function toneDistance(a, b) {
    return (
      Math.abs(a.politeness - b.politeness) +
      Math.abs(a.formality - b.formality) +
      Math.abs(a.distance - b.distance)
    );
  }

  function findBestMock(draft) {
    const dataset = Array.isArray(window.ZUITI_DEMO_MOCKS) ? window.ZUITI_DEMO_MOCKS : [];
    const sameStyle = dataset.filter((item) => item.style === draft.style);
    const sameSceneAndStyle = sameStyle.filter((item) => item.scene === draft.scene);
    const pool = sameSceneAndStyle.length > 0 ? sameSceneAndStyle : sameStyle.length > 0 ? sameStyle : dataset;

    return (
      pool
        .map((item) => ({
          item: item,
          score: toneDistance(item.tone, draft.sliders),
        }))
        .sort((left, right) => left.score - right.score)[0]?.item || null
    );
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timerId);
    showToast.timerId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function renderSceneButtons(activeScene) {
    return SCENES.map((scene) => {
      const activeClass = scene.key === activeScene ? " is-active" : "";
      return (
        '<button type="button" class="scene-card' +
        activeClass +
        '" data-scene="' +
        scene.key +
        '">' +
        '<span class="scene-title">' +
        escapeHtml(scene.title) +
        "</span>" +
        '<span class="scene-subtitle">' +
        escapeHtml(scene.subtitle) +
        "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderStyleButtons(activeStyle) {
    return STYLES.map((style) => {
      const activeClass = style.key === activeStyle ? " is-active" : "";
      return (
        '<button type="button" class="style-card' +
        activeClass +
        '" data-style="' +
        style.key +
        '">' +
        '<strong>' +
        escapeHtml(style.title) +
        "</strong>" +
        "<span>" +
        escapeHtml(style.detail) +
        "</span>" +
        "</button>"
      );
    }).join("");
  }

  function buildPreviewText(draft) {
    const style = getStyleMeta(draft.style);

    if (draft.sliders.formality >= 78) {
      return "当前更偏正式、稳妥，适合老师、领导或机构沟通。";
    }

    if (draft.sliders.distance <= 36) {
      return "当前更偏自然口语，适合熟人之间表达，但依然保留分寸。";
    }

    if (draft.sliders.politeness >= 84) {
      return "当前更偏礼貌缓冲，适合需要先稳住关系再表达诉求。";
    }

    return "当前风格偏“" + style.title + "”，会尽量把态度和边界说清楚。";
  }

  function renderResultCard(title, fit, text, tags, copyValue) {
    return (
      '<article class="result-card soft-card">' +
      '<div class="result-head">' +
      "<div>" +
      '<h3 class="result-title">' +
      escapeHtml(title) +
      "</h3>" +
      '<p class="result-fit">' +
      escapeHtml(fit) +
      "</p>" +
      "</div>" +
      '<button type="button" class="ghost-button copy-button" data-copy="' +
      escapeHtml(copyValue) +
      '">复制</button>' +
      "</div>" +
      '<p class="result-text">' +
      escapeHtml(text) +
      "</p>" +
      '<div class="tag-row">' +
      tags.map((tag) => '<span class="tag">' + escapeHtml(tag) + "</span>").join("") +
      "</div>" +
      "</article>"
    );
  }

  function bindGlobalActions() {
    document.addEventListener("click", function (event) {
      const copyButton = event.target.closest("[data-copy]");
      if (copyButton) {
        const value = copyButton.getAttribute("data-copy") || "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(
            function () {
              showToast("已复制到剪贴板");
            },
            function () {
              showToast("复制失败，请手动长按复制");
            }
          );
        } else {
          showToast("当前环境不支持自动复制");
        }
      }

      const feedbackButton = event.target.closest("[data-feedback]");
      if (feedbackButton) {
        showToast("已记录本地反馈，仅用于 Demo 演示");
      }
    });
  }

  function setupHomePage() {
    const draft = readDraft();
    const sceneGrid = document.getElementById("scene-grid");
    const primaryButton = document.getElementById("home-primary");
    if (!sceneGrid || !primaryButton) {
      return;
    }

    sceneGrid.innerHTML = renderSceneButtons(draft.scene);

    sceneGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-scene]");
      if (!button) {
        return;
      }

      const nextScene = button.getAttribute("data-scene");
      patchDraft({ scene: nextScene });
      window.location.href = "./input.html";
    });

    primaryButton.addEventListener("click", function (event) {
      if (!draft.scene) {
        patchDraft({ scene: "work" });
      }
      event.preventDefault();
      window.location.href = "./input.html";
    });
  }

  function setupInputPage() {
    const sceneGrid = document.getElementById("input-scene-grid");
    const styleGrid = document.getElementById("style-grid");
    const textArea = document.getElementById("raw-input");
    const continueButton = document.getElementById("input-continue");
    const exampleButton = document.getElementById("fill-example");
    const clearButton = document.getElementById("clear-input");
    const sceneBadge = document.getElementById("scene-badge");

    if (!sceneGrid || !styleGrid || !textArea || !continueButton || !sceneBadge) {
      return;
    }

    let draft = readDraft();
    textArea.value = draft.text;
    sceneGrid.innerHTML = renderSceneButtons(draft.scene);
    styleGrid.innerHTML = renderStyleButtons(draft.style);

    function sync() {
      draft = readDraft();
      const sceneMeta = getSceneMeta(draft.scene);
      sceneBadge.textContent = draft.scene ? sceneMeta.title + " · " + sceneMeta.subtitle : "请先选一个场景";
      continueButton.classList.toggle("is-disabled", !isReadyForResults(draft));
      continueButton.setAttribute("aria-disabled", String(!isReadyForResults(draft)));
      sceneGrid.innerHTML = renderSceneButtons(draft.scene);
      styleGrid.innerHTML = renderStyleButtons(draft.style);
    }

    sceneGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-scene]");
      if (!button) {
        return;
      }

      patchDraft({ scene: button.getAttribute("data-scene") });
      sync();
    });

    styleGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-style]");
      if (!button) {
        return;
      }

      patchDraft({ style: button.getAttribute("data-style") });
      sync();
    });

    textArea.addEventListener("input", function () {
      patchDraft({ text: textArea.value });
      sync();
    });

    if (exampleButton) {
      exampleButton.addEventListener("click", function () {
        const currentDraft = readDraft();
        const sceneKey = currentDraft.scene || "work";
        textArea.value = SCENE_EXAMPLES[sceneKey];
        patchDraft({ scene: sceneKey, text: textArea.value });
        sync();
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        textArea.value = "";
        patchDraft({ text: "" });
        sync();
      });
    }

    continueButton.addEventListener("click", function () {
      if (!isReadyForResults(readDraft())) {
        showToast("请先选择场景并输入至少 2 个字");
        return;
      }

      window.location.href = "./tone.html";
    });

    sync();
  }

  function setupTonePage() {
    const draft = readDraft();
    const missingState = document.getElementById("tone-missing");
    const content = document.getElementById("tone-content");
    const preview = document.getElementById("tone-preview");
    const continueButton = document.getElementById("tone-continue");
    const resetButton = document.getElementById("reset-sliders");
    const sliderKeys = ["politeness", "formality", "distance"];

    if (!missingState || !content || !preview || !continueButton) {
      return;
    }

    if (!isReadyForResults(draft)) {
      missingState.hidden = false;
      content.hidden = true;
      continueButton.textContent = "返回输入";
      continueButton.addEventListener("click", function () {
        window.location.href = "./input.html";
      });
      return;
    }

    missingState.hidden = true;
    content.hidden = false;

    function sync() {
      const currentDraft = readDraft();
      preview.textContent = buildPreviewText(currentDraft);
      sliderKeys.forEach(function (key) {
        const input = document.querySelector('[data-slider="' + key + '"]');
        const value = document.querySelector('[data-slider-value="' + key + '"]');
        if (input) {
          input.value = String(currentDraft.sliders[key]);
        }
        if (value) {
          value.textContent = String(currentDraft.sliders[key]);
        }
      });
    }

    sliderKeys.forEach(function (key) {
      const input = document.querySelector('[data-slider="' + key + '"]');
      if (!input) {
        return;
      }

      input.addEventListener("input", function () {
        const value = Number(input.value);
        const currentDraft = readDraft();
        patchDraft({
          sliders: {
            politeness: currentDraft.sliders.politeness,
            formality: currentDraft.sliders.formality,
            distance: currentDraft.sliders.distance,
            [key]: value,
          },
        });
        sync();
      });
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        patchDraft({
          sliders: {
            politeness: DEFAULT_DRAFT.sliders.politeness,
            formality: DEFAULT_DRAFT.sliders.formality,
            distance: DEFAULT_DRAFT.sliders.distance,
          },
        });
        sync();
      });
    }

    continueButton.addEventListener("click", function () {
      window.location.href = "./results.html";
    });

    sync();
  }

  function setupResultsPage() {
    const original = document.getElementById("original-text");
    const resultList = document.getElementById("result-list");
    const missingState = document.getElementById("results-missing");
    const content = document.getElementById("results-content");
    const matchedInfo = document.getElementById("matched-info");
    const sceneInfo = document.getElementById("results-scene");
    const styleInfo = document.getElementById("results-style");
    const draft = readDraft();

    if (!original || !resultList || !missingState || !content || !matchedInfo || !sceneInfo || !styleInfo) {
      return;
    }

    if (!isReadyForResults(draft)) {
      missingState.hidden = false;
      content.hidden = true;
      return;
    }

    missingState.hidden = true;
    content.hidden = false;

    const matched = findBestMock(draft);
    const sceneMeta = getSceneMeta(draft.scene);
    const styleMeta = getStyleMeta(draft.style);
    original.textContent = draft.text.trim();
    sceneInfo.textContent = sceneMeta.title;
    styleInfo.textContent = styleMeta.title + " / " + styleMeta.detail;

    if (!matched) {
      matchedInfo.textContent = "未找到样本，当前页面仅展示 Demo 壳层。";
      return;
    }

    matchedInfo.textContent =
      "本次命中样本：" +
      matched.id +
      "。结果完全来自本地 mock 数据，不依赖网络请求。";

    resultList.innerHTML =
      renderResultCard("微信短句版", "适合微信/IM", matched.outputs.wechat, matched.tags, matched.outputs.wechat) +
      renderResultCard("邮件正式版", "适合邮件/书面沟通", matched.outputs.email, matched.tags, matched.outputs.email) +
      renderResultCard("当面沟通版", "适合口语表达", matched.outputs.spoken, matched.tags, matched.outputs.spoken);
  }

  function init() {
    bindGlobalActions();

    const page = document.body.getAttribute("data-page");
    if (page === "home") {
      setupHomePage();
    }
    if (page === "input") {
      setupInputPage();
    }
    if (page === "tone") {
      setupTonePage();
    }
    if (page === "results") {
      setupResultsPage();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
